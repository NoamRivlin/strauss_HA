// Utilities
const fetchJSON = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    return response.json();
};

const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
        });
    });

// Mobile Navigation
const initMobileNav = () => {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-overlay');

    if (!toggle || !sidebar || !overlay) return;

    const closeNav = () => {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
        toggle.innerHTML = '☰';
        toggle.setAttribute('aria-expanded', 'false');
    };

    const openNav = () => {
        sidebar.classList.add('active');
        overlay.style.display = 'block';
        toggle.innerHTML = '✕';
        toggle.setAttribute('aria-expanded', 'true');
        sidebar.querySelector('.nav-link')?.focus();
    };

    const toggleNav = () =>
        sidebar.classList.contains('active') ? closeNav() : openNav();

    // Event listeners
    toggle.addEventListener('click', toggleNav);
    overlay.addEventListener('click', closeNav);
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000) closeNav();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });
};

// Smooth Scrolling just to the top of the page to showcase
const initSmoothScroll = () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
};

// Weather Service
const initWeather = async () => {
    const weatherContent = document.querySelector('.weather-content');
    if (!weatherContent) return;

    const showError = () => {
        weatherContent.innerHTML = `
        <div class="weather-info weather-error">
          <span>Weather unavailable</span>
        </div>`;
    };

    const updateDisplay = ({ location, temperature }) => {
        weatherContent.innerHTML = `
        <div class="weather-info">
          <span class="weather-location">${location}</span>
          <span class="weather-separator">|</span>
          <span class="weather-temp">${temperature}°C</span>
        </div>`;
    };

    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        const [locationData, weatherData] = await Promise.all([
            fetchJSON(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`),
            fetchJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`)
        ]);

        updateDisplay({
            location: locationData.city || locationData.locality || 'Unknown Location',
            temperature: Math.round(weatherData.current.temperature_2m)
        });

    } catch (error) {
        console.error('Weather service failed:', error);
        showError();
    }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initWeather();

    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});