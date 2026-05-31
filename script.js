// ===================================
// COMPONENTS CLASSES
// ===================================

class ProfileSlider {
  constructor(containerId, photos) {
    this.container = document.getElementById(containerId);
    this.photos = photos;
    this.currentIndex = 0;
    if (this.container && this.photos.length > 0) {
      this.init();
    }
  }
  init() {
    this.photos.forEach((photo, index) => {
      const img = document.createElement('img');
      img.src = photo;
      img.className = `profile-slide ${index === 0 ? 'active' : ''}`;
      img.alt = "Foto da Alyce";
      this.container.appendChild(img);
    });
    
    if (this.photos.length > 1) {
      setInterval(() => this.nextSlide(), 3000); // Troca a cada 3 segundos
    }
  }
  nextSlide() {
    const slides = this.container.querySelectorAll('.profile-slide');
    slides[this.currentIndex].classList.remove('active');
    this.currentIndex = (this.currentIndex + 1) % slides.length;
    slides[this.currentIndex].classList.add('active');
  }
}

class CountdownTimer {
  constructor(targetDate, containerElement) {
    this.targetDate = targetDate;
    this.container = containerElement;
    this.intervalId = null;
  }
  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }
  stop() {
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
  }
  update() {
    const now = new Date();
    const difference = this.targetDate - now;
    if (difference <= 0) {
      this.container.innerHTML = '<div class="party-started">🎉 A festa começou! 🎉</div>';
      this.stop(); return;
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    this.container.innerHTML = `
      <div class="time-unit"><span class="time-value">${this.formatTimeUnit(days)}</span><span class="time-label">dias</span></div>
      <div class="time-unit"><span class="time-value">${this.formatTimeUnit(hours)}</span><span class="time-label">horas</span></div>
      <div class="time-unit"><span class="time-value">${this.formatTimeUnit(minutes)}</span><span class="time-label">minutos</span></div>
      <div class="time-unit"><span class="time-value">${this.formatTimeUnit(seconds)}</span><span class="time-label">segundos</span></div>
    `;
  }
  formatTimeUnit(value) { return value.toString().padStart(2, '0'); }
}

class RSVPForm {
  constructor(formElement) {
    this.form = formElement;
    this.whatsappNumber = formElement.dataset.whatsappNumber || '5554996987373';
    this.nameInput = formElement.querySelector('input[name="name"]');
    this.messageInput = formElement.querySelector('textarea[name="message"]');
    this.messageContainer = formElement.querySelector('.form-message');
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }
  handleSubmit(event) {
    event.preventDefault();
    const name = this.nameInput.value.trim();
    const message = this.messageInput.value.trim();
    if (name.length === 0) {
      this.displayError('⚠️ Por favor, preencha seu nome para confirmar presença.');
      return;
    }
    let whatsappMessage = `Olá! Meu nome é ${name} e estou confirmando minha presença na festa da Alyce!`;
    if (message) whatsappMessage += ` Mensagem: "${message}"`;
    window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    this.displayConfirmation();
  }
  displayConfirmation() {
    this.messageContainer.textContent = '✨ Confirmação enviada! ✨';
    this.messageContainer.className = 'form-message success';
    setTimeout(() => { this.messageContainer.textContent = ''; this.messageContainer.className = 'form-message'; }, 5000);
  }
  displayError(message) {
    this.messageContainer.textContent = message;
    this.messageContainer.className = 'form-message error';
    this.nameInput.focus();
  }
}

class LanternAnimation {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = null;
    this.lanterns = [];
    this.isRunning = false;
  }
  init() {
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return false;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    const initialCount = Math.floor(Math.random() * 10) + 20;
    for (let i = 0; i < initialCount; i++) this.lanterns.push(this.createLantern());
    return true;
  }
  resizeCanvas() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  createLantern() {
    const colors = ['#ffd700', '#ffed4e', '#ffa500'];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 1.5 + 0.5,
      sway: Math.random() * 20,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.4 + 0.6,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }
  updateLanterns() {
    for (let i = 0; i < this.lanterns.length; i++) {
      const l = this.lanterns[i];
      l.y -= l.speed;
      l.currentX = l.x + l.sway * Math.sin(l.y / 50 + l.swayOffset);
      if (l.y + l.size < 0) {
        this.lanterns[i] = this.createLantern();
        this.lanterns[i].y = this.canvas.height + l.size;
      }
    }
  }
  drawLantern(l) {
    const x = l.currentX || l.x; const y = l.y; const size = l.size;
    const g = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    g.addColorStop(0, l.color); g.addColorStop(0.5, l.color + 'dd'); g.addColorStop(1, 'transparent');
    this.ctx.globalAlpha = l.opacity;
    this.ctx.shadowBlur = 15; this.ctx.shadowColor = l.color;
    this.ctx.fillStyle = g; this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
    this.ctx.globalAlpha = 1.0; this.ctx.shadowBlur = 0;
  }
  animate() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateLanterns();
    for (const l of this.lanterns) this.drawLantern(l);
    requestAnimationFrame(() => this.animate());
  }
  start() { if (!this.isRunning) { this.isRunning = true; this.animate(); } }
  stop() { this.isRunning = false; }
}

class MusicPlayer {
  constructor(audioElement, muteBtn) {
    this.audio = audioElement;
    this.muteBtn = muteBtn;
    
    this.muteBtn.addEventListener('click', () => this.toggleMute());
    this.audio.addEventListener('error', () => this.handleError());
    
    // Tenta iniciar a música
    this.play();
  }
  play() {
    const p = this.audio.play();
    if (p !== undefined) {
      p.catch(e => {
        if (e.name === 'NotAllowedError') {
          console.warn('Autoplay bloqueado. A música tocará após interação.');
          const startOnInteraction = () => {
            this.audio.play();
            document.removeEventListener('click', startOnInteraction);
          };
          document.addEventListener('click', startOnInteraction);
        } else {
          this.handleError();
        }
      });
    }
  }
  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.updateDisplay();
  }
  updateDisplay() {
    this.muteBtn.textContent = this.audio.muted ? '🔇' : '🔊';
    this.muteBtn.setAttribute('aria-label', this.audio.muted ? 'Desmutar música' : 'Mutar música');
  }
  handleError() {
    this.muteBtn.textContent = '❌';
    this.muteBtn.disabled = true;
    this.muteBtn.style.opacity = '0.5';
  }
}

class MagicalEffects {
  constructor(container) {
    this.container = container;
    this.activeSparkles = [];
    this.init();
  }
  init() {
    document.querySelectorAll('button, .thumbnail').forEach(el => el.classList.add('hover-glow'));
    document.addEventListener('click', (e) => {
      if (!['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName))
        this.burst(e.clientX, e.clientY);
    });
    this.startRandom();
  }
  create(x, y, color = 'golden') {
    const s = document.createElement('div');
    s.className = `sparkle ${color}`;
    s.style.left = `${x}px`; s.style.top = `${y}px`;
    s.style.fontSize = `${Math.random() * 1.5 + 0.8}rem`;
    this.container.appendChild(s);
    setTimeout(() => { if (s.parentNode) s.parentNode.removeChild(s); }, 1500);
    return s;
  }
  burst(x, y) {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const s = this.create(x + (Math.random()-0.5)*40, y + (Math.random()-0.5)*40, Math.random()>0.5?'golden':'purple');
        s.classList.add('sparkle-burst-effect');
      }, i * 50);
    }
  }
  startRandom() {
    const loop = () => {
      this.create(Math.random()*window.innerWidth, Math.random()*window.innerHeight, Math.random()>0.5?'golden':'purple');
      setTimeout(loop, Math.random()*1500 + 1500);
    };
    loop();
  }
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const countdown = document.getElementById('countdown-timer');
  if (countdown) new CountdownTimer(new Date('2026-06-07T15:00:00'), countdown).start();

  const rsvp = document.getElementById('rsvp-form');
  if (rsvp) new RSVPForm(rsvp);

  const canvas = document.getElementById('lantern-canvas');
  if (canvas) {
    const anim = new LanternAnimation(canvas);
    if (anim.init()) anim.start();
  }

  const audio = document.getElementById('audio-element');
  const muteBtn = document.getElementById('mute-btn');
  if (audio && muteBtn) new MusicPlayer(audio, muteBtn);

  // Initialize Profile Slider
  const photos = [
    'assets/images/photos/alyce-1.jpg',
    'assets/images/photos/alyce-2.jpg',
    'assets/images/photos/alyce-3.jpg',
    'assets/images/photos/alyce-4.jpg'
  ];
  new ProfileSlider('profile-slides', photos);

  const sparkle = document.getElementById('sparkle-container') || document.body;
  if (sparkle) new MagicalEffects(sparkle);
});