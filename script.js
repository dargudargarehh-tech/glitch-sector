const bee = document.getElementById('bee-target');
const sEl = document.getElementById('score-val');
const lEl = document.getElementById('lyric-val');
const world = document.getElementById('bee-game-v5');
const fireBtn = document.getElementById('fire-trigger');

const lyrics = [
    "OH, I'M A BUMBLEBEE!", 
    "A BUMBLEBEE WHO LIKES TO EAT KFC!", 
    "SPARE ME THE CELERY!", 
    "MY KFC!!!"
];

let x = 100, y = 100, vx = 12, vy = 9, score = 0, lIdx = 0;

// THE MOTION ENGINE
function run() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    x += vx;
    y += vy;
    
    // Screen Bounce
    if (x <= 0 || x >= w - 120) vx *= -1;
    if (y <= 0 || y >= h - 200) vy *= -1;
    
    bee.style.left = x + 'px';
    bee.style.top = y + 'px';
    
    // Flip bee based on direction
    bee.style.transform = `scaleX(${vx > 0 ? -1 : 1})`;
    
    requestAnimationFrame(run);
}
run();

// FIRE LOGIC
fireBtn.addEventListener('click', function() {
    // Start lyrics on first click
    if (lIdx === 0) {
        setInterval(() => { 
            lEl.innerText = lyrics[lIdx % lyrics.length];
            lIdx++;
        }, 2500);
    }
    
    this.disabled = true;
    this.style.opacity = "0.5";

    const m = document.createElement('div');
    m.innerHTML = "🍗";
    m.className = "missile";
    world.appendChild(m);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight - 100;

    const hunt = setInterval(() => {
        const dx = (x + 60) - mx;
        const dy = (y + 60) - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx);
        
        mx += Math.cos(angle) * 35; 
        my += Math.sin(angle) * 35;
        
        m.style.left = mx + 'px'; 
        m.style.top = my + 'px';
        m.style.transform = `rotate(${angle + 2.5}rad)`;

        if (dist < 80) {
            clearInterval(hunt);
            m.innerHTML = "💥"; 
            m.style.fontSize = "250px";
            
            world.classList.add('hit-impact');
            score++; 
            sEl.innerText = `HITS: ${score}`;
            bee.style.visibility = "hidden";
            
            setTimeout(() => { 
                world.classList.remove('hit-impact');
                m.remove(); 
                bee.style.visibility = "visible"; 
                fireBtn.disabled = false;
                fireBtn.style.opacity = "1";
            }, 700);
        }
    }, 16);
});