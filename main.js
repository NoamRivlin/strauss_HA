// Utilities
const fetchJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch from ${url}: ${error.message}`);
    }
};

const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

// Mobile Navigation
const initMobileNav = () => {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    const menuIcon = toggle?.querySelector('.menu-icon');

    if (!toggle || !sidebar || !overlay || !menuIcon) return;

    const toggleNav = () => {
        const isActive = sidebar.classList.contains('active');
        sidebar.classList.toggle('active');
        overlay.style.display = isActive ? 'none' : 'block';
        menuIcon.textContent = isActive ? '☰' : '✕';
        toggle.setAttribute('aria-expanded', (!isActive).toString());
        
        if (!isActive) {
            sidebar.querySelector('.nav-link')?.focus();
        }
    };

    // Event listeners
    toggle.addEventListener('click', toggleNav);
    overlay.addEventListener('click', () => toggleNav());
    
    const closeOnCondition = (condition) => {
        if (condition && sidebar.classList.contains('active')) {
            toggleNav();
        }
    };

    window.addEventListener('resize', () => closeOnCondition(window.innerWidth > 1000));
    document.addEventListener('keydown', (e) => closeOnCondition(e.key === 'Escape'));
};

// Smooth Scrolling
const initSmoothScroll = () => {
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
};

// Weather Service
const initWeather = async () => {
    const weatherContent = document.querySelector('.weather-content');
    if (!weatherContent) return;

    const updateWeatherDisplay = (content) => {
        weatherContent.innerHTML = `
            <div class="weather-info${content.error ? ' weather-error' : ''}">
                <span>${content.message}</span>
                ${content.details ? `
                    <span class="weather-separator">|</span>
                    <span class="weather-temp">${content.details}</span>
                ` : ''}
            </div>`;
    };

    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        const [locationData, weatherData] = await Promise.all([
            fetchJSON(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`),
            fetchJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`)
        ]);

        const location = locationData.city || locationData.locality || 'Unknown Location';
        const temperature = Math.round(weatherData.current.temperature_2m);

        updateWeatherDisplay({
            message: location,
            details: `${temperature}°C`
        });

    } catch (error) {
        console.error('Weather service error:', error);
        updateWeatherDisplay({
            error: true,
            message: 'Weather unavailable'
        });
    }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        initMobileNav(),
        initSmoothScroll(),
        initWeather()
    ]).catch(error => console.error('Initialization error:', error));
});