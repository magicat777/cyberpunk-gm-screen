/**
 * Cyberpunk RED GM Screen - Navigation Functionality
 * Handles responsive menu, dropdowns, and keyboard navigation
 */

const navigation = {
    /**
     * Initialize navigation components
     */
    init: function() {
        // Wait for the DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },
    
    /**
     * Set up all navigation event handlers
     */
    setup: function() {
        this.setupMobileToggle();
        this.setupDropdowns();
        this.setupKeyboardNavigation();
        this.setupOutsideClickDetection();
        this.setupResizeHandler();
        this.markActiveLink();
        
        console.log('Navigation initialized');
    },
    
    /**
     * Set up mobile menu toggle
     */
    setupMobileToggle: function() {
        const menuToggle = document.querySelector('.mobile-nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                navMenu.classList.toggle('show');
            });
        }
    },
    
    /**
     * Set up dropdown menu toggles
     */
    setupDropdowns: function() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                // On mobile, toggle dropdown visibility
                if (window.innerWidth <= 768) {
                    const expanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !expanded);
                    this.classList.toggle('active');
                    
                    const dropdownMenu = this.nextElementSibling;
                    dropdownMenu.classList.toggle('show');
                }
            });
        });
    },
    
    /**
     * Set up keyboard navigation for accessibility
     */
    setupKeyboardNavigation: function() {
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
        
        navLinks.forEach(link => {
            link.addEventListener('keydown', function(e) {
                // Handle arrow key navigation
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
                    e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    
                    e.preventDefault();
                    const currentIndex = Array.from(navLinks).indexOf(document.activeElement);
                    
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        const nextIndex = (currentIndex + 1) % navLinks.length;
                        navLinks[nextIndex].focus();
                    } else {
                        const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                        navLinks[prevIndex].focus();
                    }
                }
                
                // Handle escape key
                if (e.key === 'Escape') {
                    // Close all dropdown menus
                    const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                    openDropdowns.forEach(menu => menu.classList.remove('show'));
                    
                    // Reset all dropdown toggles
                    const activeToggles = document.querySelectorAll('.dropdown-toggle.active');
                    activeToggles.forEach(toggle => {
                        toggle.classList.remove('active');
                        toggle.setAttribute('aria-expanded', 'false');
                    });
                    
                    // Close mobile menu
                    const mobileMenu = document.getElementById('nav-menu');
                    const mobileToggle = document.querySelector('.mobile-nav-toggle');
                    
                    if (mobileMenu && mobileMenu.classList.contains('show')) {
                        mobileMenu.classList.remove('show');
                        mobileToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    },
    
    /**
     * Set up detection for clicks outside the navigation
     */
    setupOutsideClickDetection: function() {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-nav-toggle')) {
                // Close mobile menu
                const navMenu = document.getElementById('nav-menu');
                const menuToggle = document.querySelector('.mobile-nav-toggle');
                
                if (navMenu && menuToggle) {
                    navMenu.classList.remove('show');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                
                // Close all dropdowns
                const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
                
                dropdownToggles.forEach(toggle => {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.classList.remove('active');
                    
                    const dropdownMenu = toggle.nextElementSibling;
                    if (dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                    }
                });
            }
        });
    },
    
    /**
     * Set up window resize handler
     */
    setupResizeHandler: function() {
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                // Reset mobile menu on desktop
                const navMenu = document.getElementById('nav-menu');
                const menuToggle = document.querySelector('.mobile-nav-toggle');
                
                if (navMenu && menuToggle) {
                    navMenu.classList.remove('show');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
                
                // Reset dropdown toggles
                const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
                
                dropdownToggles.forEach(toggle => {
                    toggle.classList.remove('active');
                });
            }
        });
    },
    
    /**
     * Mark the current page link as active
     */
    markActiveLink: function() {
        // Get the current page path
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        // Find all navigation links
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
        
        // Compare each link's href to the current page
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            if (linkPath) {
                // Extract just the filename from the href
                const linkFilename = linkPath.split('/').pop();
                
                // Mark as active if it matches the current page
                if (linkFilename === currentPath) {
                    link.classList.add('active');
                    
                    // If it's a dropdown item, also mark its parent
                    const parentItem = link.closest('.dropdown');
                    if (parentItem) {
                        const parentLink = parentItem.querySelector('.nav-link');
                        if (parentLink) {
                            parentLink.classList.add('active');
                        }
                    }
                }
            }
        });
    },
    
    /**
     * Update breadcrumb navigation based on current page
     * @param {Object} config - Configuration options for breadcrumbs
     */
    updateBreadcrumbs: function(config = {}) {
        const breadcrumbList = document.querySelector('.breadcrumb-list');
        
        if (!breadcrumbList) return;
        
        // Clear existing breadcrumbs
        breadcrumbList.innerHTML = '';
        
        // Always add Home link
        const homeItem = document.createElement('li');
        homeItem.className = 'breadcrumb-item';
        homeItem.innerHTML = '<a href="index.html" class="breadcrumb-link">Home</a>';
        breadcrumbList.appendChild(homeItem);
        
        // Add parent section if provided
        if (config.section) {
            const sectionItem = document.createElement('li');
            sectionItem.className = 'breadcrumb-item';
            
            if (config.sectionUrl) {
                sectionItem.innerHTML = `<a href="${config.sectionUrl}" class="breadcrumb-link">${config.section}</a>`;
            } else {
                sectionItem.innerHTML = `<span class="breadcrumb-link">${config.section}</span>`;
            }
            
            breadcrumbList.appendChild(sectionItem);
        }
        
        // Add current page
        if (config.page) {
            const pageItem = document.createElement('li');
            pageItem.className = 'breadcrumb-item';
            pageItem.innerHTML = `<span class="breadcrumb-current">${config.page}</span>`;
            breadcrumbList.appendChild(pageItem);
        }
    }
};

// Initialize navigation
navigation.init();