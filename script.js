// CSS Variables and utility functions
const CONSTANTS = {
    BREAKPOINT_MOBILE: 768,
    ANIMATION_DURATION: 300,
};

// Function to show the selected tab with error handling and animation
function showTab(tabId) {
    try {
        const tabs = document.querySelectorAll('.tab-content');
        const activeTab = document.getElementById(tabId);

        if (!activeTab) {
            throw new Error(`Tab with id "${tabId}" not found`);
        }

        // Fade out all tabs
        tabs.forEach(tab => {
            tab.style.opacity = '0';
            setTimeout(() => {
                tab.classList.remove('active');
            }, CONSTANTS.ANIMATION_DURATION / 2);
        });

        // Fade in selected tab
        setTimeout(() => {
            activeTab.classList.add('active');
            activeTab.style.opacity = '1';
        }, CONSTANTS.ANIMATION_DURATION / 2);

        // Update URL hash without scrolling
        history.pushState(null, '', `#${tabId}`);
        
        // Update active state in navigation
        updateNavActiveState(tabId);

    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

// Update navigation active state
function updateNavActiveState(activeTabId) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const isActive = link.getAttribute('data-tab') === activeTabId;
        link.setAttribute('aria-current', isActive ? 'page' : 'false');
        link.classList.toggle('active', isActive);
    });
}

// Handle mobile menu
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (!menuToggle || !navMenu) return;

    // Setup initial ARIA attributes
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'nav-menu');
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    navMenu.setAttribute('id', 'nav-menu');
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', (!isExpanded).toString());
        navMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Handle contact form submission
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        try {
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Here you would typically send the data to your server
            // await sendFormData(data);

            // Show success message
            alert('Thank you for your message. We will get back to you soon!');
            contactForm.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error sending your message. Please try again.');

        } finally {
            // Reset submit button
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupContactForm();

    // Handle initial tab based on URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
        showTab(hash);
    }

    // Setup tab navigation
    document.querySelectorAll('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showTab(e.target.dataset.tab);
        });
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        showTab(hash);
    }
});