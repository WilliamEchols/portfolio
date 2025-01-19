class ContentManager {
    constructor() {
        this.currentPage = 'home';
        this.isLoading = false;
        this.scanInterval = null;
        this.initializeEventListeners();
        this.loadContent('home');
    }

    initializeEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('href').substring(1);
                this.loadContent(page);
            });
        });
    }

    async loadContent(page) {
        try {
            // Cancel any ongoing loading immediately
            if (this.isLoading) {
                this.isLoading = false;
                if (this.scanInterval) {
                    clearInterval(this.scanInterval);
                }
                this.currentLoadingPromise = null;
            }

            const contentData = this.getContent(page);
            const mainContent = document.getElementById('main-content');
            const asciiArt = document.getElementById('ascii-art');
            
            this.updateUrlBar(page);
            
            // Clear existing content immediately
            mainContent.innerHTML = '';
            asciiArt.innerHTML = '';

            this.isLoading = true;
            
            // Load ASCII art with scan effect
            await this.scanEffect(asciiArt, contentData.ascii);
            if (!this.isLoading) return;

            // Load main content with scan effect
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentData.text;
            const elements = tempDiv.children;
            
            for (let element of elements) {
                await this.scanEffect(mainContent, element.outerHTML);
                if (!this.isLoading) return;
            }
        } catch (error) {
            console.error('Error loading content:', error);
            mainContent.innerHTML = `
                <div class="error-message">
                    <h2>[ERROR]</h2>
                    <p>Unable to load content. Please try again.</p>
                    <button onclick="location.reload()">[RELOAD]</button>
                </div>
            `;
        } finally {
            this.isLoading = false;
            this.scanInterval = null;
        }
    }

    async scanEffect(element, text) {
        return new Promise(resolve => {
            let lines = text.split('\n');
            let currentLine = 0;
            
            this.scanInterval = setInterval(() => {
                if (!this.isLoading) {
                    clearInterval(this.scanInterval);
                    resolve();
                    return;
                }
                
                if (currentLine < lines.length) {
                    element.innerHTML += lines[currentLine] + '\n';
                    currentLine++;
                } else {
                    clearInterval(this.scanInterval);
                    resolve();
                }
            }, 50);
        });
    }

    updateUrlBar(page) {
        const urlBar = document.querySelector('.url-bar');
        urlBar.textContent = `http://localhost/${page}`;
        
        // Update body class for page-specific styling
        document.body.className = `page-${page}`;
    }

    getLoadingAscii() {
        return `
    Loading...
    [===========]
        `;
    }

    getContent(page) {
        const content = {
            home: {
                ascii: `
██╗    ██╗██╗██╗     ██╗       ███████╗ ██████╗██╗  ██╗ ██████╗ ██╗     ███████╗
██║    ██║██║██║     ██║       ██╔════╝██╔════╝██║  ██║██╔═══██╗██║     ██╔════╝
██║ █╗ ██║██║██║     ██║       █████╗  ██║     ███████║██║   ██║██║     ███████╗
██║███╗██║██║██║     ██║       ██╔══╝  ██║     ██╔══██║██║   ██║██║     ╚════██║
╚███╔███╔╝██║███████╗███████╗  ███████╗╚██████╗██║  ██║╚██████╔╝███████╗███████║
 ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝  ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝
                `,
                text: `
                    <h1>Welcome to my website</h1>
                    <p>Navigate through the sections using the menu above.</p>
                `
            },
            about: {
                ascii: '',
                text: `
                    <h2>About Me</h2>
                    <p>Education:</p>
                    <ul>
                        <li>University of California, Berkeley</li>
                        <li>B.A. Applied Mathematics (Spring 2026)</li>
                    </ul>
                    <br>
                    <p>Interests:</p>
                    <ul>
                        <li>Mathematics</li>
                        <li>Quantitative Finance</li>
                        <li>Software Development</li>
                        <li>GNU/Linux, computing, and open source software</li>
                        <li>And more...</li>
                    </ul>
                `
            },
            projects: {
                ascii: '',
                text: `
                    <h2>My Projects</h2>
                    <div class="project-list">
                        <div class="project-entry">
                            <div class="project-header">
                                <h3>[TAMU Fractals Research Team]</h3>
                                <span class="project-date">[Fall 2023 - Spring 2024]</span>
                            </div>
                            <div class="project-content">
                                <p class="project-desc">As an undergraduate researcher in the Texas A&M University Fractals Research Team, I researched and developed methods of computational mathematics using C++ to analyze the Sierpinski gasket.</p>
                                <div class="project-links">
                                    <a href="https://people.tamu.edu/~paruiz/UFRT.html" target="_blank">[VIEW PROJECT IN NEW TAB]</a>
                                </div>
                            </div>
                        </div>
                        <div class="project-entry">
                            <div class="project-header">
                                <h3>[Goldman Sachs Challenge] (3rd place in TAMUHack 2023)</h3>
                                <span class="project-date">[Jan 2023]</span>
                            </div>
                            <div class="project-content">
                                <p class="project-desc">Market analysis using a custom-trained Cohere NLP machine learning pipeline designed to mitigate cusomer risk using automated news API scoring.</p>
                                <div class="project-links">
                                    <a href="https://devpost.com/software/ainvest" target="_blank">[VIEW PROJECT IN NEW TAB]</a>
                                </div>
                            </div>
                        </div>
                        <div class="project-entry">
                            <div class="project-header">
                                <h3>[Livestreaming for Good] (1st place in Datathon 2022)</h3>
                                <span class="project-date">[Oct 2022]</span>
                            </div>
                            <div class="project-content">
                                <p class="project-desc">Friendly live streaming service that uses natural language processing and sentiment analysis to incentivize positive communities.</p>
                                <div class="project-links">
                                    <a href="https://devpost.com/software/friendlylive" target="_blank">[VIEW PROJECT IN NEW TAB]</a>
                                </div>
                            </div>
                        </div>
                        <div class="project-entry">
                            <div class="project-header">
                                <h3>[Natural Logarithm of 2]</h3>
                                <span class="project-date">[Apr - Sep 2021]</span>
                            </div>
                            <div class="project-content">
                                <p class="project-desc">I operated a high-uptime homelab system using Proxmox virtualization of containerized Linux instances in order to calculate the Natural Log of 2 to 1.5 x 10^12 digits, the highest degree of accuracy ever calculated at the time.</p>
                                <div class="project-links">
                                    <a href="http://www.numberworld.org/y-cruncher/records/2021_9_9_log2.txt" target="_blank">[VIEW PROJECT IN NEW TAB]</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            contact: {
                ascii: '',
                text: `
                    <h2>Contact Me</h2>
                    <div class="contact-grid">
                        <p><span class="contact-label">[EMAIL]</span> <a href="mailto:williamechols@berkeley.edu">williamechols@berkeley.edu</a></p>
                        <p><span class="contact-label">[GITHUB]</span> <a href="https://github.com/williamechols" target="_blank">github.com/williamechols</a></p>
                        <p><span class="contact-label">[LINKEDIN]</span> <a href="https://linkedin.com/in/williamdechols" target="_blank">linkedin.com/in/williamdechols</a></p>
                    </div>
                    <br>
                    <div class="contact-message">
                        <p>Feel free to reach out</p>
                    </div>
                `
            },
            blog: {
                ascii: '',
                text: `
                    <h2>Blog Posts</h2>
                    <div class="blog-list">
                        <div class="blog-entry">
                            <div class="blog-header">
                                <h3>[Mathematics and Computing]</h3>
                                <span class="blog-date">[2024-03-15]</span>
                            </div>
                            <div class="blog-content">
                                <p class="blog-desc">Exploring the intersection of mathematical concepts and computational methods.</p>
                                <div class="blog-links">
                                    <a href="blog/math-computing.html" target="_blank">[READ MORE]</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        };
        
        return content[page] || content.home;
    }

    filterProjects(category) {
        const projects = document.querySelectorAll('.project-item');
        projects.forEach(project => {
            if (category === 'all' || project.dataset.category === category) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
    }
}

class ContactForm {
    validateForm(formData) {
        const errors = [];
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.push('Please enter a valid email address');
        }
        return errors;
    }
}

const contentManager = new ContentManager(); 