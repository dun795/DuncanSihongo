
        // Modal functions
        function showModal(service) {
            const modal = document.getElementById(service + '-modal');
            modal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
            modal.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
            document.body.style.overflow = 'hidden';
        }

        function hideModal(service) {
            const modal = document.getElementById(service + '-modal');
            modal.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
            modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            document.body.style.overflow = '';
        }
        
        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal') && !e.target.classList.contains('pointer-events-none')) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
                    modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
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
    
