
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

                        // Typing animation for hero subtitle
            const typingText = document.getElementById('typingText');
            const phrases = [
                "Civil Engineering Student | Python & C/C++ Developer | Web Development Master | LaTeX Guru | Mathematics Beast."
            ];
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100;

            function typeWriter() {
                const currentPhrase = phrases[0]; // Using only one phrase
                const displayedText = isDeleting
                    ? currentPhrase.substring(0, charIndex - 1)
                    : currentPhrase.substring(0, charIndex + 1);

                typingText.textContent = displayedText;
                typingText.style.width = 'auto'; // Reset width for proper centering
                typingText.style.width = typingText.offsetWidth + 'px'; // Set fixed width

                if (!isDeleting && charIndex === currentPhrase.length) {
                    // Pause at end of typing
                    setTimeout(() => {
                        isDeleting = true;
                        typingSpeed = 50; // Faster deleting
                        typeWriter();
                    }, 2000);
                    return;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    typingSpeed = 100; // Normal typing speed
                }

                charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
                setTimeout(typeWriter, typingSpeed);
            }

            // Start the animation when the element is in viewport
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    typeWriter();
                    observer.unobserve(typingText); // Stop observing after starting
                }
            }, { threshold: 0.5 });

            observer.observe(typingText);

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
                animateCounter(codingHours, 0, 3500, 2000);
                animateCounter(latexDocs, 0, 87, 2000);
                animateCounter(mathProblems, 0, 500, 2000);
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
            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(statsSection);
                }
            }, { threshold: 0.5 });

            statsObserver.observe(statsSection);

            // Matrix Background Animation
            const matrixCanvas = document.getElementById('matrixCanvas');
            const ctx = matrixCanvas.getContext('2d');

            // Set canvas to full window size
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;

            // Matrix characters - taken from the Katakana charset
            const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

            // Convert string to array of single characters
            const chars = matrixChars.split("");

            const fontSize = 14;
            const columns = matrixCanvas.width / fontSize;

            // Array of drops - one per column
            const drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }

            function drawMatrix() {
                // Black BG for the canvas
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                ctx.fillStyle = "#00ff41"; // Green text
                ctx.font = fontSize + "px monospace";

                // Loop over drops
                for (let i = 0; i < drops.length; i++) {
                    // Random character to print
                    const text = chars[Math.floor(Math.random() * chars.length)];

                    // x = i * fontSize, y = drops[i] * fontSize
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    // Increment Y coordinate
                    drops[i]++;

                    // Randomly reset drop back to top
                    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                }
            }

            // Render the animation every 50ms
            setInterval(drawMatrix, 50);

            // Particles.js Configuration
            particlesJS("particles-js", {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#e50914"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#e50914",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
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
                            "mode": "grab"
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
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });

            // ===== Projects Carousel =====
            const projectsSlider = document.getElementById('projectsSlider');
            const prevProjectBtn = document.getElementById('prevProject');
            const nextProjectBtn = document.getElementById('nextProject');
            const projectCards = document.querySelectorAll('.project-card');
            let currentProjectIndex = 0;
            const cardWidth = 320; // Width of each project card + margin

            function updateProjectsCarousel() {
                projectsSlider.scrollTo({
                    left: currentProjectIndex * cardWidth,
                    behavior: 'smooth'
                });
            }

            // Next project button
            nextProjectBtn.addEventListener('click', function() {
                if (currentProjectIndex < projectCards.length - 1) {
                    currentProjectIndex++;
                    updateProjectsCarousel();
                }
            });

            // Previous project button
            prevProjectBtn.addEventListener('click', function() {
                if (currentProjectIndex > 0) {
                    currentProjectIndex--;
                    updateProjectsCarousel();
                }
            });

            // Auto-rotate projects
            let projectsInterval = setInterval(function() {
                currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
                updateProjectsCarousel();
            }, 5000);

            // Pause auto-rotation on hover
            projectsSlider.addEventListener('mouseenter', function() {
                clearInterval(projectsInterval);
            });

            projectsSlider.addEventListener('mouseleave', function() {
                projectsInterval = setInterval(function() {
                    currentProjectIndex = (currentProjectIndex + 1) % projectCards.length;
                    updateProjectsCarousel();
                }, 5000);
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
            const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            return re.test(String(email).toLowerCase());
        }

        // Form submission handler with validation
        document.querySelector('#contactForm').addEventListener('submit', function(e) {
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            let isValid = true;

            // Reset error states
            emailInput.classList.remove('invalid');
            emailError.classList.remove('show');
            emailError.textContent = '';

            // Email validation
            if (!validateEmail(emailInput.value)) {
                emailInput.classList.add('invalid');
                emailError.textContent = 'Please enter a valid email address (e.g., user@example.com)';
                emailError.classList.add('show');
                isValid = false;
            }

            // Prevent form submission if invalid
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                document.querySelector('.invalid').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });

        // Real-time validation on input
        document.getElementById('email').addEventListener('input', function() {
            const emailError = document.getElementById('email-error');
            if (this.value.length > 0 && !validateEmail(this.value)) {
                this.classList.add('invalid');
                emailError.textContent = 'Please enter a valid email address';
                emailError.classList.add('show');
            } else {
                this.classList.remove('invalid');
                emailError.classList.remove('show');
            }
        });
