// Finca Del Mar Website JavaScript
(function() {
    'use strict';

    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.querySelector('#contact-form');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollEffects();
        initContactForm();
        initGallery();
        initAnimations();
    });

    // Navigation Functions
    function initNavigation() {
        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('active'));
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('active'));
    }

    // Scroll Effects
    function initScrollEffects() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;

            // Navbar background on scroll
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;

            // Parallax effect for hero background
            const hero = document.querySelector('.hero');
            if (hero) {
                const scrolled = window.pageYOffset;
                const parallax = hero.querySelector('.hero-background');
                if (parallax) {
                    const speed = scrolled * 0.5;
                    parallax.style.transform = `translateY(${speed}px)`;
                }
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections for animations
        const sections = document.querySelectorAll('.about, .features, .gallery, .contact');
        sections.forEach(section => {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        });
    }

    // Contact Form
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form
            if (!validateForm(formObject)) {
                return;
            }

            // Submit form
            submitContactForm(formObject);
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }

    function validateForm(data) {
        let isValid = true;
        const errors = [];

        // Required fields
        const requiredFields = ['name', 'email', 'message'];
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                isValid = false;
            }
        });

        // Email validation
        if (data.email && !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }

        // Display errors
        if (!isValid) {
            showFormMessage('Please correct the following errors:\\n' + errors.join('\\n'), 'error');
        }

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Validate based on field type
        if (field.required && !value) {
            field.classList.add('error');
            return false;
        }
        
        if (fieldName === 'email' && value && !isValidEmail(value)) {
            field.classList.add('error');
            return false;
        }
        
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function submitContactForm(data) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Prepare email content
        const emailContent = `
New Event Inquiry from Finca Del Mar Website

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Event Type: ${data.event_type || 'Not specified'}
Preferred Date: ${data.event_date || 'Not specified'}
Guest Count: ${data.guest_count || 'Not specified'}

Message:
${data.message}

---
Sent from Finca Del Mar website contact form
        `.trim();

        // Create mailto link (fallback for now)
        const mailtoLink = `mailto:info@finca.pr?subject=Event Inquiry - ${data.name}&body=${encodeURIComponent(emailContent)}`;
        
        // Simulate form submission delay
        setTimeout(() => {
            // For now, open default email client
            window.location.href = mailtoLink;
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            showFormMessage('Thank you for your inquiry! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1000);
    }

    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Add styles
        messageEl.style.cssText = `
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-weight: 500;
            ${type === 'error' ? 
                'background: #fee; color: #c53030; border: 1px solid #feb2b2;' : 
                'background: #f0fff4; color: #2f855a; border: 1px solid #9ae6b4;'
            }
        `;

        // Insert at the top of the form
        contactForm.insertBefore(messageEl, contactForm.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    // Gallery Functions
    function initGallery() {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                openLightbox(index);
            });
        });
    }

    function openLightbox(startIndex) {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&#8249;</button>
                <button class="lightbox-next">&#8250;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;

        // Add lightbox styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(lightbox);

        // Get all gallery images
        const images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            caption: item.querySelector('.gallery-overlay h4').textContent
        }));

        let currentIndex = startIndex;

        // Lightbox functions
        function showImage(index) {
            const image = lightbox.querySelector('.lightbox-image');
            const caption = lightbox.querySelector('.lightbox-caption');
            const counter = lightbox.querySelector('.lightbox-counter');

            image.src = images[index].src;
            caption.textContent = images[index].caption;
            counter.textContent = `${index + 1} / ${images.length}`;
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        }

        function closeLightbox() {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            }, 300);
        }

        // Event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.parentNode) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        });

        // Show initial image
        showImage(currentIndex);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Fade in
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }

    // Animation Functions
    function initAnimations() {
        // Counter animations for stats
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element) => {
            const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
            const increment = target / 100;
            let current = 0;
            const isPlus = element.textContent.includes('+');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + (isPlus ? '+' : '');
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + (isPlus ? '+' : '');
                }
            }, 20);
        };

        // Observe stat numbers
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });

        // Staggered animations for feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance optimizations
    window.addEventListener('scroll', throttle(function() {
        // Optimized scroll handling if needed
    }, 16)); // ~60fps

    // Lazy loading for images (if needed)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Could send error reports to analytics here
    });

})();