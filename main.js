        // ===== SMOOTH SCROLL & PERFORMANCE =====
        document.addEventListener('DOMContentLoaded', () => {
          // Debounce scroll/resize events
          let ticking = false;
          const optimizeScroll = () => {
            if (!ticking) {
              requestAnimationFrame(() => {
                // Your scroll-sensitive code here
                ticking = false;
              });
              ticking = true;
            }
          };
          window.addEventListener('scroll', optimizeScroll, { passive: true });

          // Preload images after page loads
          const lazyLoad = () => {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
              img.src = img.dataset.src;
            });
          };

          // Start after 1s to prioritize critical content
          setTimeout(lazyLoad, 1000);
        });

        // Instant page preloading (makes navigation feel instant)
        if (window.navigation && window.navigation.preload) {
          window.navigation.preload();
        }

        // ===== Document Ready Function =====
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize AOS Animation Library
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });

            // Header Scroll Effect
            const header = document.getElementById('header');

            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // Mobile Menu Toggle
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');

            hamburger.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                hamburger.innerHTML = navLinks.classList.contains('active') ?
                    '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });

            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });

            // Smooth scrolling for all links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Update active nav link on scroll
            const sections = document.querySelectorAll('section');
            const navItems = document.querySelectorAll('.nav-links a');

            window.addEventListener('scroll', function() {
                let current = '';

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;

                    if (pageYOffset >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${current}`) {
                        item.classList.add('active');
                    }
                });
            });

            //==== Typing Animation Functionality ====//

            // Animation state
            const terminalState = {
                isTyping: false,
                isPaused: false,
                currentTimeout: null,
                currentLineIndex: 0,
                currentCharIndex: 0,
                currentTextElement: null,
                cursor: null,
                lines: [
                    { text: ">>>>> Why do Python developers need glasses???.", delay: 300, isOutput: true },
                    { text: "Because they can't C !!!.", delay: 400 },
                    { text: "Welcome to Mukoya Khisa's 1337 Terminal.", delay: 400 },
                    { text: "Initializing... (Warning: Contains 99.999% pure computational awesomeness).", delay: 500 },
                    { text: "def display_credentials():", type: "code", class: "code-keyword", delay: 600 },
                    { text: "    print('Civil Engineering Student | Python & C/C++ Developer').", type: "code", class: "code-string", delay: 100 },
                    { text: "    print('Web Development Master | LaTeX Guru | Mathematics Beast').", type: "code", class: "code-string", delay: 100 },
                    { text: ">>>>> My IDE: 1% writing code 99% fixing my own typos.", delay: 400 },
                    { text: ">>>>> I don't use exceptions - I AM the exception 😎.", delay: 400 },
                    { text: "// Warning 💀💀💀: Exposure to this portfolio may cause intense hiring urges!!! 😁.", type: "code", class: "code-comment", delay: 300 }
                ]
            };

            // Initialize the terminal
            function initTerminal() {
                addControlButtons();
                setupEventListeners();
                startTyping();
            }

            // Add control buttons if they don't exist
            function addControlButtons() {
                const terminalHeader = document.querySelector('.terminal-header');
                if (!terminalHeader.querySelector('.terminal-controls')) {
                    terminalHeader.insertAdjacentHTML('beforeend', `
                        <div class="terminal-controls">
                            <button id="pauseBtn" class="terminal-control-btn" title="Pause">
                                <i class="fas fa-pause"></i>
                            </button>
                            <button id="restartBtn" class="terminal-control-btn" title="Restart">
                                <i class="fas fa-redo"></i>
                            </button>
                        </div>
                    `);
                }
            }

            // Set up event listeners
            function setupEventListeners() {
                document.getElementById('pauseBtn').addEventListener('click', togglePause);
                document.getElementById('restartBtn').addEventListener('click', restartAnimation);

                document.getElementById('workingTerminal').addEventListener('click', function(e) {
                    if (!e.target.closest('.terminal-control-btn') && !terminalState.isTyping) {
                        restartAnimation();
                    }
                });
            }

            // Start or resume typing animation
            function startTyping() {
                if (terminalState.isTyping && !terminalState.isPaused) return;

                // If resuming from pause
                if (terminalState.isPaused) {
                    terminalState.isPaused = false;
                    updatePauseButton();
                    typeCharacter(); // Continue typing from where we left off
                    return;
                }

                // Fresh start
                terminalState.isTyping = true;
                terminalState.isPaused = false;
                terminalState.currentLineIndex = 0;
                terminalState.currentCharIndex = 0;

                const terminalContent = document.getElementById("terminalContent");
                terminalContent.innerHTML = '';
                terminalContent.style.fontSize = '0.9rem';

                // Create initial line with cursor
                const initialLine = document.createElement('div');
                initialLine.className = 'terminal-line';
                initialLine.innerHTML = `
                    <span class="terminal-prompt">$</span>
                    <span class="terminal-text"></span>
                    <span class="terminal-cursor"></span>
                `;
                terminalContent.appendChild(initialLine);

                terminalState.currentTextElement = initialLine.querySelector('.terminal-text');
                terminalState.cursor = initialLine.querySelector('.terminal-cursor');

                typeCharacter();
            }

            // Core typing function
            function typeCharacter() {
                if (terminalState.isPaused) return;

                if (terminalState.currentLineIndex < terminalState.lines.length) {
                    const currentLine = terminalState.lines[terminalState.currentLineIndex];

                    // Create new line if needed
                    if (terminalState.currentCharIndex === 0 && terminalState.currentLineIndex > 0) {
                        terminalState.cursor.style.display = 'none';
                        terminalState.currentTextElement = createNewLine(currentLine.isOutput);

                        if (currentLine.class) {
                            const span = document.createElement('span');
                            span.className = currentLine.class;
                            terminalState.currentTextElement.appendChild(span);
                            terminalState.currentTextElement = span;
                        }
                    }

                    // Type next character
                    if (terminalState.currentCharIndex < currentLine.text.length) {
                        terminalState.currentTextElement.textContent += currentLine.text.charAt(terminalState.currentCharIndex);
                        terminalState.currentCharIndex++;
                        terminalState.currentTimeout = setTimeout(typeCharacter, 30 + Math.random() * 20);
                    } else {
                        // Move to next line
                        terminalState.currentLineIndex++;
                        terminalState.currentCharIndex = 0;
                        if (terminalState.currentLineIndex < terminalState.lines.length) {
                            terminalState.currentTimeout = setTimeout(typeCharacter, currentLine.delay || 10);
                        } else {
                            // Animation complete
                            const finalLine = document.createElement('div');
                            finalLine.className = 'terminal-line';
                            finalLine.innerHTML = `
                                <span class="terminal-prompt">$</span>
                                <span class="terminal-text"></span>
                                <span class="terminal-cursor"></span>
                            `;
                            document.getElementById("terminalContent").appendChild(finalLine);
                            terminalState.isTyping = false;
                            terminalState.currentTimeout = setTimeout(startTyping, 5000);
                        }
                    }
                }
            }

            // Create a new line in terminal
            function createNewLine(isOutput = false) {
                const terminalContent = document.getElementById("terminalContent");
                const lineDiv = document.createElement('div');
                lineDiv.className = 'terminal-line';

                if (!isOutput) {
                    lineDiv.innerHTML = `
                        <span class="terminal-prompt">$</span>
                        <span class="terminal-text"></span>
                    `;
                } else {
                    lineDiv.innerHTML = `<span class="terminal-text"></span>`;
                }

                terminalContent.appendChild(lineDiv);
                return lineDiv.querySelector('.terminal-text');
            }

            // Toggle pause state
            function togglePause() {
                if (!terminalState.isTyping) return;

                terminalState.isPaused = !terminalState.isPaused;
                updatePauseButton();

                if (terminalState.isPaused) {
                    clearTimeout(terminalState.currentTimeout);
                } else {
                    typeCharacter(); // Resume typing
                }
            }

            // Update pause button appearance
            function updatePauseButton() {
                const pauseBtn = document.getElementById('pauseBtn');
                if (terminalState.isPaused) {
                    pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    pauseBtn.title = 'Resume';
                } else {
                    pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    pauseBtn.title = 'Pause';
                }
            }

            // Restart the animation
            function restartAnimation() {
                clearTimeout(terminalState.currentTimeout);
                terminalState.isTyping = false;
                terminalState.isPaused = false;
                startTyping();
            }

            // Start when page loads
            window.addEventListener('load', initTerminal);


                        // Contact Form Submission with FormSubmit
            document.addEventListener('DOMContentLoaded', function() {
                const contactForm = document.querySelector('.contact-form form');

                if (contactForm) {
                    contactForm.addEventListener('submit', function(e) {
                        // Optional: Add loading state
                        const submitBtn = this.querySelector('button[type="submit"]');
                        const originalBtnText = submitBtn.innerHTML;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                        submitBtn.disabled = true;

                        // FormSubmit will handle the actual submission
                        // This is just for UX feedback
                        setTimeout(() => {
                            submitBtn.innerHTML = originalBtnText;
                            submitBtn.disabled = false;
                        }, 3000);
                    });
                }

                // Smooth scroll for contact link (if needed)
                document.querySelectorAll('a[href="#contact"]').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        e.preventDefault();
                        document.querySelector(this.getAttribute('href')).scrollIntoView({
                            behavior: 'smooth'
                        });
                    });
                });
            });

            // Counter Animation for Stats
            const projectsCount = document.getElementById('projectsCount');
            const codingHours = document.getElementById('codingHours');
            const latexDocs = document.getElementById('latexDocs');
            const mathProblems = document.getElementById('mathProblems');

            function animateCounters() {
                animateCounter(projectsCount, 0, 42, 2000);
                animateCounter(codingHours, 0, 3700, 2000);
                animateCounter(latexDocs, 0, 147, 2000);
                animateCounter(mathProblems, 0, 1600, 2000);
            }

            function animateCounter(element, start, end, duration) {
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    element.innerHTML = Math.floor(progress * (end - start) + start);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
            }

            // Initialize counters when stats section is in view
            const statsSection = document.getElementById('stats');
            let hasAnimated = false;

            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        animateCounters();
                        hasAnimated = true;
                    } else if (!entry.isIntersecting) {
                        hasAnimated = false; // Reset when section leaves view
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px' // Triggers 100px before entering viewport
            });

            // Start observing
            statsObserver.observe(statsSection);

            // Reset on page refresh
            window.addEventListener('beforeunload', () => {
                hasAnimated = false;
            });

            // Optional: Force reset when scrolling back up
            window.addEventListener('scroll', () => {
                if (window.scrollY < statsSection.offsetTop - window.innerHeight) {
                    hasAnimated = false;
                }
            }, { passive: true });


            // Matrix Background with Mouse Interaction
            const matrixCanvas = document.getElementById('matrixCanvas');
            const ctx = matrixCanvas.getContext('2d');

            // Set canvas to full window size
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;

            // More matrix characters (including Latin and Katakana)
            const matrixChars = "01アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const chars = matrixChars.split("");

            const fontSize = 12; // Smaller font for more columns
            const columns = matrixCanvas.width / fontSize;

            // Array of drops with more columns
            const drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = {
                    y: Math.random() * -1000, // Random starting position
                    speed: 1 + Math.random() * 3 // Random speed
                };
            }

            // Mouse position
            let mouseX = -1000;
            let mouseY = -1000;

            // Track mouse movement
            matrixCanvas.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            matrixCanvas.addEventListener('mouseout', () => {
                mouseX = -1000;
                mouseY = -1000;
            });

            function drawMatrix() {
                // Semi-transparent black BG with lower opacity for longer trails
                ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
                ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                ctx.font = `bold ${fontSize}px monospace`;

                // Draw each column
                for (let i = 0; i < drops.length; i++) {
                    const x = i * fontSize;
                    const y = drops[i].y;

                    // Calculate distance from mouse
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Change behavior based on mouse proximity
                    let currentSpeed = drops[i].speed;
                    let charColor = "#00ff41";

                    if (distance < 200) {
                        // Avoid mouse with more intense effect closer to cursor
                        const avoidanceFactor = (200 - distance) / 20;
                        currentSpeed += avoidanceFactor;

                        // Change color near mouse
                        const hue = 120 + (distance / 200) * 60;
                        charColor = `hsl(${hue}, 100%, ${50 + (distance / 200) * 30}%)`;
                    }

                    // Draw multiple characters in each column (trail effect)
                    for (let j = 0; j < 5; j++) {
                        const trailY = y - j * fontSize;
                        if (trailY > 0) {
                            const opacity = 1 - j * 0.2;
                            ctx.fillStyle = charColor.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
                            const text = chars[Math.floor(Math.random() * chars.length)];
                            ctx.fillText(text, x, trailY);
                        }
                    }

                    // Update position
                    drops[i].y += currentSpeed;

                    // Reset drop if it goes beyond bottom
                    if (drops[i].y * 1.2 > matrixCanvas.height && Math.random() > 0.97) {
                        drops[i].y = 0;
                        drops[i].speed = 1 + Math.random() * 3;
                    }
                }
            }

            // Animation loop using requestAnimationFrame
            let animationId;
            function animateMatrix() {
                drawMatrix();
                animationId = requestAnimationFrame(animateMatrix);
            }
            animateMatrix();

            // Handle resize
            window.addEventListener('resize', () => {
                matrixCanvas.width = window.innerWidth;
                matrixCanvas.height = window.innerHeight;
                cancelAnimationFrame(animationId);
                animateMatrix();
            });

            // Particles.js Configuration
                particlesJS("particles-js", {
                    "particles": {
                        "number": {
                            "value": 150, // Increased number of particles
                            "density": {
                                "enable": true,
                                "value_area": 500 // More densely packed
                            }
                        },
                        "color": {
                            "value": ["#e50914", "#00ff41", "#ffffff"] // Multiple colors
                        },
                        "shape": {
                            "type": ["circle", "triangle", "star"], // Varied shapes
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            }
                        },
                        "opacity": {
                            "value": 0.7,
                            "random": true,
                            "anim": {
                                "enable": true,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 2.5, // Smaller size for more particles
                            "random": true,
                            "anim": {
                                "enable": true,
                                "speed": 4,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 100, // Shorter distance for more connections
                            "color": "#e50914",
                            "opacity": 0.4,
                            "width": 0.8
                        },
                        "move": {
                            "enable": true,
                            "speed": 2.5, // Faster movement
                            "direction": "none",
                            "random": true,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": true,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "bubble" // More visible interaction
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 140,
                                "line_linked": {
                                    "opacity": 1
                                }
                            },
                            "bubble": {
                                "distance": 150,
                                "size": 6,
                                "duration": 2,
                                "opacity": 0.8,
                                "speed": 3
                            },
                            "repulse": {
                                "distance": 100,
                                "duration": 0.4
                            },
                            "push": {
                                "particles_nb": 6
                            },
                            "remove": {
                                "particles_nb": 2
                            }
                        }
                    },
                    "retina_detect": true
                });
            // ===== Projects Filtering Mechanism =====
            const filterBtns = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterBtns.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    btn.classList.add('active');

                    const filter = btn.dataset.filter;

                    projectCards.forEach(card => {
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });



                        // Lazy Load Images with Intersection Observer
            document.addEventListener("DOMContentLoaded", function() {
                const lazyImages = document.querySelectorAll("img.lazy");

                if ("IntersectionObserver" in window) {
                    const lazyImageObserver = new IntersectionObserver(
                        (entries, observer) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    const img = entry.target;
                                    img.src = img.dataset.src;
                                    img.classList.remove("lazy");
                                    observer.unobserve(img);
                                }
                            });
                        },
                        {
                            rootMargin: "200px", // Start loading 200px before entering viewport
                            threshold: 0.1
                        }
                    );

                    lazyImages.forEach((img) => lazyImageObserver.observe(img));
                } else {
                    // Fallback for older browsers
                    lazyImages.forEach((img) => {
                        img.src = img.dataset.src;
                        img.classList.remove("lazy");
                    });
                }
            });

            // Initialize AOS with lazy loading
                AOS.init({
                    disable: window.innerWidth < 768, // Disable on mobile if needed
                    startEvent: 'DOMContentLoaded',
                    offset: 100, // Start animations 100px earlier
                    once: true // Only animate once
                });


            // ===== AI Chatbox Functionality =====
            const chatboxToggle = document.getElementById('chatboxToggle');
            const chatboxClose = document.getElementById('chatboxClose');
            const chatbox = document.getElementById('chatbox');
            const chatboxMessages = document.getElementById('chatboxMessages');
            const chatboxInput = document.getElementById('chatboxInput');
            const chatboxSend = document.getElementById('chatboxSend');

            // Toggle chatbox visibility
            chatboxToggle.addEventListener('click', () => {
                chatbox.classList.toggle('active');
                if (chatbox.classList.contains('active')) {
                    addWelcomeMessage();
                }
            });

            chatboxClose.addEventListener('click', () => {
                chatbox.classList.remove('active');
            });

            // Chatbot knowledge base about Mukoya
            const mkKnowledge = {
                skills: [
                    "Civil Engineering (structural analysis, fluid mechanics, geotechnical)",
                    "Python programming (data analysis, automation, scripting)",
                    "C programming (system programming, algorithms)",
                    "Web development (HTML, CSS, JavaScript)",
                    "LaTeX typesetting (academic papers, technical documents)",
                    "Advanced mathematics (calculus, linear algebra, statistics)"
                ],
                projects: [
                    "Structural Analysis Tool - Python application for beam deflection analysis",
                    "Math Visualization Platform - Interactive 3D math concepts with Three.js",
                    "LaTeX Thesis Template - Professional academic template with automation",
                    "Construction Management System - Web-based project tracking tool",
                    "Algorithm Visualizer - Interactive sorting/pathfinding algorithm demo"
                ],
                services: [
                    "Engineering calculations and analysis",
                    "Programming solutions in Python/C",
                    "Web development and design",
                    "LaTeX document preparation",
                    "Math tutoring and problem solving",
                    "Technical consulting"
                ],
                personality: [
                    "Passionate about bridging engineering and technology",
                    "Enjoys solving complex mathematical problems for fun",
                    "Believes math is the language of the universe",
                    "Approaches problems with analytical precision",
                    "Loves creating elegant solutions to technical challenges"
                ]
            };

            // Chatbot responses with context awareness
            function getBotResponse(userMessage) {
                const lowerMsg = userMessage.toLowerCase();

                // Greetings
                if (/hello|hi|hey|greetings/i.test(lowerMsg)) {
                    return "Hey there! I'm Mukoya's AI assistant. What would you like to know about his skills or projects?";
                }

                // Skills
                if (/skill|what can you do|expert|experience/i.test(lowerMsg)) {
                    const randomSkill = mkKnowledge.skills[Math.floor(Math.random() * mkKnowledge.skills.length)];
                    return `Mukoya is proficient in ${randomSkill}. He combines engineering knowledge with programming skills to solve complex problems.`;
                }

                // Projects
                if (/project|work|build|create/i.test(lowerMsg)) {
                    const randomProject = mkKnowledge.projects[Math.floor(Math.random() * mkKnowledge.projects.length)];
                    return `One of Mukoya's notable projects: "${randomProject}". You can find more in his projects section.`;
                }

                // Services
                if (/service|offer|hire|work with|collaborate/i.test(lowerMsg)) {
                    const randomService = mkKnowledge.services[Math.floor(Math.random() * mkKnowledge.services.length)];
                    return `Mukoya offers ${randomService}. He's currently available for freelance work and collaborations.`;
                }

                // Personality
                if (/who are you|about you|personality|style/i.test(lowerMsg)) {
                    const randomTrait = mkKnowledge.personality[Math.floor(Math.random() * mkKnowledge.personality.length)];
                    return `Mukoya is ${randomTrait}. His unique combination of skills makes him a versatile problem solver.`;
                }

                // Contact
                if (/contact|reach|email|phone|connect/i.test(lowerMsg)) {
                    return "You can contact Mukoya through the contact form on this site or via email at sir.mukoyakhisa@gmail.com";
                }

                // Math
                if (/math|calculus|algebra|equation|problem/i.test(lowerMsg)) {
                    return "Mukoya is passionate about mathematics and enjoys solving complex problems. He can help with everything from basic calculus to advanced linear algebra.";
                }

                // Coding
                if (/code|programming|python|c|javascript|html|css/i.test(lowerMsg)) {
                    return "Mukoya has strong programming skills across multiple languages. He particularly enjoys using Python for engineering applications and C for system programming.";
                }

                // Engineering
                if (/engineering|civil|structural|analysis|design/i.test(lowerMsg)) {
                    return "As a civil engineering student, Mukoya specializes in structural analysis, fluid mechanics, and geotechnical engineering with a computational approach.";
                }

                // LaTeX
                if (/latex|document|thesis|paper|publish/i.test(lowerMsg)) {
                    return "Mukoya is a LaTeX expert who can create professional technical documents with perfect mathematical notation and automated formatting.";
                }

                // Default responses
                const defaultResponses = [
                    "I'm MK's AI assistant. He's a civil engineering student who bridges engineering and technology through code.",
                    "MK combines analytical engineering skills with programming expertise. What specific area interests you?",
                    "For project inquiries, check the projects section or contact MK directly through the contact form.",
                    "MK is currently available for freelance work in engineering, programming, or LaTeX projects.",
                    "That's an interesting question! MK has a unique combination of engineering and software skills.",
                    "You can find examples of MK's work in the projects section of this portfolio.",
                    "MK approaches problems with both engineering precision and programming efficiency.",
                    "For technical document preparation, MK offers professional LaTeX typesetting services.",
                    "MK's engineering analysis skills are complemented by his programming automation capabilities.",
                    "Thanks for your interest! MK would be happy to discuss potential collaborations."
                ];

                return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            }

            // Initial welcome message
            function addWelcomeMessage() {
                if (chatboxMessages.children.length === 0) {
                    addMessage("Hello! I'm MK's AI assistant. You can ask me about his skills, projects, or services.", false);
                }
            }

            // Function to add a message to the chatbox
            function addMessage(text, isUser = false) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
                messageDiv.textContent = text;
                chatboxMessages.appendChild(messageDiv);
                chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
            }

            // Handle sending messages
            function sendMessage() {
                const message = chatboxInput.value.trim();
                if (message) {
                    addMessage(message, true);
                    chatboxInput.value = '';

                    // Simulate bot thinking
                    setTimeout(() => {
                        addMessage(getBotResponse(message));
                    }, 600);
                }
            }

            // Send message on button click
            chatboxSend.addEventListener('click', sendMessage);

            // Send message on Enter key
            chatboxInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            // Add welcome message when chatbox opens for the first time
            chatboxToggle.addEventListener('click', addWelcomeMessage, { once: true });
        });

        // Resize event listener for matrix canvas
        window.addEventListener('resize', function() {
            const matrixCanvas = document.getElementById('matrixCanvas');
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        });



                        // Email validation function
        function validateEmail(email) {
            // RFC 5322 Official Standard compliant regex
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!re.test(String(email).toLowerCase())) {
                return false;
            }

            // Additional strict checks
            const [localPart, domain] = email.split('@');
            const tld = domain.split('.').pop();

            // Reject if:
            // - TLD is too short (less than 2 chars)
            // - TLD is too long (more than 6 chars)
            // - Domain has consecutive dots
            // - Local part starts/ends with dot
            // - Email starts/ends with dot
            if (tld.length < 2 || tld.length > 6 ||
                domain.indexOf('..') > -1 ||
                localPart.startsWith('.') ||
                localPart.endsWith('.') ||
                email.startsWith('.') ||
                email.endsWith('.')) {
                return false;
            }

            return true;
        }

        // Form submission handler
        document.querySelector('#contactForm').addEventListener('submit', function(e) {
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            let isValid = true;

            // Reset states
            emailInput.classList.remove('invalid');
            emailError.classList.remove('show');

            // Strict email validation
            if (!validateEmail(emailInput.value.trim())) {
                emailInput.classList.add('invalid');
                emailError.textContent = 'Please enter a complete, valid email address (e.g., name@domain.com)';
                emailError.classList.add('show');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                emailInput.focus();
            }
        });

        // Real-time validation with debounce
        let emailTimeout;
        document.getElementById('email').addEventListener('input', function() {
            clearTimeout(emailTimeout);
            const emailError = document.getElementById('email-error');

            emailTimeout = setTimeout(() => {
                if (this.value.length > 0) {
                    if (!validateEmail(this.value.trim())) {
                        this.classList.add('invalid');
                        emailError.textContent = 'Please enter a complete, valid email address';
                        emailError.classList.add('show');
                    } else {
                        this.classList.remove('invalid');
                        emailError.classList.remove('show');
                    }
                } else {
                    this.classList.remove('invalid');
                    emailError.classList.remove('show');
                }
            }, 500);
        });

        //Contact Form Validation
        function validateForm() {
          const form = document.getElementById('contactForm');
          const inputs = form.querySelectorAll('input, textarea');
          let isValid = true;

          // Check reCAPTCHA first
          const recaptchaResponse = grecaptcha.getResponse();
          if (recaptchaResponse.length === 0) {
            document.getElementById('recaptcha-error').style.display = 'block';
            isValid = false;
          } else {
            document.getElementById('recaptcha-error').style.display = 'none';
          }

          // Validate other fields
          inputs.forEach(input => {
            if (!input.checkValidity()) {
              input.classList.add('is-invalid');
              isValid = false;
            } else {
              input.classList.remove('is-invalid');
            }
          });

          if (isValid) {
            // Optional: Show loading spinner
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
          }

          return isValid; // Only submit if all validations pass
        }

        // Real-time validation as user types
        document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(input => {
          input.addEventListener('input', function() {
            if (this.checkValidity()) {
              this.classList.remove('is-invalid');
            }
          });
        });


                    // Load AOS animation library lazily
        if ('IntersectionObserver' in window) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/aos@next/dist/aos.js';
            script.defer = true;
            script.onload = function() {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true
                });
            };
            document.head.appendChild(script);
        }

        // Load Font Awesome lazily
        const faScript = document.createElement('script');
        faScript.src = 'https://kit.fontawesome.com/your-kit-id.js';
        faScript.crossOrigin = 'anonymous';
        faScript.defer = true;
        document.head.appendChild(faScript);










