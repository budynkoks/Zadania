
class Particle {
    constructor(x, y, vx, vy, hue, decay = 0.015) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.hue = hue;
        this.alpha = 1;
        this.decay = decay;
        this.active = true;
        this.radius = Math.random() * 2 + 1; 
    }

    update(gravity, canvasHeight) {
        // Aktualizacja pozycji
        this.x += this.vx;
        this.y += this.vy;

        // Stosowanie grawitacji
        this.vy += gravity;

        // Opór powietrza (tłumienie)
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Zanikanie
        this.alpha -= this.decay;

        // Dezaktywacja gdy całkowicie przezroczysta
        if (this.alpha <= 0) {
            this.alpha = 0;
            this.active = false;
        }

        // Kolizja z podłożem - odbicie z tłumieniem
        if (this.y >= canvasHeight) {
            this.y = canvasHeight;
            this.vy *= -0.6; // Odbicie z utratą energii
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
        ctx.fill();
    }

    /**
     * Resetuje cząsteczkę
     */
    reset(x, y, vx, vy, hue, decay = 0.015) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.hue = hue;
        this.alpha = 1;
        this.decay = decay;
        this.active = true;
        this.radius = Math.random() * 2 + 1;
    }
}


class Firework {
    constructor(startX, startY, targetX, targetY, speed = 8, particleCount = 150) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.particleCount = particleCount;
        
        // Obliczanie wektora prędkości (znormalizowany * prędkość)
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.hypot(dx, dy);
        
        this.vx = (dx / distance) * speed;
        this.vy = (dy / distance) * speed;
        
        // Losowy kolor rakiety
        this.hue = Math.random() * 360;
        
        // Flagi stanu
        this.active = true;
        this.exploded = false;
        
        // Promień rakiety (do rysowania)
        this.radius = 3;
        
        // Ogon rakiety (trail)
        this.trail = [];
        this.trailLength = 5;
    }

    /**
     * Aktualizuje pozycję rakiety
     */
    update() {
        // Zapisz poprzednią pozycję do ogona
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        // Aktualizacja pozycji
        this.x += this.vx;
        this.y += this.vy;

        // Sprawdzenie czy rakieta osiągnęła cel
        const distanceToTarget = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        
        if (distanceToTarget < 5) {
            this.exploded = true;
            this.active = false;
        }
    }

    draw(ctx) {
        // Rysowanie ogona rakiety
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i / this.trail.length) * 0.5;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, this.radius * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
            ctx.fill();
        }

        // Rysowanie rakiety
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
        ctx.fill();
    }

   
    explode() {
        const particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            // Losowy kąt w pełnym zakresie 360°
            const angle = Math.random() * Math.PI * 2;
            
            // Losowa prędkość 
            const speed = Math.random() * 6 + 2;
            
            // Obliczanie składowych prędkości
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            // Niewielka wariacja koloru (±20)
            const hueVariance = (Math.random() - 0.5) * 40;
            const particleHue = (this.hue + hueVariance + 360) % 360;
            
            // Losowe tempo zanikania
            const decay = Math.random() * 0.01 + 0.01;
            
            particles.push(new Particle(this.x, this.y, vx, vy, particleHue, decay));
        }
        
        return particles;
    }
}


class FireworkShow {
    
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Dopasowanie rozmiaru canvasa do okna
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Tablice obiektów
        this.particles = [];
        this.rockets = [];
        
        // Parametry symulacji (domyślne)
        this.gravity = 0.08;
        this.particleCount = 150;
        this.rocketSpeed = 8;
        
        // Automatyczny pokaz
        this.autoLaunch = true;
        this.autoInterval = 2000; // ms
        this.lastAutoLaunch = 0;
        
        // Efekty wizualne
        this.trailsEffect = true;
        this.glowEffect = true;
        
        // FPS counter
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        // Inicjalizacja obsługi zdarzeń
        this.setupEventListeners();
        this.setupControls();
        
        // Start pętli animacji
        this.lastTime = 0;
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    /**
     * Dopasowuje rozmiar canvasa do okna
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Konfiguruje obsługę zdarzeń myszy
     */
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            this.launchFirework(e.clientX, e.clientY);
        });
    }

    /**
     * Konfiguruje suwaki sterowania
     */
    setupControls() {
        // Grawitacja
        const gravitySlider = document.getElementById('gravity');
        const gravityValue = document.getElementById('gravityValue');
        gravitySlider.addEventListener('input', (e) => {
            this.gravity = parseFloat(e.target.value);
            gravityValue.textContent = this.gravity.toFixed(2);
        });

        // Liczba cząsteczek
        const particleCountSlider = document.getElementById('particleCount');
        const particleCountValue = document.getElementById('particleCountValue');
        particleCountSlider.addEventListener('input', (e) => {
            this.particleCount = parseInt(e.target.value);
            particleCountValue.textContent = this.particleCount;
        });

        // Interwał auto-startu
        const autoIntervalSlider = document.getElementById('autoInterval');
        const autoIntervalValue = document.getElementById('autoIntervalValue');
        autoIntervalSlider.addEventListener('input', (e) => {
            this.autoInterval = parseFloat(e.target.value) * 1000;
            autoIntervalValue.textContent = e.target.value;
        });

    }

    launchFirework(targetX, targetY, startX = null) {
        const x = startX !== null ? startX : this.canvas.width / 2;
        const y = this.canvas.height;
        
        const firework = new Firework(
            x, y,
            targetX, targetY,
            this.rocketSpeed,
            this.particleCount
        );
        
        this.rockets.push(firework);
    }

   
    autoLaunchRocket(currentTime) {
        if (!this.autoLaunch) return;
        
        if (currentTime - this.lastAutoLaunch >= this.autoInterval) {
            // Losowa pozycja X na ekranie
            const targetX = Math.random() * (this.canvas.width * 0.8) + this.canvas.width * 0.1;
            // Losowa wysokość eksplozji (górna część ekranu)
            const targetY = Math.random() * (this.canvas.height * 0.4) + this.canvas.height * 0.1;
            // Losowa pozycja startowa X
            const startX = Math.random() * this.canvas.width;
            
            this.launchFirework(targetX, targetY, startX);
            this.lastAutoLaunch = currentTime;
        }
    }

    
    updateFPS(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            
            // Aktualizacja fps w DOM
            document.getElementById('fps').textContent = this.fps;
        }
        
       
    }

 
    animate(currentTime) {
        // Aktualizacja FPS
        this.updateFPS(currentTime);
        
        // Automatyczne odpalanie
        this.autoLaunchRocket(currentTime);
        
        // Czyszczenie ekranu
        if (this.trailsEffect) {
            // Efekt trails - półprzezroczysty prostokąt
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Pełne czyszczenie
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Ustawienie efektu świetlnego (addytywne mieszanie)
        if (this.glowEffect) {
            this.ctx.globalCompositeOperation = 'lighter';
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
        }

        // Aktualizacja i rysowanie rakiet
        for (const rocket of this.rockets) {
            rocket.update();
            rocket.draw(this.ctx);
            
            // Gdy rakieta eksploduje, pobierz cząsteczki
            if (rocket.exploded) {
                const newParticles = rocket.explode();
                this.particles.push(...newParticles);
            }
        }

        // Aktualizacja i rysowanie cząsteczek
        for (const particle of this.particles) {
            particle.update(this.gravity, this.canvas.height);
            particle.draw(this.ctx);
        }

        // Przywrócenie domyślnego trybu kompozycji
        this.ctx.globalCompositeOperation = 'source-over';

        // Usuwanie nieaktywnych obiektów (filter zamiast splice w pętli)
        this.rockets = this.rockets.filter(r => r.active);
        this.particles = this.particles.filter(p => p.active);

        // Następna klatka
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const show = new FireworkShow(canvas);
    
    window.fireworkShow = show;
});
