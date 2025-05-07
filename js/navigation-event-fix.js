/**
 * Navigation Event Fix
 * Ensures that navigation events are properly bound
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Starting navigation event fix...');
    
    // Wait for other scripts to initialize
    setTimeout(() => {
        fixNavigationEvents();
    }, 1000);
});

function fixNavigationEvents() {
    try {
        // Fix main navigation dropdowns
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        // For each dropdown toggle
        dropdownToggles.forEach(toggle => {
            // Remove existing event listeners
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            // Add new event listener
            newToggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                console.log('Dropdown toggle clicked');
                
                // Get dropdown menu
                const dropdownMenu = this.nextElementSibling;
                if (!dropdownMenu) return;
                
                // Toggle active class
                this.classList.toggle('active');
                
                // Toggle aria-expanded
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                
                // Toggle show class on dropdown menu
                dropdownMenu.classList.toggle('show');
            });
        });
        
        // Fix mobile toggle
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        if (mobileToggle) {
            // Remove existing event listeners
            const newMobileToggle = mobileToggle.cloneNode(true);
            mobileToggle.parentNode.replaceChild(newMobileToggle, mobileToggle);
            
            // Add new event listener
            newMobileToggle.addEventListener('click', function() {
                console.log('Mobile toggle clicked');
                
                // Toggle aria-expanded
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                
                // Toggle show class on nav menu
                const navMenu = document.getElementById('nav-menu');
                if (navMenu) {
                    navMenu.classList.toggle('show');
                }
            });
        }
        
        // Update all links to use correct base path
        const allLinks = document.querySelectorAll('a[href]');
        const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                // Fix relative links
                if (href.startsWith('/')) {
                    link.setAttribute('href', baseUrl + href.substring(1));
                } else {
                    link.setAttribute('href', baseUrl + href);
                }
            }
        });
        
        console.log('✅ Navigation event fix applied successfully');
    } catch (error) {
        console.error('❌ Error fixing navigation events:', error);
    }
}