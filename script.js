
// Particles: dense, tiny glowing orbs drifting downward (like snow), on top of the page (z-index controlled in CSS)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = [];
const density = 150; // increase for dense; scale by viewport
function initParticles(){
  particles = [];
  const count = Math.floor(density * Math.max(window.innerWidth, window.innerHeight) / 1000);
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.6 + 0.6,
      vy: 0.15 + Math.random()*0.6, // downward drift
      alpha: 0.06 + Math.random()*0.25,
      glow: 6 + Math.random()*14,
      phase: Math.random()*Math.PI*2
    });
  }
}
initParticles();
window.addEventListener('resize', ()=>{ initParticles(); });

function draw(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  for(const p of particles){
    p.y += p.vy;
    p.x += Math.sin(p.phase + p.y*0.002) * 0.2;
    // wrap
    if(p.y - p.r > canvas.height) { p.y = -10 - Math.random()*40; p.x = Math.random()*canvas.width; }
    ctx.beginPath();
    let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glow);
    grad.addColorStop(0, 'rgba(180,210,255,' + (p.alpha*1.0) + ')');
    grad.addColorStop(0.5, 'rgba(120,160,210,' + (p.alpha*0.5) + ')');
    grad.addColorStop(1, 'rgba(80,100,140,0)');
    ctx.fillStyle = grad;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

// Random subtle fade for all text elements — assign slightly different durations/delays
function addGhostFade(){
  const elems = document.querySelectorAll('h1,h2,h3,p,a,li, .lead, .subtitle, .section-title, .brand, .footer');
  elems.forEach((el,i)=>{
    el.classList.add('fade-ghost');
    // randomize duration and delay for each element to create a non-uniform whisper effect
    const d = 2.0 + Math.random()*5.0; // 2s to 7s
    const delay = Math.random()*3.5;
    el.style.animationDuration = d + 's';
    el.style.animationDelay = delay + 's';
    el.style.opacity = 0.94 + Math.random()*0.06;
  });
}
addGhostFade();

// Flicker every 5-9 seconds with scanline glitch
function scheduleFlicker(){
  const stage = document.querySelector('.center-stage');
  const schedule = 5000 + Math.random()*4000; // 5-9s
  setTimeout(()=>{
    stage.classList.add('flicker');
    // quick scanline shift using CSS ::after animation (one-off)
    setTimeout(()=>{ stage.classList.remove('flicker'); }, 220);
    scheduleFlicker();
  }, schedule);
}
scheduleFlicker();

// Ensure canvas stays above background but below content (z-index already set in CSS); set pointer-events none
canvas.style.position = 'fixed';
canvas.style.left = 0;
canvas.style.top = 0;
canvas.style.zIndex = 20;
canvas.style.pointerEvents = 'none';
canvas.style.mixBlendMode = 'screen';
