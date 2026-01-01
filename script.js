// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // DARK/LIGHT MODE THEME TOGGLE
    // ============================================
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeSwitch.checked = true;
    }

    // Theme toggle event listener
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Get elements
    const navbar = document.querySelector('.navbar');
    const scrollUpBtn = document.querySelector('.scroll-up-btn');
    const menuBtn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.navbar .menu');
    const menuBtnIcon = document.querySelector('.menu-btn i');
    const menuLinks = document.querySelectorAll('.navbar .menu li a');

    // Scroll event with debouncing for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Sticky navbar on scroll
            if (window.scrollY > 20) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }

            // Scroll-up button show/hide
            if (window.scrollY > 500) {
                scrollUpBtn.classList.add('show');
            } else {
                scrollUpBtn.classList.remove('show');
            }
        }, 10);
    }, { passive: true }); // passive: true for better scroll performance

    // Scroll to top when clicking scroll-up button
    scrollUpBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Apply smooth scroll on menu items click
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Smooth scroll behavior
            document.documentElement.style.scrollBehavior = 'smooth';

            // Close mobile menu after clicking a link
            menu.classList.remove('active');
            menuBtnIcon.classList.remove('active');
        });
    });

    // Toggle mobile menu/navbar
    menuBtn.addEventListener('click', function() {
        menu.classList.toggle('active');
        menuBtnIcon.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuBtn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            menuBtnIcon.classList.remove('active');
        }
    });

    // Typing animation with Typed.js
    // Check if Typed.js is loaded
    if (typeof Typed !== 'undefined') {
        // Initialize first typing animation
        const typing1 = new Typed('.typing', {
            strings: ['Developer', 'Programmer', 'Designer', 'Problem Solver'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });

        // Initialize second typing animation
        const typing2 = new Typed('.typing-2', {
            strings: ['Developer', 'Programmer', 'Designer', 'Problem Solver'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }

    // Animate project cards on scroll (Intersection Observer)
    const projectCards = document.querySelectorAll('.project-card');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply initial styles and observe each card
        projectCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skills-content .line');

    if ('IntersectionObserver' in window) {
        const skillObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.querySelector('::before');
                    skillObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        skillBars.forEach(function(bar) {
            skillObserver.observe(bar);
        });
    }

    // ============================================
    // FORMSPREE CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.querySelector('.form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Get form data
            const formData = new FormData(this);

            try {
                // Send form to Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success message
                    showFormMessage('success', '✓ Thank you! Your message has been sent successfully. I will get back to you soon.');
                    this.reset();
                } else {
                    // Error from Formspree
                    const data = await response.json();
                    if (data.errors) {
                        showFormMessage('error', '✗ Oops! There were errors with your submission: ' + data.errors.map(error => error.message).join(', '));
                    } else {
                        showFormMessage('error', '✗ Oops! There was a problem submitting your form. Please try again.');
                    }
                }
            } catch (error) {
                // Network error
                showFormMessage('error', '✗ Oops! There was a network error. Please check your connection and try again.');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Function to show form messages
    function showFormMessage(type, message) {
        if (!formStatus) return;

        formStatus.style.display = 'block';
        formStatus.textContent = message;

        if (type === 'success') {
            formStatus.style.color = '#4BB543';
            formStatus.style.backgroundColor = 'rgba(75, 181, 67, 0.1)';
        } else {
            formStatus.style.color = '#dc3545';
            formStatus.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        }

        formStatus.style.padding = '10px 15px';
        formStatus.style.borderRadius = '6px';
        formStatus.style.border = type === 'success' ? '1px solid #4BB543' : '1px solid #dc3545';

        // Hide message after 5 seconds
        setTimeout(function() {
            formStatus.style.display = 'none';
        }, 5000);
    }

    console.log('Portfolio loaded successfully! 🚀');
});
