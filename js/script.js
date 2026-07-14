window.addEventListener('scroll', () => {
    const zoomSection = document.getElementById('zoomSection');
    if (zoomSection) {
        const zRect = zoomSection.getBoundingClientRect();
        let zp = Math.max(0, Math.min(1, -zRect.top / (zRect.height - window.innerHeight)));

        const zoomAmount = Math.min(zp * 1.5, 1.2);
        document.getElementById('zoomImage').style.transform = `scale(${1 + zoomAmount})`;
        document.getElementById('initialText').style.opacity = zp > 0.15 ? 0 : 1;
        document.getElementById('scrollArrow').style.opacity = zp > 0.05 ? 0 : 1;
        document.getElementById('finalContent').style.opacity = zp > 0.5 ? 1 : 0;
    }

    // Map Section
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
        const mRect = mapSection.getBoundingClientRect();
        let mp = Math.max(0, Math.min(1, -mRect.top / (mRect.height - window.innerHeight)));

        const imgBrazil = document.getElementById('img-brazil');
        const rsLayer = document.getElementById('rs-container');
        const mapTextInitial = document.getElementById('mapTextInitial');
        const mapTextFinal = document.getElementById('mapTextFinal');

        const zoomProgress = Math.max(0, Math.min(1, mp / 0.6));
        const fadeProgress = Math.max(0, Math.min(1, (mp - 0.6) / 0.25));

        // Brasil com o zoom centrado no RS
        const brazilScale = 1 + zoomProgress * 3.8;
        imgBrazil.style.transformOrigin = '51% 100.9%';
        imgBrazil.style.transform = `scale(${brazilScale})`;
        imgBrazil.style.opacity = String(1 - fadeProgress);

        const rsAppear = Math.max(0, Math.min(1, (mp - 0.58) / 0.04)); 
        
        // Variaveis de ajuste do mapa do RS
        const offsetX = 2; 
        const offsetY = 4; 
        
        rsLayer.style.transformOrigin = '62% 87%';
        rsLayer.style.transform = `scale(1) translate(${offsetX}px, ${offsetY}px)`;
        rsLayer.style.opacity = String(rsAppear);
        rsLayer.style.pointerEvents = mp > 0.85 ? 'auto' : 'none';

        rsLayer.style.display = 'block';

        mapTextInitial.style.opacity = String(1 - zoomProgress * 1.5);
        
        if (mp > 0.65) {
            mapTextFinal.classList.add('visible');
        } else {
            mapTextFinal.classList.remove('visible');
        }
    }
});

// HOVER NOS PINS DO MAPA
const pins = document.querySelectorAll('.map-pin');
const photoViewer = document.getElementById('pinPhotoViewer');
const activeImg = document.getElementById('pinActiveImg');

if (pins.length > 0) {
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

// TIMELINE
const timelineData = [
    { year: 1941, title: "Synthesis and discovery of herbicidal activity", text: "Development of 2,4-D marked the beginning of the modern era of selective synthetic herbicides." },
    { year: 1946, title: "Lançamento comercial", text: "Começa a ser vendido amplamente para uso agrícola." },
    { year: 1970, title: "Guerra do Vietnã", text: "Componente do Agente Laranja, usado como desfolhante químico." },
    { year: 1985, title: "Seu título aqui", text: "Descrição do evento aqui." },
    { year: 2024, title: "Crise no RS", text: "Deriva do 2,4-D atinge vinhedos históricos no Rio Grande do Sul." }
];
const track = document.getElementById('timelineTrack'), knob = document.getElementById('timelineKnob'), infoBar = document.getElementById('infoBar');

if (track && knob && infoBar) {
    function initTimeline() {
        timelineData.forEach((d, i) => {
            const pct = (i / (timelineData.length - 1) * 100) + '%';

            const m = document.createElement('div');
            m.className = 'year-marker';
            m.innerText = d.year;
            m.style.top = pct;
            m.onclick = () => snapTo(i);
            track.appendChild(m);

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

        document.querySelectorAll('.year-marker').forEach((m, j) => m.classList.toggle('active', i === j));
        document.querySelectorAll('.year-label').forEach((l, j) => l.classList.toggle('active', i === j));
    }
    knob.onmousedown = () => { window.onmousemove = (e) => moveT(e.clientY); };
    window.onmouseup = () => { window.onmousemove = null; };
    initTimeline();
}

// SPRAYER
const canvas = document.getElementById('sprayerCanvas');
const sprayer = document.getElementById('sprayerVisual');
if (canvas && sprayer) {
    const ctx = canvas.getContext('2d');
    function initS() {
        canvas.width = sprayer.offsetWidth; canvas.height = sprayer.offsetHeight;
        const img = new Image(); img.src = 'assets/images/fundo.png';
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
        ctx.arc(e.clientX - r.left, e.clientY - r.top, 50, 0, Math.PI * 2); ctx.fill();
        
        // Gatilho da infeccao
        if (Math.random() > 0.5) { // Quantidade de particulas
            if (typeof InfectionSys !== 'undefined') {
                InfectionSys.createSpore(e.pageX, e.pageY);
            }
        }
    };
    sprayer.onmouseleave = () => document.getElementById('customCursor').style.display = 'none';
    new IntersectionObserver((entries) => { if (!entries[0].isIntersecting) initS(); }).observe(sprayer);
    initS();
}

// NEWS
function openTab(i) {
    const folderCover = document.getElementById('folderCover');
    if (folderCover) {
        document.querySelectorAll('.tab-btn').forEach((b, j) => b.classList.toggle('active', i === j));
        folderCover.style.display = i === 0 ? 'flex' : 'none';
        document.getElementById('folderPaper').classList.toggle('visible', i !== 0);
        if (i !== 0) document.getElementById('tab-content').innerHTML = `<div class="news-img" style="width:100%;height:180px;background:#ddd;border-radius:4px;margin-bottom:20px;"></div><span class="news-headline">Notícia ${i}</span><p>Tradução traduzida.</p>`;
    }
}

// MOBILE MENU TOGGLE
const mobileBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}
// VAGALUMES
(function () {
    const containers = [
        { el: document.getElementById('firefliesContainer'), count: 55 },
        { el: document.getElementById('firefliesSprayer'), count: 25 }
    ];
    
    containers.forEach(data => {
        if (!data.el) return;
        for (let i = 0; i < data.count; i++) {
            const f = document.createElement('div');
            f.className = 'firefly';
            f.style.left = Math.random() * 100 + '%';
            f.style.top = Math.random() * 100 + '%';
            f.style.setProperty('--duration', (2 + Math.random() * 4).toFixed(2) + 's');
            f.style.setProperty('--drift', (4 + Math.random() * 6).toFixed(2) + 's');
            f.style.setProperty('--dx', (Math.random() * 80 - 40).toFixed(0) + 'px');
            f.style.setProperty('--dy', (Math.random() * 60 - 30).toFixed(0) + 'px');
            f.style.setProperty('--max-opacity', (0.5 + Math.random() * 0.5).toFixed(2));
            f.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
            data.el.appendChild(f);
        }
    });
})();

// INFECTION & CRUMBLING (2,4-D EFFECT)
const InfectionSys = {
    level: 0,
    max: 100,
    words: [],
    chars: [],
    infectionStarted: false,
    maxDist: 1,
    
    init() {
        const moleculeInfo = document.querySelector('.molecule-info');
        if (!moleculeInfo) return;

        function wrapWords(element) {
            const nodes = Array.from(element.childNodes);
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue;
                    if (!text.trim()) return;
                    const words = text.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();
                    words.forEach(word => {
                        if (word.trim()) {
                            const wordSpan = document.createElement('span');
                            wordSpan.className = 'molecule-word';
                            for (let i = 0; i < word.length; i++) {
                                const charSpan = document.createElement('span');
                                charSpan.className = 'molecule-char';
                                charSpan.innerText = word[i];
                                wordSpan.appendChild(charSpan);
                            }
                            fragment.appendChild(wordSpan);
                        } else {
                            fragment.appendChild(document.createTextNode(word));
                        }
                    });
                    element.replaceChild(fragment, node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    wrapWords(node);
                }
            });
        }

        const h3 = moleculeInfo.querySelector('h3');
        const h4 = moleculeInfo.querySelector('h4');
        if (h3) wrapWords(h3);
        if (h4) wrapWords(h4);

        this.words = Array.from(moleculeInfo.querySelectorAll('.molecule-word'));
        this.chars = Array.from(moleculeInfo.querySelectorAll('.molecule-char'));
        
        // Animacao das letras
        this.chars.forEach(char => {
            char.dataset.rx = (Math.random() - 0.5) * 60;
            char.dataset.ry = 40 + Math.random() * 80;
            char.dataset.rdeg = (Math.random() - 0.5) * 90;
            char.dataset.curlx = (Math.random() - 0.5) * 180;
            char.dataset.curly = (Math.random() - 0.5) * 180;
            char.dataset.delay = Math.random() * 0.4; 
        });
        
        setTimeout(() => {
            const containerRect = moleculeInfo.getBoundingClientRect();
            // Inicia no canto superior direito do texto
            const centerX = containerRect.right;
            const centerY = containerRect.top; 
            
            this.words.forEach(word => {
                const rect = word.getBoundingClientRect();
                const wordX = rect.left + rect.width / 2;
                const wordY = rect.top + rect.height / 2;
                
                const dist = Math.sqrt(Math.pow(wordX - centerX, 2) + Math.pow(wordY - centerY, 2));
                word.dataset.dist = dist;
            });
            
            this.maxDist = Math.max(...this.words.map(w => parseFloat(w.dataset.dist)));
        }, 300); // IMPORTANTE: manter delay!
        
        // Quando a animacao de morte começa
        const scrollStartThreshold = 0.20;
        const scrollEndThreshold = 0.01;
        
        window.addEventListener('scroll', () => {
            const mRect = moleculeInfo.getBoundingClientRect();
            const startY = window.innerHeight * scrollStartThreshold;
            const endY = window.innerHeight * scrollEndThreshold;
            const range = startY - endY;
            
            let rawProgress = (startY - mRect.top) / range;
            let masterProgress = Math.max(0, Math.min(1, rawProgress));
            
            // Animacao pelo scroll
            this.chars.forEach(char => {
                const delay = parseFloat(char.dataset.delay);
                let localProgress = (masterProgress - delay) / 0.6;
                localProgress = Math.max(0, Math.min(1, localProgress));
                
                if (localProgress > 0) {
                    const tx = parseFloat(char.dataset.rx) * localProgress;
                    const ty = parseFloat(char.dataset.ry) * localProgress;
                    const rdeg = parseFloat(char.dataset.rdeg) * localProgress;
                    const curlX = parseFloat(char.dataset.curlx) * localProgress;
                    const curlY = parseFloat(char.dataset.curly) * localProgress;
                    
                    const brightness = 1 - (localProgress * 0.7);
                    
                    const scale = 1 - (localProgress * 0.4); 
                    
                    char.style.transform = `perspective(400px) translate(${tx}px, ${ty}px) rotate(${rdeg}deg) rotateX(${curlX}deg) rotateY(${curlY}deg) scale(${scale})`;
                    char.style.opacity = 1 - Math.pow(localProgress, 1.5);
                    char.style.filter = `brightness(${brightness})`;
                } else {
                    char.style.transform = 'none';
                    char.style.opacity = 1;
                    char.style.filter = 'none';
                }
            });
        });
    },
    
    startAutoInfection() {
        if (this.infectionStarted) return;
        this.infectionStarted = true;
        
        const autoInfectionInterval = setInterval(() => {
            if (this.level < this.max) {
                this.level = Math.min(this.max, this.level + 0.2);
                this.updateText();
            } else {
                clearInterval(autoInfectionInterval);
            }
        }, 50); // Velocidade da contaminacao
    },
    
    createSpore(x, y) {
        const spore = document.createElement('div');
        spore.className = 'brown-spore';
        spore.style.left = x + 'px';
        spore.style.top = y + 'px';
        
        const fallDur = 2 + Math.random() * 2;
        const drift = (Math.random() - 0.5) * 200;
        
        spore.style.setProperty('--fall-dur', fallDur + 's');
        spore.style.setProperty('--drift', drift + 'px');
        
        document.body.appendChild(spore);
        setTimeout(() => { if (spore.parentNode) spore.remove(); }, fallDur * 1000);
        
        this.startAutoInfection();
        
        this.level = Math.min(this.max, this.level + 0.2); 
        this.updateText();
    },
    
    updateText() {
        if (this.words.length === 0 || !this.maxDist) return;
        
        const currentRadius = (this.level / this.max) * (this.maxDist * 1.2); 
        
        this.words.forEach(word => {
            const dist = parseFloat(word.dataset.dist);
            if (dist < currentRadius + (Math.random() * 30 - 15)) {
                word.classList.add('infected-word');
            }
        });
    }
};

// Inicializa o sistema
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InfectionSys.init());
} else {
    InfectionSys.init();
}