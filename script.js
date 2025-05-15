// Initialize EmailJS with your user ID
(function() {
    // Initialize EmailJS with correct User ID
    emailjs.init('hWoqjWtrA9ReGybO5');
    
    // Set current year in footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Hide notification initially
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.add('hidden');
    }
})();

// Notification function
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (!notification || !notificationMessage) return;
    
    notificationMessage.textContent = message;
    notification.classList.remove('hidden', 'error');
    
    if (isError) {
        notification.classList.add('error');
        
        // Send error to your email (using correct Service ID)
        emailjs.send('service_199u7yr', 'template_vlrfz5n', {
            error_message: message,
            page_url: window.location.href,
            user_agent: navigator.userAgent
        }).catch(error => {
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

// Form submission handler factory
function createFormHandler(formId, successMessage, submitText, serviceId = 'service_199u7yr', templateId = 'template_vlrfz5n') {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Get form data and create parameters object
        const formData = new FormData(this);
        const params = {};
        
        // Convert FormData to object for EmailJS
        formData.forEach((value, key) => {
            params[key] = value;
        });
        
        // Add form identifier to help with email template
        params.form_id = formId;
        
        // DEBUG: Log parameters being sent
        console.log('Sending form with params:', params);

        // Use send instead of sendForm to have more control
        emailjs.send(serviceId, templateId, params)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                showNotification(successMessage);
                if (formId !== 'contact-form') {
                    hideModal(formId.replace('-form', ''));
                }
                this.reset();
            })
            .catch((error) => {
                console.error('FAILED...', error);
                showNotification('Failed to send message. Please try again later.', true);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
    });
}

// Initialize all form handlers
document.addEventListener('DOMContentLoaded', function() {
    // Verify EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded properly');
        return;
    }
    
    console.log('EmailJS initialized and ready');
    
    // Networking Form
    createFormHandler(
        'networking-form',
        'Your networking consultation request has been sent successfully!',
        'Request Consultation'
    );
    
    // CCTV Form (uses different template)
    createFormHandler(
        'cctv-form',
        'Your CCTV service request has been sent successfully!',
        'Request Quote',
        'service_199u7yr',
        'template_1kfpiwa'
    );
    
    // Troubleshooting Form
    createFormHandler(
        'troubleshooting-form',
        'Your IT support request has been sent successfully!',
        'Request Support'
    );
    
    // Web Development Form
    createFormHandler(
        'webdev-form',
        'Your web development inquiry has been sent successfully!',
        'Discuss Project'
    );
    
    // Main Contact Form
    createFormHandler(
        'contact-form',
        'Your message has been sent successfully!',
        'Send Message'
    );

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
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
    }
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= (sectionTop - 100)) {
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
    }
});

// Modal functions
function showModal(service) {
    const modal = document.getElementById(service + '-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(service) {
    const modal = document.getElementById(service + '-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
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
