// --- 1. SCROLL EVENTS ---
window.addEventListener('scroll', () => {
    // Zoom Section
    const zoomSection = document.getElementById('zoomSection');
    if(zoomSection) {
        const zRect = zoomSection.getBoundingClientRect();
        let zp = Math.max(0, Math.min(1, -zRect.top / (zRect.height - window.innerHeight)));
        
        document.getElementById('zoomImage').style.transform = `scale(${1 + (zp * 1.5)})`;
        document.getElementById('initialText').style.opacity = zp > 0.2 ? 0 : 1;
        document.getElementById('scrollArrow').style.opacity = zp > 0.05 ? 0 : 1; 
        document.getElementById('finalContent').style.opacity = zp > 0.8 ? 1 : 0;
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

        if (mp > 0.4) {
            imgBrazil.style.opacity = '0';
            imgBrazil.style.transform = 'scale(2)';
            rsLayer.classList.add('active');
            mapTextInitial.style.opacity = '0';
            mapTextFinal.classList.add('visible');
        } else {
            imgBrazil.style.opacity = '1';
            imgBrazil.style.transform = 'scale(1)';
            rsLayer.classList.remove('active');
            mapTextInitial.style.opacity = '1';
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
const timelineData = [{ year: 1941, text: "Sintetizado na 2ª Guerra Mundial." }, { year: 1946, text: "Lançamento comercial inicial." }, { year: 1970, text: "Guerra do Vietnã." }, { year: 2024, text: "Crise no Rio Grande do Sul." }];
const track = document.getElementById('timelineTrack'), knob = document.getElementById('timelineKnob'), infoBar = document.getElementById('infoBar');

if(track && knob && infoBar) {
    function initTimeline() {
        timelineData.forEach((d, i) => {
            const m = document.createElement('div'); m.className = 'year-marker'; m.innerText = d.year;
            m.style.top = (i / (timelineData.length - 1) * 100) + '%';
            m.onclick = () => snapTo(i); track.appendChild(m);
        });
        snapTo(0);
    }
    function moveT(clientY) {
        const r = track.getBoundingClientRect(); let y = Math.max(0, Math.min(r.height, clientY - r.top));
        knob.style.top = y + 'px'; infoBar.style.top = y + 'px';
        updateT(Math.round((y / r.height) * (timelineData.length - 1)));
    }
    function snapTo(i) {
        const p = (i / (timelineData.length - 1) * 100) + '%';
        knob.style.top = p; infoBar.style.top = p; updateT(i);
    }
    function updateT(i) {
        const d = timelineData[i]; infoBar.classList.add('visible');
        document.getElementById('displayYear').innerText = d.year;
        document.getElementById('displayText').innerText = d.text;
        document.querySelectorAll('.year-marker').forEach((m, j) => m.classList.toggle('active', i === j));
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
