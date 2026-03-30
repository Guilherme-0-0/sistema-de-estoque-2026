// ===================================
// SISTEMA DE PARTÍCULAS ANIMADAS
// ===================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.connectionDistance = 150;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.resize();
        this.init();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.documentElement.scrollHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY + window.pageYOffset;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualizar e desenhar partículas
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Conectar partículas próximas
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5 + 0.3})`;
    }
    
    update(mouse) {
        // Movimento base
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Interação com o mouse
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 0.5;
                const directionY = forceDirectionY * force * 0.5;
                
                this.x -= directionX;
                this.y -= directionY;
            }
        }
        
        // Rebater nas bordas
        if (this.x < 0 || this.x > this.canvas.width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.speedY *= -1;
        }
        
        // Manter dentro dos limites
        this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ===================================
// SISTEMA DE ANIMAÇÃO ON SCROLL (AOS)
// ===================================

class AnimateOnScroll {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Adicionar delay se especificado
                    const delay = entry.target.getAttribute('data-aos-delay');
                    if (delay) {
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                }
            });
        }, this.observerOptions);
        
        this.elements.forEach(element => observer.observe(element));
    }
}

// ===================================
// EFEITOS DE CARD INTERATIVOS
// ===================================

class CardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.member-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            // Efeito de parallax 3D
            card.addEventListener('mousemove', (e) => this.handleCardHover(e, card));
            card.addEventListener('mouseleave', () => this.resetCard(card));
            
            // Efeito de clique
            card.addEventListener('click', () => this.handleCardClick(card));
        });
    }
    
    handleCardHover(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        
        // Mover o glow effect
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            glow.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    resetCard(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    }
    
    handleCardClick(card) {
        // Efeito de pulso ao clicar
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = '';
        }, 10);
        
        // Adicionar classe temporária para animação
        card.classList.add('card-clicked');
        setTimeout(() => {
            card.classList.remove('card-clicked');
        }, 600);
    }
}

// ===================================
// SCROLL SUAVE
// ===================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Scroll suave para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===================================
// PARALLAX SCROLL
// ===================================

class ParallaxScroll {
    constructor() {
        this.sections = document.querySelectorAll('.team-section');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.sections.forEach((section, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = -(scrolled * speed);
            section.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ===================================
// CONTADOR ANIMADO
// ===================================

class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ===================================
// INDICADOR DE SCROLL
// ===================================

class ScrollIndicator {
    constructor() {
        this.indicator = document.querySelector('.scroll-indicator');
        this.init();
    }
    
    init() {
        if (!this.indicator) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                this.indicator.style.opacity = '0';
            } else {
                this.indicator.style.opacity = '1';
            }
        });
    }
}

// ===================================
// CURSOR PERSONALIZADO
// ===================================

class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'custom-cursor-follower';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        
        this.init();
    }
    
    init() {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });
        
        // Animação suave do follower
        const animate = () => {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            followerX += dx * 0.1;
            followerY += dy * 0.1;
            
            this.cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            
            requestAnimationFrame(animate);
        };
        animate();
        
        // Efeitos em elementos interativos
        const interactiveElements = document.querySelectorAll('a, button, .member-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
                this.cursorFollower.classList.add('active');
            });
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
                this.cursorFollower.classList.remove('active');
            });
        });
    }
}

// ===================================
// INICIALIZAÇÃO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de partículas
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
    
    // Inicializar animações on scroll
    new AnimateOnScroll();
    
    // Inicializar efeitos de card
    new CardEffects();
    
    // Inicializar scroll suave
    new SmoothScroll();
    
    // Inicializar parallax (desabilitado em mobile)
    if (window.innerWidth > 768) {
        new ParallaxScroll();
    }
    
    // Inicializar contador animado
    new AnimatedCounter();
    
    // Inicializar indicador de scroll
    new ScrollIndicator();
    
    // Inicializar cursor personalizado (apenas em desktop)
    if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
        // Desabilitado por padrão, pode ser ativado removendo o comentário
        // new CustomCursor();
    }
    
    // Adicionar loading state
    document.body.classList.add('loaded');
});

// ===================================
// PERFORMANCE MONITORING
// ===================================

// Otimizar performance em dispositivos com menos recursos
if (window.innerWidth < 768 || navigator.hardwareConcurrency < 4) {
    // Reduzir número de partículas em dispositivos mais fracos
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        canvas.style.opacity = '0.5';
    }
}

// ===================================
// EASTER EGGS
// ===================================

let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

// Adicionar animação rainbow para o easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .card-clicked {
        animation: cardPulse 0.6s ease-out;
    }
    
    @keyframes cardPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .custom-cursor,
    .custom-cursor-follower {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: width 0.3s, height 0.3s, border 0.3s;
    }
    
    .custom-cursor {
        background: rgba(99, 102, 241, 0.8);
        transform: translate(-50%, -50%);
    }
    
    .custom-cursor-follower {
        border: 2px solid rgba(99, 102, 241, 0.5);
        transform: translate(-50%, -50%);
        transition: all 0.3s ease-out;
    }
    
    .custom-cursor.active,
    .custom-cursor-follower.active {
        width: 40px;
        height: 40px;
    }
    
    body.loaded {
        animation: fadeIn 0.5s ease-out;
    }
`;
document.head.appendChild(style);