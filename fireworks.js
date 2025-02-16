class Firework {
    constructor(x, y, color, shape = 'random') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.shape = shape;

        if (shape === 'love') {
            this.createHeartParticles();
        } else {
            for (let i = 0; i < 50; i++) {
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    speed: Math.random() * 4 + 1,
                    angle: Math.random() * Math.PI * 2,
                    alpha: 1,
                });
            }
        }
    }

    createHeartParticles() {
        for (let i = 0; i < 50; i++) {
            let t = Math.PI * 2 * (i / 50);
            let heartX = 16 * Math.pow(Math.sin(t), 3);
            let heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            this.particles.push({
                x: this.x + heartX * 5,
                y: this.y + heartY * 5,
                speed: Math.random() * 1.5 + 0.5,
                angle: Math.random() * Math.PI * 2,
                alpha: 1,
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.alpha -= 0.02;
        });

        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
}

class FireworkShow {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.fireworks = [];
        this.lastLaunch = 0;
        this.launchInterval = 500;
        this.countdown = 10;
        this.countdownStarted = false;
        this.messageDisplayed = false;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startCountdown() {
        this.countdownStarted = true;
        const countdownElement = document.getElementById('countdown');
        const messageElement = document.getElementById('message');
        const imageElement = document.getElementById('newYearImage'); // Ambil elemen gambar
    
        const interval = setInterval(() => {
            if (this.countdown > 1) {
                this.countdown--;
                countdownElement.textContent = this.countdown;
            } else {
                clearInterval(interval);
                countdownElement.style.opacity = '0'; // Efek fade-out
                setTimeout(() => {
                    countdownElement.style.display = 'none';
                    this.startFireworks();
                    messageElement.style.opacity = '1'; // Efek fade-in untuk teks
                    imageElement.style.opacity = '1'; // Efek fade-in untuk gambar
                }, 1000);
            }
        }, 1000);
    }
    
    startFireworks() {
        requestAnimationFrame(() => this.update());
    }

    launchFirework() {
        for (let i = 0; i < 3; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * (this.canvas.height / 2);
            const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange', 'cyan'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            if (Math.random() < 0.3) {
                this.fireworks.push(new Firework(x, y, color, 'love'));
            } else {
                this.fireworks.push(new Firework(x, y, color));
            }
        }
    }

    update() {
        const now = Date.now();
        if (now - this.lastLaunch > this.launchInterval) {
            this.launchFirework();
            this.lastLaunch = now;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.fireworks.forEach(firework => {
            firework.update();
            firework.draw(this.ctx);
        });

        this.fireworks = this.fireworks.filter(firework => firework.particles.length > 0);
        requestAnimationFrame(() => this.update());
    }
}

window.onload = () => {
    const show = new FireworkShow('canvas');
    show.startCountdown();
};
