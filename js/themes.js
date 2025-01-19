class ThemeManager {
    constructor() {
        this.themes = {
            atari: {
                name: 'Atari',
                colors: {
                    terminalText: '#e5d3b3',    // Warm beige
                    terminalAccent: '#d5573b',  // Atari red
                    terminalBg: '#2b2b2b',      // Dark gray
                    terminalHeader: '#3a3a3a',  // Lighter gray
                    terminalGlow: '0 0 10px rgba(229, 211, 179, 0.2)'
                }
            },
            commodore: {
                name: 'Commodore',
                colors: {
                    terminalText: '#7bb6ff',    // Light blue
                    terminalAccent: '#4f7fff',  // Commodore blue
                    terminalBg: '#1c1c1c',      // Dark background
                    terminalHeader: '#2a2a3a',  // Navy tint
                    terminalGlow: '0 0 10px rgba(123, 182, 255, 0.2)'
                }
            },
            apple2: {
                name: 'Apple II',
                colors: {
                    terminalText: '#33ff33',    // Green phosphor
                    terminalAccent: '#00b800',  // Darker green
                    terminalBg: '#111111',      // Near black
                    terminalHeader: '#1a1a1a',  // Slightly lighter
                    terminalGlow: '0 0 10px rgba(51, 255, 51, 0.2)'
                }
            }
        };
        
        this.currentTheme = localStorage.getItem('theme') || 'atari';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.initializeThemeButton();
    }

    initializeThemeButton() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'themeBtn') {
                this.cycleTheme();
            }
        });
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        const root = document.documentElement;
        
        root.style.setProperty('--terminal-text', theme.colors.terminalText);
        root.style.setProperty('--terminal-accent', theme.colors.terminalAccent);
        root.style.setProperty('--terminal-bg', theme.colors.terminalBg);
        root.style.setProperty('--terminal-header', theme.colors.terminalHeader);
        root.style.setProperty('--terminal-glow', theme.colors.terminalGlow);
        
        localStorage.setItem('theme', themeName);
        this.currentTheme = themeName;
    }

    cycleTheme() {
        const themeNames = Object.keys(this.themes);
        const currentIndex = themeNames.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        this.applyTheme(themeNames[nextIndex]);
    }
} 