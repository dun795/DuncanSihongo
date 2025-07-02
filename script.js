// Supabase configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    
    if (isError) {
        notification.classList.add('error');
        
        // Log error to Supabase
        logErrorToSupabase(message);
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 5000);
}

// Function to log errors to Supabase
async function logErrorToSupabase(errorMessage) {
    try {
        const { error } = await supabase
            .from('error_logs')
            .insert([
                {
                    error_message: errorMessage,
                    page_url: window.location.href,
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }
            ]);
        
        if (error) {
            console.error('Failed to log error to Supabase:', error);
        }
    } catch (err) {
        console.error('Error logging to Supabase:', err);
    }
}

// Function to send data to Supabase
async function sendToSupabase(formData, tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .insert([formData]);
        
        if (error) {
            throw error;
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Supabase error:', error);
        return { success: false, error: error.message };
    }
}

// Enhanced form submission handler
async function handleFormSubmission(form, successMessage, modalId = null, tableName = 'contacts') {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp and form type
    data.submitted_at = new Date().toISOString();
    data.form_type = form.id;
    data.page_url = window.location.href;
    
    try {
        const result = await sendToSupabase(data, tableName);
        
        if (result.success) {
            showNotification(successMessage);
            form.reset();
            if (modalId) hideModal(modalId);
            
            // Log successful submission
            console.log(`Form submitted successfully: ${form.id}`);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        const errorMsg = `Failed to send message: ${error.message}`;
        showNotification(errorMsg, true);
        
        // Enhanced error logging
        console.error('Form submission failed:', {
            formId: form.id,
            error: error.message,
            formData: data
        });
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Initialize all forms
function initializeForms() {
    // Store original button text
    document.querySelectorAll('form button[type="submit"]').forEach(btn => {
        btn.dataset.originalText = btn.textContent;
    });

    // Networking Form
    document.getElementById('networking-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Networking consultation request sent!', 'networking', 'networking_requests');
    });
    
    // CCTV Form
    document.getElementById('cctv-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'CCTV service request sent!', 'cctv', 'cctv_requests');
    });
    
    // Troubleshooting Form
    document.getElementById('troubleshooting-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'IT support request sent!', 'troubleshooting', 'support_requests');
    });
    
    // Web Development Form
    document.getElementById('webdev-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Web development inquiry sent!', 'webdev', 'webdev_requests');
    });
    
    // Main Contact Form
    document.getElementById('contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Your message has been sent successfully!', null, 'general_contacts');
    });
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
