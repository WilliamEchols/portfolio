class Terminal {
    constructor() {
        this.preferences = {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        this.initializePreferences();
        this.initializeTerminal();
    }

    initializePreferences() {
        if (this.preferences.reducedMotion) {
            document.documentElement.classList.add('reduce-motion');
        }
    }

    initializeTerminal() {
        // Add power-on animation
        document.body.classList.add('powering-on');
        setTimeout(() => {
            document.body.classList.remove('powering-on');
            this.startTerminal();
        }, 1000);
    }

    startTerminal() {
        // Add cursor effect to content
        const content = document.getElementById('main-content');
        content.classList.add('cursor');
    }
}

const terminal = new Terminal();

// Add debouncing for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 