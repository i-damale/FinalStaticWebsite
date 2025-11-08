
// Particles
const canvas = document.getElementById('particle-canvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  let particles=[];
  const colors=['#00fff0','#8b00ff','#66fcf1'];
  function rand(a,b){return Math.random()*(b-a)+a}
  for(let i=0;i<80;i++){particles.push({x:rand(0,w),y:rand(0,h),r:rand(0.6,2.6),dx:rand(-0.3,0.6),dy:rand(-0.1,0.3),col:colors[Math.floor(Math.random()*colors.length)])}
  function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight}
  addEventListener('resize',resize);
  function draw(){ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(100,120,140,0.035)';ctx.lineWidth=1;
    for(let x=0;x<w;x+=120){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=120){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    particles.forEach(p=>{p.x+=p.dx;p.y+=p.dy;if(p.x>w)p.x=0;if(p.x<0)p.x=w;if(p.y>h)p.y=0;ctx.beginPath();ctx.fillStyle=p.col;ctx.globalAlpha=0.9;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.fillStyle=p.col;ctx.globalAlpha=0.06;ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1});
    requestAnimationFrame(draw);
  }
  draw();
}

// Typewriter
function typeWriterInit(){
  const el=document.getElementById('typewriter'); if(!el) return;
  const arr = JSON.parse(el.getAttribute('data-text'));
  let i=0,j=0,forward=true;
  function step(){
    const cur=arr[i];
    if(forward){ j++; el.textContent=cur.slice(0,j); if(j===cur.length){forward=false; setTimeout(step,1200); return;} }
    else{ j--; el.textContent=cur.slice(0,j); if(j===0){ forward=true; i=(i+1)%arr.length; } }
    setTimeout(step,60);
  }
  step();
}
document.addEventListener('DOMContentLoaded', typeWriterInit);

// Ninja animation (simple SVG + shuriken to PC)
function spawnNinja(){
  const stage = document.getElementById('ninja-stage');
  if(!stage) return;
  stage.innerHTML = '';
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('width','640'); svg.setAttribute('height','180'); svg.setAttribute('viewBox','0 0 640 180');
  const smoke = document.createElementNS(svgNS,'ellipse'); smoke.setAttribute('cx','120'); smoke.setAttribute('cy','120'); smoke.setAttribute('rx','40'); smoke.setAttribute('ry','8');
  smoke.setAttribute('fill','rgba(200,200,200,0.06)');
  svg.appendChild(smoke);
  const ninja = document.createElementNS(svgNS,'g');
  const head = document.createElementNS(svgNS,'circle'); head.setAttribute('cx','120'); head.setAttribute('cy','90'); head.setAttribute('r','18'); head.setAttribute('fill','#0b0c10'); head.setAttribute('stroke','#66fcf1'); head.setAttribute('stroke-width','2');
  const body = document.createElementNS(svgNS,'rect'); body.setAttribute('x','108'); body.setAttribute('y','108'); body.setAttribute('width','24'); body.setAttribute('height','30'); body.setAttribute('fill','#0b0c10'); body.setAttribute('stroke','#7a00ff'); body.setAttribute('stroke-width','2');
  ninja.appendChild(head); ninja.appendChild(body);
  svg.appendChild(ninja);
  const sh = document.createElementNS(svgNS,'circle'); sh.setAttribute('cx','150'); sh.setAttribute('cy','90'); sh.setAttribute('r','6'); sh.setAttribute('fill','#9ff');
  svg.appendChild(sh);
  stage.appendChild(svg);

  const pc = document.getElementById('pc-image');
  const pcRect = pc.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const startX = 150, startY = 90;
  const endX = (pcRect.left + pcRect.width/2) - stageRect.left;
  const endY = (pcRect.top + pcRect.height/2) - stageRect.top;
  let t=0;
  function anim(){
    t+=0.02;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t - Math.sin(t*Math.PI)*40;
    sh.setAttribute('cx', x);
    sh.setAttribute('cy', y);
    if(t<1){ requestAnimationFrame(anim); } else {
      const pcImg = document.getElementById('pc-image');
      if(pcImg) pcImg.src = 'assets/img/pc-quantum.png';
      stage.style.opacity = 0.9;
      setTimeout(()=>{ stage.style.opacity=1; }, 400);
    }
  }
  anim();
}

setTimeout(spawnNinja, 800);
setInterval(()=>{ spawnNinja(); }, 16000 + Math.random()*8000);

// Contact form - set API_BASE to your backend URL after deploy
const API_BASE = ""; // <-- REPLACE with your backend URL, e.g. https://your-app.onrender.com
document.getElementById('contact-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('contact-status');
  status.textContent = 'Sending...';
  try{
    const res = await fetch((API_BASE || '') + '/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if(data.ok){
      status.textContent = 'Message sent — thanks! I will reply soon.';
      document.getElementById('contact-form').reset();
    } else {
      status.textContent = 'Error: ' + (data.error || 'server error');
    }
  } catch(err){
    status.textContent = 'Network error — check backend URL in assets/js/main.js';
    console.error(err);
  }
});
