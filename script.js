// --- 1. SCROLL EVENTS ---
window.addEventListener('scroll', () => {
    // Zoom Section
    const zoomSection = document.getElementById('zoomSection');
    if(zoomSection) {
        const zRect = zoomSection.getBoundingClientRect();
        let zp = Math.max(0, Math.min(1, -zRect.top / (zRect.height - window.innerHeight)));
        
const zoomAmount = Math.min(zp * 1.5, 1.2); // zoom máximo de 2.2x, trava aí
document.getElementById('zoomImage').style.transform = `scale(${1 + zoomAmount})`;
document.getElementById('initialText').style.opacity = zp > 0.15 ? 0 : 1;
document.getElementById('scrollArrow').style.opacity = zp > 0.05 ? 0 : 1;
document.getElementById('finalContent').style.opacity = zp > 0.5 ? 1 : 0;
    }

// Map Section
const mapSection = document.getElementById('mapSection');
if(mapSection) {
    const mRect = mapSection.getBoundingClientRect();
    let mp = Math.max(0, Math.min(1, -mRect.top / (mRect.height - window.innerHeight)));

    const imgBrazil = document.getElementById('img-brazil');
    const rsLayer = document.getElementById('rs-container');
    const mapTextInitial = document.getElementById('mapTextInitial');
    const mapTextFinal = document.getElementById('mapTextFinal');

    // Fase 1 (0 → 0.6): zoom no Brasil centrado no RS + RS cresce junto por baixo
    // Fase 2 (0.6 → 0.85): Brasil some, RS já está no lugar certo
    // Fase 3 (0.85 → 1): RS totalmente visível

    const zoomProgress = Math.max(0, Math.min(1, mp / 0.6));
    const fadeProgress = Math.max(0, Math.min(1, (mp - 0.6) / 0.25));

    // Brasil faz zoom centrado no RS
    const brazilScale = 1 + zoomProgress * 3.8;
    imgBrazil.style.transformOrigin = '51% 100.9%';
    imgBrazil.style.transform = `scale(${brazilScale})`;
    imgBrazil.style.opacity = String(1 - fadeProgress);

    // RS começa pequeno e centrado no mesmo ponto que o Brasil está zoomando,
    // e cresce até escala 1 (tamanho total do container) no mesmo ritmo
    // Começa em scale(0.18) — proporção aproximada do RS dentro do Brasil — e vai até scale(1)
const rsAppear = Math.max(0, Math.min(1, (mp - 0.58) / 0.04)); // aparece só entre 0.58 e 0.62
rsLayer.style.transformOrigin = '62% 87%';
rsLayer.style.transform = `scale(1)`;
rsLayer.style.opacity = String(rsAppear);
rsLayer.style.pointerEvents = mp > 0.85 ? 'auto' : 'none';

    // Garante que o RS está sempre "ativo" visualmente (sem a classe controlling display)
    rsLayer.style.display = 'block';

    // Textos
    mapTextInitial.style.opacity = String(1 - zoomProgress * 1.5);
    if (mp > 0.85) {
        mapTextFinal.classList.add('visible');
    } else {
        mapTextFinal.classList.remove('visible');
    }
}
});

// --- LÓGICA DE HOVER NOS PINS DO MAPA ---
const pins = document.querySelectorAll('.map-pin');
const photoViewer = document.getElementById('pinPhotoViewer');
const activeImg = document.getElementById('pinActiveImg');

if(pins.length > 0) {
    pins.forEach(pin => {
        pin.addEventListener('mouseenter', (e) => {
            const imgSrc = e.target.getAttribute('data-img');
            activeImg.src = imgSrc;
            photoViewer.classList.add('visible');
        });

        pin.addEventListener('mouseleave', () => {
            photoViewer.classList.remove('visible');
        });
    });
}

// --- 2. TIMELINE ---
const timelineData = [
    { year: 1941, title: "Synthesis and discovery of herbicidal activity", text: "Development of 2,4-D marked the beginning of the modern era of selective synthetic herbicides." },
    { year: 1946, title: "Lançamento comercial", text: "Começa a ser vendido amplamente para uso agrícola." },
    { year: 1970, title: "Guerra do Vietnã", text: "Componente do Agente Laranja, usado como desfolhante químico." },
    { year: 1985, title: "Seu título aqui", text: "Descrição do evento aqui." },
    { year: 2024, title: "Crise no RS", text: "Deriva do 2,4-D atinge vinhedos históricos no Rio Grande do Sul." }
];
const track = document.getElementById('timelineTrack'), knob = document.getElementById('timelineKnob'), infoBar = document.getElementById('infoBar');

if(track && knob && infoBar) {
function initTimeline() {
    timelineData.forEach((d, i) => {
        const pct = (i / (timelineData.length - 1) * 100) + '%';

        // Ano à direita da linha
        const m = document.createElement('div');
        m.className = 'year-marker';
        m.innerText = d.year;
        m.style.top = pct;
        m.onclick = () => snapTo(i);
        track.appendChild(m);

        // Título fixo à esquerda da linha
        const lbl = document.createElement('div');
        lbl.className = 'year-label';
        lbl.innerText = d.title;
        lbl.style.top = pct;
        track.appendChild(lbl);
    });
    snapTo(0);
}
function moveT(clientY) {
    const r = track.getBoundingClientRect();
    const y = Math.max(0, Math.min(r.height, clientY - r.top));
    const rawIndex = (y / r.height) * (timelineData.length - 1);
    const i = Math.round(rawIndex);
    snapTo(i);
}
    function snapTo(i) {
        const p = (i / (timelineData.length - 1) * 100) + '%';
        knob.style.top = p; infoBar.style.top = p; updateT(i);
    }
function updateT(i) {
    const d = timelineData[i];
    infoBar.classList.add('visible');

    // Atualiza título e descrição na caixa verde
    let titleEl = infoBar.querySelector('.info-title');
    let textEl = infoBar.querySelector('.info-text');
    if (!titleEl) {
        titleEl = document.createElement('span');
        titleEl.className = 'info-title';
        textEl = document.createElement('span');
        textEl.className = 'info-text';
        infoBar.innerHTML = '';
        infoBar.appendChild(titleEl);
        infoBar.appendChild(textEl);
    }
    titleEl.innerText = d.title;
    textEl.innerText = d.text;

    // Ano destacado à direita + título destacado à esquerda
    document.querySelectorAll('.year-marker').forEach((m, j) => m.classList.toggle('active', i === j));
    document.querySelectorAll('.year-label').forEach((l, j) => l.classList.toggle('active', i === j));
}
    knob.onmousedown = () => { window.onmousemove = (e) => moveT(e.clientY); };
    window.onmouseup = () => { window.onmousemove = null; };
    initTimeline();
}

// --- 3. SPRAYER ---
const canvas = document.getElementById('sprayerCanvas');
const sprayer = document.getElementById('sprayerVisual');
if(canvas && sprayer) {
    const ctx = canvas.getContext('2d');
    function initS() {
        canvas.width = sprayer.offsetWidth; canvas.height = sprayer.offsetHeight;
        const img = new Image(); img.src = 'fundo.png';
        img.onload = () => { 
            ctx.globalCompositeOperation = 'source-over';
            var ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
            var nw = img.width * ratio, nh = img.height * ratio;
            ctx.drawImage(img, (canvas.width - nw) / 2, (canvas.height - nh) / 2, nw, nh);
        };
    }
    sprayer.onmousemove = (e) => {
        const r = sprayer.getBoundingClientRect();
        document.getElementById('customCursor').style.display = 'block';
        document.getElementById('customCursor').style.left = e.clientX + 'px';
        document.getElementById('customCursor').style.top = e.clientY + 'px';
        ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); 
        ctx.arc(e.clientX - r.left, e.clientY - r.top, 50, 0, Math.PI*2); ctx.fill();
    };
    sprayer.onmouseleave = () => document.getElementById('customCursor').style.display = 'none';
    new IntersectionObserver((entries) => { if(!entries[0].isIntersecting) initS(); }).observe(sprayer);
    initS();
}

// --- 4. NEWS ---
function openTab(i) {
    const folderCover = document.getElementById('folderCover');
    if(folderCover) {
        document.querySelectorAll('.tab-btn').forEach((b, j) => b.classList.toggle('active', i === j));
        folderCover.style.display = i === 0 ? 'flex' : 'none';
        document.getElementById('folderPaper').classList.toggle('visible', i !== 0);
        if(i !== 0) document.getElementById('tab-content').innerHTML = `<div class="news-img" style="width:100%;height:180px;background:#ddd;border-radius:4px;margin-bottom:20px;"></div><span class="news-headline">Notícia ${i}</span><p>Tradução traduzida.</p>`;
    }
}

// --- 5. MOBILE MENU TOGGLE ---
const mobileBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
if(mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}
// --- 6. VAGALUMES ---
(function() {
    const container = document.getElementById('firefliesContainer');
    if (!container) return;
    const COUNT = 55;
    for (let i = 0; i < COUNT; i++) {
        const f = document.createElement('div');
        f.className = 'firefly';
        f.style.left = Math.random() * 100 + '%';
        f.style.top  = Math.random() * 100 + '%';
        f.style.setProperty('--duration',    (2 + Math.random() * 4).toFixed(2) + 's');
        f.style.setProperty('--drift',       (4 + Math.random() * 6).toFixed(2) + 's');
        f.style.setProperty('--dx',          (Math.random() * 80 - 40).toFixed(0) + 'px');
        f.style.setProperty('--dy',          (Math.random() * 60 - 30).toFixed(0) + 'px');
        f.style.setProperty('--max-opacity', (0.5 + Math.random() * 0.5).toFixed(2));
        f.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
        container.appendChild(f);
    }
})();