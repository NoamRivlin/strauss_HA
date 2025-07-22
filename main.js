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

// Weather API Integration (Real implementation)
class WeatherService {
    constructor() {
        this.weatherContent = document.querySelector('.weather-content');
        this.init();
    }

    async init() {
        try {
            await this.loadWeatherData();
        } catch (error) {
            console.error('Weather service initialization failed:', error);
            this.showWeatherError();
        }
    }

    async loadWeatherData() {
        try {
            // Get user's location
            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;

            // Get city name and weather data
            const [locationData, weatherData] = await Promise.all([
                this.getCityName(latitude, longitude),
                this.getWeatherData(latitude, longitude)
            ]);

            this.updateWeatherDisplay({
                location: locationData.city,
                temperature: Math.round(weatherData.current.temperature_2m)
            });

        } catch (error) {
            console.error('Failed to load weather data:', error);
            this.showWeatherError();
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    timeout: 10000,
                    enableHighAccuracy: true,
                    maximumAge: 300000 // 5 minutes cache
                }
            );
        });
    }

    async getCityName(latitude, longitude) {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`
        );
        
        if (!response.ok) {
            throw new Error('Failed to get location data');
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('No location found');
        }

        const result = data.results[0];
        return {
            city: result.name || result.admin1 || result.admin2 || 'Unknown Location'
        };
    }

    async getWeatherData(latitude, longitude) {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error('Failed to get weather data');
        }

        return await response.json();
    }

    updateWeatherDisplay(data) {
        this.weatherContent.innerHTML = `
            <div class="weather-info">
                <span class="weather-location">${data.location}</span>
                <span class="weather-separator">|</span>
                <span class="weather-temp">${data.temperature}°C</span>
            </div>
        `;
    }

    showWeatherError() {
        this.weatherContent.innerHTML = `
            <div class="weather-info weather-error">
                <span>Weather unavailable</span>
            </div>
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