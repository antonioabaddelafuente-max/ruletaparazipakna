// Tus premios en la ruleta (Total: 20 casillas)
const originalPrizes = [
  '10%', 'Gracias', '3%', 'Gracias', '5%',    
  'Gracias', '3%', 'Gracias', '10%', 'Gracias', 
  '3%', 'Gracias', '5%', 'Gracias', 'Gracias',    
  'Gracias', 'Gracias', 'Gracias', 'Gracias', 'Gracias' 
];

let prizes = [...originalPrizes];

const c = document.getElementById('wheel');
const ctx = c.getContext('2d');
const n = 20;
const arc = 2 * Math.PI / n;
const r = 300;
let rot = 0;

function mezclarPremios() {
  for (let i = prizes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [prizes[i], prizes[j]] = [prizes[j], prizes[i]];
  }
}

function draw() {
  ctx.clearRect(0, 0, 600, 600);
  ctx.save();
  ctx.translate(300, 300);
  ctx.rotate(rot);
  
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, i * arc, (i + 1) * arc);
    ctx.closePath();
    
    const colores = ['#f39c12', '#e91e63', '#00bcd4', '#4caf50', '#9c27b0', '#f1c40f'];
    ctx.fillStyle = colores[i % colores.length];
    ctx.fill();
    
    ctx.save();
    ctx.rotate(i * arc + arc / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = "right";
    ctx.fillText(prizes[i], r - 30, 5); 
    ctx.restore();
  }
  ctx.restore();
}

mezclarPremios();
draw();

document.getElementById('spin').onclick = () => {
  document.getElementById('spin').style.pointerEvents = 'none';

  // Probabilidad del 1.5% (Entre 1 y 2 ganadores reales por cada 100 tiros)
  const win = Math.random() < 0.015; 
  let premioAsignado = 'Gracias';

  if (win) {
    const randPremio = Math.random();
    if (randPremio < 0.285) { 
      premioAsignado = '10%'; 
    } else if (randPremio < 0.571) { 
      premioAsignado = '5%';  
    } else { 
      premioAsignado = '3%'; 
    }
  }

  const indicesPosibles = [];
  prizes.forEach((p, index) => {
    if (p === premioAsignado) indicesPosibles.push(index);
  });
  const idx = indicesPosibles[Math.floor(Math.random() * indicesPosibles.length)];

  // CORRECCIÓN CLAVE: Restamos Math.PI / 2 para alinear el cálculo con la flecha de ARRIBA
  const girosCompletos = Math.PI * 2 * 6;
  const target = girosCompletos - (idx * arc) - (arc / 2) - (Math.PI / 2);
  
  // Limpiamos vueltas anteriores para evitar saltos raros en giros consecutivos
  let start = rot % (Math.PI * 2);
  let d = target - start;
  let t0 = null;

  function anim(t) {
    if (!t0) t0 = t;
    let p = Math.min((t - t0) / 4000, 1);
    rot = start + d * (1 - Math.pow(1 - p, 4));
    draw();
    if (p < 1) {
      requestAnimationFrame(anim);
    } else {
      document.getElementById('resultado').textContent = prizes[idx];
      document.getElementById('spin').style.pointerEvents = 'auto';
    }
  }
  requestAnimationFrame(anim);
}
