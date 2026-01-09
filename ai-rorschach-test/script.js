// Floating particles animation
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// Scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-section, .timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    reveals.forEach(reveal => observer.observe(reveal));
}

// Animate difficulty bars
function animateDifficultyBars() {
    const bars = document.querySelectorAll('.difficulty-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
}

// Radar Chart
function createRadarChart() {
    const canvas = document.getElementById('radarChart');
    const ctx = canvas.getContext('2d');

    // Set canvas size for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 60;

    const categories = [
        'API/Technical',
        'Infrastructure',
        'Security',
        'Cost Analysis',
        'Risk Assessment',
        'User Experience',
        'Implementation',
        'Scalability'
    ];

    const data = {
        chatgpt: [95, 10, 15, 0, 10, 20, 40, 5],
        gemini: [60, 95, 95, 90, 95, 60, 85, 95],
        claude: [75, 80, 65, 95, 85, 85, 90, 80],
        all: [77, 62, 58, 62, 63, 55, 72, 60]
    };

    let currentData = data.all;

    function drawRadarChart(animationProgress = 1) {
        ctx.clearRect(0, 0, rect.width, rect.height);

        const angleStep = (Math.PI * 2) / categories.length;

        // Draw background circles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        categories.forEach((_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        // Draw labels
        ctx.fillStyle = '#fafafa';
        ctx.font = '13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        categories.forEach((label, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const labelRadius = radius + 35;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;

            ctx.fillText(label, x, y);
        });

        // Draw data polygon
        ctx.beginPath();
        currentData.forEach((value, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const distance = (radius * (value / 100)) * animationProgress;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();

        // Fill
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(141, 75, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 0, 107, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Stroke
        ctx.strokeStyle = '#8d4bff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw data points
        ctx.fillStyle = '#ff006b';
        currentData.forEach((value, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const distance = (radius * (value / 100)) * animationProgress;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Initial animation
    let progress = 0;
    function animate() {
        if (progress < 1) {
            progress += 0.02;
            drawRadarChart(progress);
            requestAnimationFrame(animate);
        } else {
            drawRadarChart(1);
        }
    }

    // Observe when chart comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
                observer.unobserve(canvas);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(canvas);

    // Toggle buttons
    const buttons = document.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const ai = btn.getAttribute('data-ai');
            currentData = data[ai];

            progress = 0;
            animate();
        });
    });

    // Redraw on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newRect = canvas.getBoundingClientRect();
            canvas.width = newRect.width * dpr;
            canvas.height = newRect.height * dpr;
            ctx.scale(dpr, dpr);
            drawRadarChart(1);
        }, 250);
    });
}

// Scope Chart
function createScopeChart() {
    const canvas = document.getElementById('scopeChart');
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = [
        { name: 'ChatGPT', lines: 111, color: '#8d4bff' },
        { name: 'Claude Code', lines: 2870, color: '#00d9ff' },
        { name: 'Gemini', lines: 3500, color: '#ff006b' }
    ];

    const maxLines = Math.max(...data.map(d => d.lines));
    const padding = 60;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    function drawChart(animationProgress = 1) {
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, rect.height - padding);
        ctx.lineTo(rect.width - padding, rect.height - padding);
        ctx.stroke();

        // Draw bars
        const barWidth = chartWidth / data.length / 1.5;
        const spacing = chartWidth / data.length;

        data.forEach((item, i) => {
            const barHeight = (item.lines / maxLines) * chartHeight * animationProgress;
            const x = padding + spacing * i + (spacing - barWidth) / 2;
            const y = rect.height - padding - barHeight;

            // Gradient fill
            const gradient = ctx.createLinearGradient(x, y, x, rect.height - padding);
            gradient.addColorStop(0, item.color);
            gradient.addColorStop(1, item.color + '40');
            ctx.fillStyle = gradient;

            ctx.fillRect(x, y, barWidth, barHeight);

            // Border
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barWidth, barHeight);

            // Label
            ctx.fillStyle = '#fafafa';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.name, x + barWidth / 2, rect.height - padding + 25);

            // Value
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.fillStyle = item.color;
            ctx.fillText(item.lines + ' lines', x + barWidth / 2, y - 10);
        });

        // Y-axis labels
        ctx.fillStyle = '#999';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxLines / 5) * i);
            const y = rect.height - padding - (chartHeight / 5) * i;
            ctx.fillText(value, padding - 10, y + 5);
        }

        // Y-axis label
        ctx.save();
        ctx.translate(20, rect.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#fafafa';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Response Length (lines)', 0, 0);
        ctx.restore();
    }

    // Animation
    let progress = 0;
    function animate() {
        if (progress < 1) {
            progress += 0.02;
            drawChart(progress);
            requestAnimationFrame(animate);
        } else {
            drawChart(1);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
                observer.unobserve(canvas);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(canvas);

    // Redraw on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newRect = canvas.getBoundingClientRect();
            canvas.width = newRect.width * dpr;
            canvas.height = newRect.height * dpr;
            ctx.scale(dpr, dpr);
            drawChart(1);
        }, 250);
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Personality card interactions
document.querySelectorAll('.personality-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add a subtle pulse effect
        this.style.transform = 'scale(1.02)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const text = stat.textContent;

                // Extract number and suffix
                const match = text.match(/(\d+)([^0-9]*)/);
                if (match) {
                    const targetNum = parseInt(match[1]);
                    const suffix = match[2];
                    let current = 0;
                    const increment = targetNum / 50;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= targetNum) {
                            current = targetNum;
                            clearInterval(timer);
                        }
                        stat.textContent = Math.floor(current) + suffix;
                    }, 30);
                }

                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// Parallax effect for hero
let ticking = false;
function parallaxHero() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    const background = document.querySelector('.hero-background');

    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                hero.style.opacity = 1 - (scrolled / 800);
            }
            if (background) {
                background.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', parallaxHero);

// Cursor trail effect (subtle)
let lastX = 0;
let lastY = 0;
let particles = [];

class CursorParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
        this.size *= 0.95;
    }
}

document.addEventListener('mousemove', (e) => {
    // Only create particles if mouse moved significantly
    if (Math.abs(e.clientX - lastX) > 10 || Math.abs(e.clientY - lastY) > 10) {
        if (Math.random() > 0.7) { // Sporadic particles
            particles.push(new CursorParticle(e.clientX, e.clientY));
        }
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

// Create canvas for cursor particles
const cursorCanvas = document.createElement('canvas');
cursorCanvas.style.position = 'fixed';
cursorCanvas.style.top = '0';
cursorCanvas.style.left = '0';
cursorCanvas.style.width = '100%';
cursorCanvas.style.height = '100%';
cursorCanvas.style.pointerEvents = 'none';
cursorCanvas.style.zIndex = '9999';
document.body.appendChild(cursorCanvas);

const cursorCtx = cursorCanvas.getContext('2d');
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;

function animateCursorParticles() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    particles = particles.filter(p => p.life > 0);

    particles.forEach(particle => {
        particle.update();

        cursorCtx.beginPath();
        cursorCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        cursorCtx.fillStyle = `rgba(141, 75, 255, ${particle.life * 0.5})`;
        cursorCtx.fill();
    });

    requestAnimationFrame(animateCursorParticles);
}

animateCursorParticles();

window.addEventListener('resize', () => {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
});

// Paradox Chart (Speed vs Comprehensiveness)
function createParadoxChart() {
    const canvas = document.getElementById('paradoxChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Data: [comprehensiveness (0-100), speed_rank (1=fastest, 3=slowest), lines, name, color]
    const data = [
        { comp: 30, speed: 2, lines: 111, name: 'ChatGPT', color: '#8d4bff' },
        { comp: 95, speed: 1, lines: 3500, name: 'Gemini', color: '#ff006b' },
        { comp: 80, speed: 3, lines: 2870, name: 'Claude Code', color: '#00d9ff' }
    ];

    const padding = 80;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Convert speed rank to Y position (invert so faster is higher)
    function speedToY(speed) {
        const spacing = chartHeight / 4;
        return rect.height - padding - spacing * (4 - speed);
    }

    function drawChart(animationProgress = 1) {
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, rect.height - padding);
        ctx.lineTo(rect.width - padding, rect.height - padding);
        ctx.stroke();

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            // Vertical
            const x = padding + (chartWidth / 5) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, rect.height - padding);
            ctx.stroke();

            // Horizontal
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(rect.width - padding, y);
            ctx.stroke();
        }

        // Y-axis labels (Speed)
        ctx.fillStyle = '#fafafa';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Fastest', padding - 10, speedToY(1) + 5);
        ctx.fillText('Medium', padding - 10, speedToY(2) + 5);
        ctx.fillText('Slowest', padding - 10, speedToY(3) + 5);

        // X-axis labels (Comprehensiveness)
        ctx.textAlign = 'center';
        ctx.fillText('0%', padding, rect.height - padding + 25);
        ctx.fillText('25%', padding + chartWidth * 0.25, rect.height - padding + 25);
        ctx.fillText('50%', padding + chartWidth * 0.5, rect.height - padding + 25);
        ctx.fillText('75%', padding + chartWidth * 0.75, rect.height - padding + 25);
        ctx.fillText('100%', rect.width - padding, rect.height - padding + 25);

        // Axis labels
        ctx.fillStyle = '#fafafa';
        ctx.font = 'bold 15px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Comprehensiveness Score', rect.width / 2, rect.height - 10);

        ctx.save();
        ctx.translate(15, rect.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Response Speed', 0, 0);
        ctx.restore();

        // Draw bubbles
        data.forEach(point => {
            const x = padding + (point.comp / 100) * chartWidth;
            const y = speedToY(point.speed);
            const radius = Math.sqrt(point.lines) * 0.5 * animationProgress;

            // Glow effect
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, point.color + 'aa');
            gradient.addColorStop(0.7, point.color + '55');
            gradient.addColorStop(1, point.color + '00');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Bubble
            ctx.fillStyle = point.color + '99';
            ctx.strokeStyle = point.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = '#fafafa';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(point.name, x, y - radius - 15);

            // Stats
            ctx.font = '12px Inter, sans-serif';
            ctx.fillStyle = '#999';
            ctx.fillText(`${point.lines} lines`, x, y - radius - 2);
        });

        // Legend / Insight
        const insight = "The Paradox: Gemini (most comprehensive) finished FIRST";
        ctx.fillStyle = '#ff006b';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(insight, rect.width / 2, 35);
    }

    // Animation
    let progress = 0;
    function animate() {
        if (progress < 1) {
            progress += 0.02;
            drawChart(progress);
            requestAnimationFrame(animate);
        } else {
            drawChart(1);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
                observer.unobserve(canvas);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(canvas);

    // Redraw on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newRect = canvas.getBoundingClientRect();
            canvas.width = newRect.width * dpr;
            canvas.height = newRect.height * dpr;
            ctx.scale(dpr, dpr);
            drawChart(1);
        }, 250);
    });
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    revealOnScroll();
    animateDifficultyBars();
    createRadarChart();
    createScopeChart();
    createParadoxChart();
    animateStats();
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Secret: Make all the personality cards dance
        document.querySelectorAll('.personality-card').forEach((card, i) => {
            setTimeout(() => {
                card.style.animation = 'bounce 1s ease';
                setTimeout(() => {
                    card.style.animation = '';
                }, 1000);
            }, i * 200);
        });
    }
});
