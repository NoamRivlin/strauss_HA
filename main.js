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

// Press the CTA button to trigger the Confetti Effect
const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
    }, 250);
};

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

// Initialize CTA Button
const initCTAButton = () => {
    const ctaButton = document.querySelector('.cta-button');
    if (!ctaButton) return;

    ctaButton.addEventListener('click', () => {
        ctaButton.classList.add('clicked');
        triggerConfetti();
        setTimeout(() => ctaButton.classList.remove('clicked'), 300);
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        initMobileNav(),
        initSmoothScroll(),
        initWeather(),
        initCTAButton()
    ]).catch(error => console.error('Initialization error:', error));
});