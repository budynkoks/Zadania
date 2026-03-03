
class Hand {
    // Długość, grubość i kolor wskazówki
    constructor(length, width, color) {
        this.length = length;
        this.width = width;
        this.color = color;
    }

    /**
     * Rysuje wskazówkę w kontekście canvas.
     * @param {CanvasRenderingContext2D} ctx - Kontekst canvasa
     * @param {number} angle - Kąt obrotu w radianach (0 = godzina 12)
     */
    // Rysuje wskazówkę w kontekście canvas, obracając ją o podany kąt
    draw(ctx, angle) {
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.strokeStyle = this.color;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.length);
        ctx.stroke();
        ctx.restore();
    }
}

class Clock {
    constructor(canvasId) {
        // Pobieramy canvas i jego kontekst
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        // Ustawiamy promień i środek zegara
        this.radius = Math.min(this.canvas.width, this.canvas.height) / 2;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        this.isPaused = false;
        // Wskazówki: długość, grubość, kolor
        this.hourHand = new Hand(this.radius * 0.5, 8, "#333");
        this.minuteHand = new Hand(this.radius * 0.75, 5, "#555");
        this.secondHand = new Hand(this.radius * 0.85, 2, "#e74c3c");

        // Obsługa klawiatury (Pauza)
        window.addEventListener('keydown', (e) => this.handleInput(e));
        
        // Rozpoczęcie pętli
        this.start();
    }
    // Obsługa klawiatury - spacja do pauzy/wznowienia
    handleInput(e) {
        if (e.code === 'Space') {
            // Zapobiegamy przewijaniu strony spacją
            e.preventDefault(); 
            this.togglePause();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    drawFace() {
        this.ctx.save();
        this.ctx.strokeStyle = "#333";
        
        for (let i = 0; i < 60; i++) {
            // Obracamy o 6 stopni (PI/30) dla każdej minuty
            // (Tutaj globalnie dla pętli, bo rysujemy je sekwencyjnie)
            this.ctx.beginPath();
            
            // Co 5 minut grubiej (godziny)
            if (i % 5 === 0) {
                this.ctx.lineWidth = 4;
                this.ctx.moveTo(0, -this.radius + 15);
                this.ctx.lineTo(0, -this.radius + 35);
            } else {
                // Minuty cieniej
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(0, -this.radius + 20);
                this.ctx.lineTo(0, -this.radius + 30);
            }
            this.ctx.stroke();
            this.ctx.rotate(Math.PI / 30);
        }
        
        //  tarcza zewnętrzna (okrąg)
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.arc(0, 0, this.radius - 5, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Przesuwamy punkt (0,0) na środek Canvasa
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);

        // Rysujemy tarczę
        this.drawFace();

        // Pobieramy aktualny czas
        const now = new Date();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        // Obliczamy kąty (w radianach)
        // 0 radianów = "godzina 12" w naszym lokalnym układzie (bo rysujemy do góry w -Y)
        // Pełne koło = 2 * PI
        
        // Płynny sekundnik: sekundy + ułamek sekundy
        const secondAngle = (seconds + milliseconds / 1000) * (Math.PI / 30);
        // Płynny minutnik: minuty + ułamek minuty
        const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30);
        
        // Godzinnik przesuwa się lekko z każdą minutą
        const hourAngle = ((hours % 12) + minutes / 60) * (Math.PI / 6);

        // Rysujemy wskazówki
        this.hourHand.draw(this.ctx, hourAngle);
        this.minuteHand.draw(this.ctx, minuteAngle);
        this.secondHand.draw(this.ctx, secondAngle);

        // Środkowa kropka 
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = "#333";
        this.ctx.fill();

        // Przywracamy układ współrzędnych (cofamy translate)
        this.ctx.restore();
    }
    // Pętla animacji
    start() {
        const loop = () => {
            if (!this.isPaused) {
                this.draw();
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}
// Inicjalizacja zegara po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    new Clock('clockCanvas');
});
