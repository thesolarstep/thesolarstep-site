/**
 * Aditya Research Website - Main Script
 * Includes: Background Animation, Scroll Reveal, Navigation, and Filtering
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Logic
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 1000);
    });

    // 2. Background Canvas Animation
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.alpha = Math.random() * 0.5 + 0.1;
            // Distinguish between 'star' (circle) and 'microbe' (slight ellipse)
            this.type = Math.random() > 0.7 ? 'microbe' : 'star';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(226, 226, 222, ${this.alpha})`;
            ctx.beginPath();
            if (this.type === 'star') {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            } else {
                // Draw a subtle ellipse/microbe shape
                ctx.ellipse(this.x, this.y, this.size * 2, this.size, Math.random() * Math.PI, 0, Math.PI * 2);
            }
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        const count = Math.floor((width * height) / 10000);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    // 3. Navigation Logic
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksList = document.querySelector('.nav-links');

    // Sticky Navbar & Active State
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Navigation Toggle
    mobileNavToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
        // Simple CSS-in-JS for mobile menu if needed, but we'll stick to a toggle class
        if (navLinksList.classList.contains('active')) {
            navLinksList.style.display = 'flex';
            navLinksList.style.flexDirection = 'column';
            navLinksList.style.position = 'absolute';
            navLinksList.style.top = '100%';
            navLinksList.style.left = '0';
            navLinksList.style.width = '100%';
            navLinksList.style.background = 'rgba(10, 10, 12, 0.95)';
            navLinksList.style.padding = '2rem';
            navLinksList.style.gap = '1.5rem';
        } else {
            navLinksList.style.display = '';
        }
    });

    // 4. Scroll Reveal Animation
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Writing Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('writing-search');
    const writingCards = document.querySelectorAll('.writing-card');

    let currentFilter = 'all';
    let searchQuery = '';

    const applyFilters = () => {
        writingCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('h3').innerText.toLowerCase();
            const text = card.querySelector('p').innerText.toLowerCase();
            
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = title.includes(searchQuery) || text.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 400);
            }
        });
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            applyFilters();
        });
    }

    // 6. Contact Form Logic (Mock)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Transmitting Message...';
            submitBtn.disabled = true;

            // Simulate network delay
            setTimeout(() => {
                submitBtn.innerText = 'Message Received';
                submitBtn.style.background = '#28a745';
                submitBtn.style.borderColor = '#28a745';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                }, 3000);
            }, 1500);
        });
    }
});
