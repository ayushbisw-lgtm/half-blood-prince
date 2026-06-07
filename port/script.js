/* ==============================================
   AYUSH BISWAS — FUTURISTIC PORTFOLIO
   script.js
   ============================================== */

// ==========================================
// 3D PARTICLE SYSTEM (Background Animation)
// ==========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    // Spread particles in a 3D box
    this.x = (Math.random() - 0.5) * 3000;
    this.y = (Math.random() - 0.5) * 3000;
    this.z = Math.random() * 2000;
    this.baseSize = Math.random() * 2 + 1;
    this.speedZ = -Math.random() * 1.5 - 0.5;
    
    // Pick a neon colour
    const colors = ['0, 240, 255', '180, 74, 255', '255, 45, 124', '59, 130, 246'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.z += this.speedZ;
    
    // Reset particle if it goes past the camera or too far away
    if (this.z <= 1) {
      this.z = 2000;
    }
  }

  draw() {
    // Perspective projection
    const scale = 1000 / this.z;
    const px = this.x * scale + canvas.width / 2;
    const py = this.y * scale + canvas.height / 2;
    const pSize = this.baseSize * scale;

    if (px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.min(1, scale * 0.5)})`;
      ctx.fill();
      
      // Add glow for closer particles
      if (this.z < 800) {
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = `rgba(${this.color}, 0.5)`;
      } else {
        ctx.shadowBlur = 0;
      }
    }
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = (Math.random() - 0.5) * 4000;
    this.y = (Math.random() - 0.5) * 4000;
    this.z = 2000;
    this.speedZ = -Math.random() * 20 - 10;
    this.length = Math.random() * 200 + 100;
  }

  update() {
    this.z += this.speedZ;
    if (this.z <= 1) this.reset();
  }

  draw() {
    const scale = 1000 / this.z;
    const px = this.x * scale + canvas.width / 2;
    const py = this.y * scale + canvas.height / 2;
    
    const scaleNext = 1000 / (this.z + this.length);
    const pxNext = this.x * scaleNext + canvas.width / 2;
    const pyNext = this.y * scaleNext + canvas.height / 2;

    ctx.beginPath();
    const grad = ctx.createLinearGradient(px, py, pxNext, pyNext);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2 * scale;
    ctx.moveTo(px, py);
    ctx.lineTo(pxNext, pyNext);
    ctx.stroke();
  }
}

class Drone {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = (Math.random() - 0.5) * 2000;
    this.y = (Math.random() - 0.5) * 1000;
    this.z = Math.random() * 1000 + 500;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.vz = (Math.random() - 0.5) * 1;
    this.angle = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    this.angle += 0.05;

    // Keep within bounds
    if (Math.abs(this.x) > 1500) this.vx *= -1;
    if (Math.abs(this.y) > 800) this.vy *= -1;
    if (this.z < 200 || this.z > 1500) this.vz *= -1;
  }

  draw() {
    const scale = 1000 / this.z;
    const px = this.x * scale + canvas.width / 2;
    const py = this.y * scale + canvas.height / 2;
    
    if (px < -50 || px > canvas.width + 50 || py < -50 || py > canvas.height + 50) return;

    ctx.save();
    ctx.translate(px, py);
    ctx.scale(scale, scale);
    
    // Hover animation
    ctx.translate(0, Math.sin(this.angle) * 5);

    // Drone Body
    ctx.fillStyle = '#1e1e4a';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-15, -8, 30, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Eyes/Lights
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.arc(-8, 0, 2, 0, Math.PI * 2);
    ctx.arc(8, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    // Propellers
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    const propX = Math.cos(this.angle * 10) * 12;
    ctx.beginPath();
    ctx.moveTo(-20, -10); ctx.lineTo(-20 + propX, -10);
    ctx.moveTo(20, -10); ctx.lineTo(20 - propX, -10);
    ctx.stroke();

    ctx.restore();
  }
}

class Astronaut {
  constructor() {
    this.x = -500;
    this.y = -200;
    this.z = 800;
    this.angle = 0;
  }

  update() {
    this.angle += 0.01;
    this.x += Math.sin(this.angle * 0.5) * 0.5;
    this.y += Math.cos(this.angle * 0.3) * 0.3;
  }

  draw() {
    const scale = 1000 / this.z;
    const px = this.x * scale + canvas.width / 2;
    const py = this.y * scale + canvas.height / 2;

    ctx.save();
    ctx.translate(px, py);
    ctx.scale(scale * 1.5, scale * 1.5);
    ctx.rotate(Math.sin(this.angle) * 0.1);

    // Helmet
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -22, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Visor Reflection
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(-3, -24, 3, 2, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#eee';
    ctx.beginPath();
    ctx.roundRect(-10, -8, 20, 24, 6);
    ctx.fill();

    // Backpack
    ctx.fillStyle = '#ccc';
    ctx.fillRect(-14, -6, 4, 18);
    ctx.fillRect(10, -6, 4, 18);

    ctx.restore();
  }
}

let shootingStars = [];
let drones = [];
let astronaut;

function initParticles() {
  particles = [];
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
  shootingStars = [];
  for (let i = 0; i < 5; i++) {
    shootingStars.push(new ShootingStar());
  }
  drones = [];
  for (let i = 0; i < 3; i++) {
    drones.push(new Drone());
  }
  astronaut = new Astronaut();
}

function drawGrid() {
  const time = Date.now() * 0.001;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
  ctx.lineWidth = 1;
  
  const gridSize = 100;
  const perspective = 1000;
  
  for (let i = -10; i <= 10; i++) {
    // Vertical lines
    ctx.beginPath();
    for (let z = 500; z < 2000; z += 100) {
      const scale = perspective / z;
      const x = (i * gridSize) * scale + canvas.width / 2;
      const y = (500) * scale + canvas.height / 2;
      if (z === 500) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Horizontal lines
    const z = i * 100 + 1000;
    if (z > 1) {
      const scale = perspective / z;
      const y = (500) * scale + canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(-2000 * scale + canvas.width / 2, y);
      ctx.lineTo(2000 * scale + canvas.width / 2, y);
      ctx.stroke();
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  shootingStars.forEach(s => {
    s.update();
    s.draw();
  });

  drones.forEach(d => {
    d.update();
    d.draw();
  });

  if (astronaut) {
    astronaut.update();
    astronaut.draw();
  }

  animFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ==========================================
// 1. LOADING SCREEN
// ==========================================
const loadingScreen = document.getElementById('loadingScreen');
const nameScreen = document.getElementById('nameScreen');
const mainPortfolio = document.getElementById('mainPortfolio');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let progress = 0;

function animateLoading() {
  if (!loadingScreen || !progressFill || !progressText) return;
  const interval = setInterval(() => {
    progress += Math.random() * 3 + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      // Transition to name entry screen
      setTimeout(() => {
        loadingScreen.classList.remove('active');
        setTimeout(() => {
          nameScreen.classList.add('active');
          document.getElementById('visitorNameInput').focus();
        }, 400);
      }, 600);
    }
    progressFill.style.width = progress + '%';
    progressText.textContent = `Loading... ${Math.floor(progress)}%`;
  }, 60);
}

// Start loading after a brief delay
setTimeout(animateLoading, 500);

// ==========================================
// 2. VISITOR NAME ENTRY
// ==========================================
const visitorNameInput = document.getElementById('visitorNameInput');
const enterPortfolioBtn = document.getElementById('enterPortfolioBtn');

function enterPortfolio() {
  const name = visitorNameInput.value.trim();
  if (!name) {
    visitorNameInput.style.borderColor = '#ff4444';
    visitorNameInput.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.15)';
    visitorNameInput.placeholder = 'Please enter your name...';
    setTimeout(() => {
      visitorNameInput.style.borderColor = '';
      visitorNameInput.style.boxShadow = '';
    }, 2000);
    return;
  }

  // Store visitor name
  sessionStorage.setItem('visitorName', name);

  // Transition to main portfolio
  nameScreen.classList.remove('active');
  setTimeout(() => {
    mainPortfolio.classList.add('active');
    document.body.style.overflow = 'auto';
    initMainPortfolio(name);
  }, 500);
}

if (enterPortfolioBtn) {
  enterPortfolioBtn.addEventListener('click', enterPortfolio);
}
if (visitorNameInput) {
  visitorNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enterPortfolio();
  });
}

// ==========================================
// 3. MAIN PORTFOLIO INITIALIZATION
// ==========================================
function initMainPortfolio(visitorName) {
  // Set greeting
  const greetingText = document.getElementById('greetingText');
  greetingText.textContent = `Hi ${visitorName}, welcome to Ayush Biswas's portfolio!`;

  // Typewriter effect for bio
  const heroBio = document.getElementById('heroBio');
  const bioText = "I am Ayush Biswas, a tech and creative person involved in hackathons, UI/UX design, website design, event branding, and creative digital projects. I love building modern digital experiences that combine creativity, design, and technology.";
  typeWriter(heroBio, bioText, 20);

  // Init scroll reveals
  initScrollReveal();

  // Init nav scroll spy
  initNavigation();

  // Init project filters
  initProjectFilters();

  // Init contact form
  initContactForm();

  // Pre-fill contact name
  const contactName = document.getElementById('contactName');
  if (contactName) contactName.value = visitorName;
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================
function typeWriter(element, text, speed) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  // Delay to let the animation start
  setTimeout(type, 1200);
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!nav || !navToggle || !navLinks) return;
  const links = navLinks.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  // Toggle mobile menu
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Scroll spy & nav background
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Nav background
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active section detection
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// ==========================================
// SCROLL REVEAL
// ==========================================
function initScrollReveal() {
  // Add reveal class to elements
  const revealTargets = document.querySelectorAll(
    '.section-header, .about-text, .trait-card, .skill-tag, .project-card, .timeline-item, .contact-form, .contact-card'
  );

  revealTargets.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealTargets.forEach(el => observer.observe(el));
}

// ==========================================
// PROJECT FILTERS
// ==========================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // 1. Animate out currently visible cards
      projectCards.forEach(card => {
        if (!card.classList.contains('hidden')) {
          card.classList.add('animating-out');
          card.classList.remove('animating-in');
        }
      });

      // 2. Wait for out-animation, then switch and animate in
      setTimeout(() => {
        projectCards.forEach((card, index) => {
          card.classList.remove('animating-out');
          
          const isMatch = filter === 'all' || card.dataset.category === filter;
          
          if (isMatch) {
            card.classList.remove('hidden');
            // Staggered entry effect
            card.style.animationDelay = `${(index % 3) * 0.1}s`;
            card.classList.add('animating-in');
          } else {
            card.classList.add('hidden');
            card.classList.remove('animating-in');
          }
        });

        // 3. Cleanup after animation finishes
        setTimeout(() => {
          projectCards.forEach(card => {
            card.classList.remove('animating-in');
            card.style.animationDelay = '';
          });
        }, 800);
      }, 400);
    });
  });
}

// ==========================================
// CONTACT FORM
// ==========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) return;

    // Show success feedback
    const btn = form.querySelector('.btn-primary');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent! ✓</span>';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      form.reset();
    }, 3000);

    // In a real deployment you'd send this via a service like Formspree, EmailJS, etc.
    console.log('Contact form submitted:', { name, email, message });
  });
}

// ==========================================
// 3D TILT EFFECT ON CARDS
// ==========================================
document.querySelectorAll('[data-tilt]').forEach(card => {
  // Inject card-glow if it doesn't exist
  if (!card.querySelector('.card-glow')) {
    const glow = document.createElement('div');
    glow.className = 'card-glow';
    card.appendChild(glow);
  }

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // For the tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Slightly stronger tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    
    // For the card glow effect
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ==========================================
// MAGNETIC BUTTON EFFECT
// ==========================================
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px) scale(1.05)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ==========================================
// PREVENT BODY SCROLL DURING LOADING/NAME ENTRY
// ==========================================
if (document.getElementById('loadingScreen')) {
  document.body.style.overflow = 'hidden';
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
