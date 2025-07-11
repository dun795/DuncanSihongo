// Page Loader
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
    
    // Show loader before page unload
    window.addEventListener('beforeunload', function() {
        loader.classList.add('active');
    });
    
    // Hide loader when page is fully loaded
    setTimeout(() => {
        loader.classList.remove('active');
    }, 500);
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#3b82f6" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#3b82f6", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        }
    });
    
    // Typing animation for hero text
    const heroTitle = document.querySelector('.hero h1 .gradient-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        setTimeout(() => {
            typeWriter(heroTitle, originalText);
        }, 500);
    }
    
    // Initialize Intersection Observer for scroll animations
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Initialize all forms
    initializeForms();
    
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
    
    // Prevent page caching
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    });
});

// Typing animation function
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Notification function
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = message;
    notification.classList.remove('hidden', 'error');
    

    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 5000);
}




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

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add this function to save messages to Supabase
async function saveMessageToSupabase(formData, serviceType = null) {
    try {
        const messageData = {
            name: formData.get('from_name') || `${formData.get('first_name')} ${formData.get('last_name')}`.trim(),
            email: formData.get('from_email'),
            subject: formData.get('subject') || serviceType || 'General Inquiry',
            message: formData.get('message'),
            service_type: serviceType || formData.get('service_type'),
            contact_number: formData.get('contact_number'),
            location: formData.get('location'),
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name')
        };

        const { data, error } = await supabase
            .from('messages')
            .insert([messageData]);

        if (error) {
            throw error;
        }

        console.log('Message saved to Supabase:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error saving to Supabase:', error);
        return { success: false, error };
    }
}

// Update the handleFormSubmission function
function handleFormSubmission(form, successMessage, modalId = null) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Get form data
    const formData = new FormData(form);
    const serviceType = getServiceTypeFromForm(form, modalId);
    
    // Save to Supabase and send email concurrently
    Promise.all([
        saveMessageToSupabase(formData, serviceType),
        emailjs.sendForm('service_9f71ccn', 'template_vlrfz5n', form)
    ])
        .then(([supabaseResult, emailResult]) => {
            if (supabaseResult.success) {
                showNotification(successMessage);
                form.reset();
                if (modalId) hideModal(modalId);
                
                console.log(`Form submitted successfully: ${form.id}`);
            } else {
                throw new Error('Failed to save message to database');
            }
        })
        .catch((error) => {
            const errorMsg = `Failed to send message: ${error.message}`;
            showNotification(errorMsg, true);
            
            console.error('Form submission failed:', {
                formId: form.id,
                error: error,
                formData: Object.fromEntries(formData)
            });
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
}

// Helper function to determine service type from form
function getServiceTypeFromForm(form, modalId) {
    const serviceMap = {
        'networking': 'Networking Services',
        'cctv': 'CCTV Services', 
        'troubleshooting': 'IT Support',
        'webdev': 'Web Development'
    };
    
    return serviceMap[modalId] || 'General Contact';
}

// Update the initializeForms function with the new service type logic
function initializeForms() {
    // Store original button text
    document.querySelectorAll('form button[type="submit"]').forEach(btn => {
        btn.dataset.originalText = btn.textContent;
    });

    // Networking Form
    document.getElementById('networking-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Networking consultation request sent!', 'networking');
    });
    
    // CCTV Form
    document.getElementById('cctv-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'CCTV service request sent!', 'cctv');
    });
    
    // Troubleshooting Form
    document.getElementById('troubleshooting-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'IT support request sent!', 'troubleshooting');
    });
    
    // Web Development Form
    document.getElementById('webdev-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Web development inquiry sent!', 'webdev');
    });
    
    // Main Contact Form
    document.getElementById('contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Your message has been sent successfully!');
    });
}
