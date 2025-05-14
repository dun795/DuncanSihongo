
        // Initialize EmailJS with your user ID
        (function() {
            emailjs.init('YOUR_EMAILJS_USER_ID');
            
            // Set current year in footer
            document.getElementById('current-year').textContent = new Date().getFullYear();
            
            // Hide notification initially
            document.getElementById('notification').classList.add('hidden');
        })();

        // Notification function
        function showNotification(message, isError = false) {
            const notification = document.getElementById('notification');
            const notificationMessage = document.getElementById('notification-message');
            
            notificationMessage.textContent = message;
            notification.classList.remove('hidden', 'error');
            
            if (isError) {
                notification.classList.add('error');
                
                // Send error to your email
                emailjs.send('YOUR_EMAILJS_SERVICE_ID', 'YOUR_ERROR_TEMPLATE_ID', {
                    error_message: message,
                    page_url: window.location.href,
                    user_agent: navigator.userAgent
                }).then(() => {
                    console.log('Error report sent successfully');
                }, (error) => {
                    console.error('Failed to send error report:', error);
                });
            }
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 300);
            }, 5000);
        }

        // Form submission handlers
        document.addEventListener('DOMContentLoaded', function() {
            // Networking Form
            document.getElementById('networking-form')?.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                emailjs.sendForm('YOUR_EMAILJS_SERVICE_ID', 'YOUR_NETWORKING_TEMPLATE_ID', this)
                    .then(() => {
                        showNotification('Your networking consultation request has been sent successfully!');
                        hideModal('networking');
                        this.reset();
                    }, (error) => {
                        showNotification('Failed to send message. Please try again later.', true);
                        console.error('Failed to send message:', error);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Request Consultation';
                    });
            });
            
            // CCTV Form
            document.getElementById('cctv-form')?.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                emailjs.sendForm('YOUR_EMAILJS_SERVICE_ID', 'YOUR_CCTV_TEMPLATE_ID', this)
                    .then(() => {
                        showNotification('Your CCTV service request has been sent successfully!');
                        hideModal('cctv');
                        this.reset();
                    }, (error) => {
                        showNotification('Failed to send message. Please try again later.', true);
                        console.error('Failed to send message:', error);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Request Quote';
                    });
            });
            
            // Troubleshooting Form
            document.getElementById('troubleshooting-form')?.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                emailjs.sendForm('YOUR_EMAILJS_SERVICE_ID', 'YOUR_TROUBLESHOOTING_TEMPLATE_ID', this)
                    .then(() => {
                        showNotification('Your IT support request has been sent successfully!');
                        hideModal('troubleshooting');
                        this.reset();
                    }, (error) => {
                        showNotification('Failed to send message. Please try again later.', true);
                        console.error('Failed to send message:', error);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Request Support';
                    });
            });
            
            // Web Development Form
            document.getElementById('webdev-form')?.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                emailjs.sendForm('YOUR_EMAILJS_SERVICE_ID', 'YOUR_WEBDEV_TEMPLATE_ID', this)
                    .then(() => {
                        showNotification('Your web development inquiry has been sent successfully!');
                        hideModal('webdev');
                        this.reset();
                    }, (error) => {
                        showNotification('Failed to send message. Please try again later.', true);
                        console.error('Failed to send message:', error);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Discuss Project';
                    });
            });
            
            // Main Contact Form
            document.getElementById('contact-form')?.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                emailjs.sendForm('YOUR_EMAILJS_SERVICE_ID', 'YOUR_MAIN_TEMPLATE_ID', this)
                    .then(() => {
                        showNotification('Your message has been sent successfully!');
                        this.reset();
                    }, (error) => {
                        showNotification('Failed to send message. Please try again later.', true);
                        console.error('Failed to send message:', error);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    });
            });
        });
        
        // Modal functions
        function showModal(service) {
            const modal = document.getElementById(service + '-modal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function hideModal(service) {
            const modal = document.getElementById(service + '-modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        });
        
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
        
        // Active nav link highlighting
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    
