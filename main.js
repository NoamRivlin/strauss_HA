// Mobile Navigation Functionality
class MobileNavigation {
    constructor() {
        this.toggleButton = document.querySelector('.mobile-nav-toggle');
        this.sidebar = document.querySelector('.sidebar');
        this.overlay = document.querySelector('.mobile-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        // Toggle navigation
        this.toggleButton.addEventListener('click', () => {
            this.toggleNavigation();
        });

        // Close navigation when overlay is clicked
        this.overlay.addEventListener('click', () => {
            this.closeNavigation();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1000) {
                this.closeNavigation();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNavigation();
            }
        });
    }

    toggleNavigation() {
        const isActive = this.sidebar.classList.contains('active');
        
        if (isActive) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }
    }

    openNavigation() {
        this.sidebar.classList.add('active');
        this.overlay.style.display = 'block';
        this.toggleButton.innerHTML = '✕';
        this.toggleButton.setAttribute('aria-expanded', 'true');
        
        // Trap focus within sidebar
        const firstLink = this.sidebar.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }
    }

    closeNavigation() {
        this.sidebar.classList.remove('active');
        this.overlay.style.display = 'none';
        this.toggleButton.innerHTML = '☰';
        this.toggleButton.setAttribute('aria-expanded', 'false');
    }
}

// Smooth scrolling for navigation links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling behavior
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    // Smooth scroll behavior for future sections
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Weather API Integration (Ready for implementation)
class WeatherService {
    constructor() {
        this.weatherContent = document.querySelector('.weather-content');
        this.init();
    }

    init() {
        // Placeholder for weather API integration
        this.loadWeatherData();
    }

    async loadWeatherData() {
        // For now, showing placeholder
        this.showWeatherPlaceholder();
    }

    showWeatherPlaceholder() {
        this.weatherContent.innerHTML = `
            <p>Location: [City Name]</p>
            <p>Temperature: [XX]°C</p>
        `;
    }

    updateWeatherDisplay(data) {
        // Method ready for actual weather data
        this.weatherContent.innerHTML = `
            <p>Location: ${data.location}</p>
            <p>Temperature: ${data.temperature}°C</p>
        `;
    }

    showWeatherError() {
        this.weatherContent.innerHTML = `
            <p>Weather data unavailable</p>
        `;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    new SmoothScroll();
    new WeatherService();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Optimize layout on resize
        if (window.innerWidth > 1000) {
            document.querySelector('.sidebar').classList.remove('active');
            document.querySelector('.mobile-overlay').style.display = 'none';
        }
    }, 250);
}); 