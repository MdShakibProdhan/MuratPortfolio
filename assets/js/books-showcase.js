/**
 * 3D Interactive Books Showcase (Three.js)
 * Ported from VengeanceUI BooksShowcase for Nexus Advisory
 */

(function () {
  const DEFAULT_BOOKS = [
    {
      id: 'book-1',
      title: 'Where Expertise Meets Execution',
      author: 'Murat O. Ulupinar',
      year: '2026',
      stars: 5,
      desc: 'The definitive blueprint for high-growth enterprise leaders. Actionable frameworks to translate ambitious boardroom strategy into operational reality and double sustainable revenue.',
      edge: '#eee4cf',
      backBg: '#0B2B28',
      backInk: '255,255,255',
      spineBg: '#071F1D',
      spineInk: '#2FBF9F',
      spineFont: '700 38px Inter, sans-serif',
      chapters: [
        'Strategic Alignment & Clear Vision',
        'Operational Friction Points',
        'Scaling Without Diluting Quality',
        'Executive Decision Frameworks',
        'Building Resilient Revenue Streams',
        'Case Studies in Enterprise Agility'
      ]
    },
    {
      id: 'book-2',
      title: 'The Modern Advisory Edge',
      author: 'Nexus Strategy Lab',
      year: '2025',
      stars: 5,
      desc: 'Why conventional consultancy decks fail and how embedded, hands-on advisory delivers compound returns. A guide to agile operational transformation.',
      edge: '#e8dec7',
      backBg: '#123B36',
      backInk: '255,255,255',
      spineBg: '#0B2B28',
      spineInk: '#FFFFFF',
      spineFont: '700 38px Inter, sans-serif',
      chapters: [
        'Rethinking Traditional Consulting',
        'High-Touch vs. High-Volume',
        'Streamlined Intake & Fast Wins',
        'Confidential Growth Architecture',
        'Risk Mitigation & Market Entry',
        'The Next Decade of Advisory'
      ]
    },
    {
      id: 'book-3',
      title: 'Venture & Capital Dynamics',
      author: 'Elena Rostova & M. Ulupinar',
      year: '2025',
      stars: 5,
      desc: 'Navigating volatile market cycles, cross-border expansion, and flexible engagement models to build generational commercial strength.',
      edge: '#f1ebd8',
      backBg: '#17211F',
      backInk: '255,255,255',
      spineBg: '#0D1413',
      spineInk: '#2FBF9F',
      spineFont: '700 38px Inter, sans-serif',
      chapters: [
        'Global Market Landscape',
        'Capital Efficiency Metrics',
        'Structuring Flexible Retainers',
        'International Expansion Playbook',
        'Mergers, Divestitures & Synergy',
        'Executive Governance'
      ]
    },
    {
      id: 'book-4',
      title: 'Operational Excellence at Scale',
      author: 'Nexus Advisory Press',
      year: '2024',
      stars: 4,
      desc: 'How leading technology and advisory firms streamline complex delivery pipelines, eliminate redundant overhead, and unlock exponential capacity.',
      edge: '#eee4cf',
      backBg: '#1D2A3A',
      backInk: '255,255,255',
      spineBg: '#111A24',
      spineInk: '#68B5FF',
      spineFont: '700 38px Inter, sans-serif',
      chapters: [
        'Foundations of Scale',
        'Process Optimization',
        'Technology Integration',
        'Talent & Leadership Retention',
        'Sustained Performance KPIs',
        'The Execution Imperative'
      ]
    }
  ];

  class Spring {
    constructor(v, k = 120, d = 14) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      this.k = k;
      this.d = d;
    }
    set(v) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      return this;
    }
    update(dt) {
      const a = this.k * (this.t - this.v) - this.d * this.vel;
      this.vel += a * dt;
      this.v += this.vel * dt;
      return this.v;
    }
  }

  function mkCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function drawSpaced(x, text, cx, y, ls) {
    const prev = x.textAlign;
    x.textAlign = 'left';
    const chars = [...text];
    let tot = 0;
    const ws = chars.map((ch) => {
      const w = x.measureText(ch).width;
      tot += w;
      return w;
    });
    tot += ls * (chars.length - 1);
    let px = cx - tot / 2;
    chars.forEach((ch, i) => {
      x.fillText(ch, px, y);
      px += ws[i] + ls;
    });
    x.textAlign = prev;
  }

  function rr(x, px, py, w, h, r) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }

  function initBooksShowcase() {
    const root = document.getElementById('books-showcase');
    if (!root) return;

    const canvasEl = root.querySelector('.books-canvas');
    const openBtn = root.querySelector('.books-open-pill');
    const closeBtn = root.querySelector('.books-close-btn');
    const dpEl = root.querySelector('.books-detail-panel');
    const prevBtn = root.querySelector('.books-prev-btn');
    const nextBtn = root.querySelector('.books-next-btn');

    if (!canvasEl || typeof THREE === 'undefined') {
      console.warn('BooksShowcase: Canvas or Three.js missing');
      return;
    }

    const books = DEFAULT_BOOKS;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice = RM || window.matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !lowPowerDevice, alpha: true });
    } catch (err) {
      console.warn('BooksShowcase: WebGL initialization failed', err);
      return;
    }

    const dims = { w: root.offsetWidth || 1000, h: root.offsetHeight || 650 };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1 : 1.5));
    if (THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
    }
    renderer.shadowMap.enabled = !lowPowerDevice;
    if (THREE.PCFShadowMap) renderer.shadowMap.type = THREE.PCFShadowMap;
    const ANISO = renderer.capabilities ? renderer.capabilities.getMaxAnisotropy() : 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, dims.w / dims.h, 0.1, 100);
    camera.position.set(0, 0.1, 9.6);

    function envBlob(x, cx, cy, r, rgb, a) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(cx, cy, r, 0, 6.2832);
      x.fill();
    }

    (function buildEnv() {
      const c = mkCanvas(512, 256),
        x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#1d3e3a');
      g.addColorStop(0.55, '#0b2b28');
      g.addColorStop(1, '#051413');
      x.fillStyle = g;
      x.fillRect(0, 0, 512, 256);
      envBlob(x, 140, 66, 95, '255,255,255', 0.95);
      envBlob(x, 405, 84, 55, '47,191,159', 0.55);
      envBlob(x, 256, 150, 120, '47,191,159', 0.28);
      const tx = new THREE.CanvasTexture(c);
      tx.mapping = THREE.EquirectangularReflectionMapping;
      if (THREE.PMREMGenerator) {
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromEquirectangular(tx).texture;
        tx.dispose();
        pmrem.dispose();
      }
    })();

    const hemi = new THREE.HemisphereLight(0xb4e8df, 0x051413, 0.38);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3.5, 5, 6);
    key.castShadow = !lowPowerDevice;
    if (key.shadow) {
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.bias = -0.0004;
    }
    scene.add(key);

    const fillLight = new THREE.DirectionalLight(0xa5dfd4, 0.25);
    fillLight.position.set(-4, 1, 4);
    scene.add(fillLight);

    const rim = new THREE.DirectionalLight(0x2fbf9f, 0.4);
    rim.position.set(-2, 3, -5);
    scene.add(rim);

    const bookRoot = new THREE.Group();
    scene.add(bookRoot);

    function tex(c) {
      const t = new THREE.CanvasTexture(c);
      if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = ANISO;
      return t;
    }

    function noiseTexture(base, amp, scratches) {
      const s = 256,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      const img = x.createImageData(s, s),
        d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = base + (Math.random() - 0.5) * 2 * amp;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      if (scratches) {
        x.strokeStyle = 'rgba(200,200,200,.25)';
        x.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          x.beginPath();
          const y = Math.random() * s;
          x.moveTo(0, y);
          x.lineTo(s, y + (Math.random() - 0.5) * 22);
          x.stroke();
        }
      }
      return new THREE.CanvasTexture(c);
    }
    const laminateBump = noiseTexture(128, 10, true);

    const clothBump = (function () {
      const s = 128,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      x.fillStyle = '#808080';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < s; i += 2) {
        x.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.22)';
        x.fillRect(i, 0, 1, s);
        x.fillRect(0, i, s, 1);
      }
      return new THREE.CanvasTexture(c);
    })();

    function striationTexture(vertical) {
      const s = 512,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      x.fillStyle = '#ece4d2';
      x.fillRect(0, 0, s, s);
      let p = 0;
      while (p < s) {
        const w = 1 + Math.random() * 2.4,
          tone = Math.random();
        x.fillStyle =
          tone < 0.12 ? 'rgba(140,125,95,.5)' : tone < 0.5 ? 'rgba(255,255,252,.55)' : 'rgba(190,178,150,.45)';
        if (vertical) x.fillRect(p, 0, w, s);
        else x.fillRect(0, p, s, w);
        p += w + 0.6 + Math.random() * 1.6;
      }
      for (let i = 0; i < 2600; i++) {
        x.fillStyle = 'rgba(120,108,84,' + (Math.random() * 0.1).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
      }
      return tex(c);
    }
    const striV = striationTexture(true);
    const striH = striationTexture(false);

    const endpaperTex = (function () {
      const s = 512,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      x.fillStyle = '#f3edde';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < 1400; i++) {
        x.fillStyle = 'rgba(120,105,70,' + (0.04 + Math.random() * 0.08).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
      }
      const g = x.createLinearGradient(0, 0, s, 0);
      g.addColorStop(0, 'rgba(0,0,0,.07)');
      g.addColorStop(0.12, 'rgba(0,0,0,0)');
      g.addColorStop(0.88, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,.07)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return tex(c);
    })();

    const blobTex = (function () {
      const s = 256,
        c = mkCanvas(s, s),
        x = c.getContext('2d');
      const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(0,0,0,.85)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    })();

    function paintDefaultFront(x, w, h, o) {
      const g = x.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, o.bg);
      g.addColorStop(1, '#051413');
      x.fillStyle = g;
      x.fillRect(0, 0, w, h);

      x.fillStyle = 'rgba(47,191,159,0.08)';
      x.beginPath();
      x.arc(w * 0.8, h * 0.2, 350, 0, Math.PI * 2);
      x.fill();

      x.strokeStyle = 'rgba(47,191,159,0.35)';
      x.lineWidth = 4;
      x.strokeRect(50, 50, w - 100, h - 100);

      x.fillStyle = '#2FBF9F';
      x.font = '700 24px Inter, sans-serif';
      x.textAlign = 'center';
      x.fillText('NEXUS ADVISORY EXECUTIVE SERIES', w / 2, 130);

      x.fillStyle = '#FFFFFF';
      x.font = '700 68px Georgia, serif';
      const words = o.title.split(' ');
      let line = '';
      const lines = [];
      words.forEach((word) => {
        const test = line ? line + ' ' + word : word;
        if (x.measureText(test).width > w * 0.78 && line) {
          lines.push(line);
          line = word;
        } else line = test;
      });
      if (line) lines.push(line);

      const startY = h * 0.44 - ((lines.length - 1) * 80) / 2;
      lines.forEach((l, i) => x.fillText(l, w / 2, startY + i * 80));

      x.fillStyle = 'rgba(255,255,255,0.85)';
      x.font = '500 36px Inter, sans-serif';
      x.fillText(o.author, w / 2, startY + lines.length * 80 + 75);

      x.fillStyle = '#2FBF9F';
      x.fillRect(w / 2 - 40, h - 140, 80, 5);
    }

    function paintBack(x, w, h, o) {
      x.fillStyle = o.backBg;
      x.fillRect(0, 0, w, h);
      const ink = o.backInk;
      x.fillStyle = 'rgba(' + ink + ',.5)';
      rr(x, 150, 190, w - 460, 28, 14);
      x.fill();
      for (let i = 0; i < 9; i++) {
        const lw = i === 8 ? w - 560 : w - 300 - Math.random() * 180;
        x.fillStyle = 'rgba(' + ink + ',.2)';
        rr(x, 150, 300 + i * 56, lw, 15, 7);
        x.fill();
      }
      x.fillStyle = 'rgba(' + ink + ',.45)';
      x.beginPath();
      x.arc(178, h - 186, 26, 0, 6.2832);
      x.fill();
      x.fillStyle = '#fff';
      rr(x, w - 330, h - 262, 236, 152, 8);
      x.fill();
      x.fillStyle = '#111';
      let bx = w - 310;
      while (bx < w - 118) {
        const bw = 2 + Math.random() * 6;
        if (Math.random() > 0.42) x.fillRect(bx, h - 242, bw, 96);
        bx += bw + 2 + Math.random() * 4;
      }
      x.font = '500 21px Arial';
      x.textAlign = 'center';
      x.fillText('9 781234 567890', w - 212, h - 124);
      x.textAlign = 'left';
    }

    function paintSpine(x, w, h, o) {
      x.fillStyle = o.spineBg;
      x.fillRect(0, 0, w, h);
      x.save();
      x.translate(w / 2, h / 2);
      x.rotate(Math.PI / 2);
      x.fillStyle = o.spineInk;
      x.font = o.spineFont;
      drawSpaced(x, o.title.toUpperCase(), -h * 0.1, 15, 6);
      x.globalAlpha = 0.85;
      x.font = '600 25px Inter, sans-serif';
      drawSpaced(x, o.author.toUpperCase(), h * 0.325, 9, 4);
      x.globalAlpha = 1;
      x.restore();
      x.fillStyle = o.spineInk;
      x.globalAlpha = 0.6;
      x.fillRect(w / 2 - 26, 92, 52, 3);
      x.fillRect(w / 2 - 26, h - 95, 52, 3);
      x.globalAlpha = 1;
    }

    function trimToWidth(x, text, maxW) {
      if (x.measureText(text).width <= maxW) return text;
      let t = text;
      while (t.length > 1 && x.measureText(t + '...').width > maxW) t = t.slice(0, -1);
      return t + '...';
    }

    function makeIndexPageTex(chapters) {
      const w = 1024,
        h = 1536,
        c = mkCanvas(w, h),
        x = c.getContext('2d');
      x.fillStyle = '#f4efdf';
      x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(130,110,80,0.07)';
      for (let i = 0; i < 1600; i++) x.fillRect(Math.random() * w, Math.random() * h, 1.1, 1.1);
      x.fillStyle = '#0B2B28';
      x.textAlign = 'center';
      x.font = '700 80px Georgia, serif';
      x.fillText('INDEX & OVERVIEW', w / 2, 190);
      x.globalAlpha = 0.4;
      x.fillStyle = '#2FBF9F';
      x.fillRect(220, 225, w - 440, 4);
      x.globalAlpha = 1;

      const list = chapters && chapters.length ? chapters : [
        'Strategic Foundations',
        'Market Entry & Planning',
        'Operational Execution',
        'Capital & Resource Allocation',
        'Measurable Outcomes',
        'Executive Summary'
      ];
      x.textAlign = 'left';
      x.font = '500 44px Georgia, serif';
      let y = 320;
      for (let i = 0; i < list.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        const pageNo = String(12 + i * 18).padStart(3, ' ');
        const left = n + '. ' + trimToWidth(x, list[i], 640);
        x.fillStyle = '#17211F';
        x.fillText(left, 150, y);
        x.textAlign = 'right';
        x.fillStyle = '#2FBF9F';
        x.fillText(pageNo, w - 150, y);
        x.textAlign = 'left';
        x.globalAlpha = 0.22;
        x.fillRect(150, y + 16, w - 300, 2);
        x.globalAlpha = 1;
        y += 114;
      }
      return tex(c);
    }

    const N = books.length;
    const VISIBLE = Math.min(3, N);

    const W = 1.42,
      H = 2.14,
      T = 0.34,
      CT = 0.032,
      OV = 0.05;
    const PAGE_N = lowPowerDevice ? 5 : 8,
      BACK_PAGE_N = lowPowerDevice ? 3 : 4,
      PW = W - 0.02,
      PH = H - 0.02;
    const BLOCK_D = 0.245,
      BLOCK_Z = -0.0205,
      PIVOT_Z = T / 2 + CT / 2,
      BPIVOT_Z = -(T / 2 + CT / 2),
      HINGE_OVERLAP = 0.05;

    const coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
    const blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
    const pageGeo = new THREE.PlaneGeometry(PW, PH);
    const spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
    const hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
    const blobGeo = new THREE.PlaneGeometry(1, 1);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    function std(o) {
      return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.02 }, o));
    }

    const paperFlat = std({ color: 0xf2ecdd, roughness: 0.95, envMapIntensity: 0.2 });
    const striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    const striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    const endpaperMat = std({ map: endpaperTex, roughness: 0.9, envMapIntensity: 0.25 });
    const pageMats = [0xf4eee0, 0xf1ebdb, 0xf6f0e3].map((c) =>
      std({ color: c, roughness: 0.92, envMapIntensity: 0.22, side: THREE.DoubleSide }),
    );

    const bookInstances = [];
    const hitMeshes = [];

    function buildBook(cfg, index) {
      const rootG = new THREE.Group();
      const floatG = new THREE.Group();
      rootG.add(floatG);
      bookRoot.add(rootG);

      const indexPageMat = std({ map: makeIndexPageTex(cfg.chapters), roughness: 0.92, envMapIntensity: 0.2, side: THREE.DoubleSide });

      const edgeColor = cfg.edge || '#eee4cf';
      const mEdge = std({ color: edgeColor, bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.68, envMapIntensity: 0.3 });
      const mFront = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.54, envMapIntensity: 0.28 });
      const mBack = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.58, envMapIntensity: 0.26 });
      const mSpine = std({ bumpMap: clothBump, bumpScale: 0.006, roughness: 0.78, envMapIntensity: 0.22 });

      const cF = mkCanvas(1024, 1536);
      paintDefaultFront(cF.getContext('2d'), 1024, 1536, { title: cfg.title, author: cfg.author, bg: cfg.spineBg || '#0B2B28' });
      mFront.map = tex(cF);

      const cB = mkCanvas(1024, 1536);
      paintBack(cB.getContext('2d'), 1024, 1536, { backBg: cfg.backBg || '#0B2B28', backInk: cfg.backInk || '255,255,255' });
      mBack.map = tex(cB);

      const cS = mkCanvas(220, 1536);
      paintSpine(cS.getContext('2d'), 220, 1536, {
        spineBg: cfg.spineBg || '#071F1D',
        spineInk: cfg.spineInk || '#2FBF9F',
        spineFont: cfg.spineFont || '700 38px Inter, sans-serif',
        title: cfg.title,
        author: cfg.author,
      });
      mSpine.map = tex(cS);

      const backPivot = new THREE.Group();
      backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
      const backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
      backMesh.position.x = (W + OV) / 2;
      backMesh.castShadow = backMesh.receiveShadow = !lowPowerDevice;
      backPivot.add(backMesh);
      floatG.add(backPivot);

      const pivot = new THREE.Group();
      pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
      const frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
      frontMesh.position.x = (W + OV) / 2;
      frontMesh.castShadow = frontMesh.receiveShadow = !lowPowerDevice;
      pivot.add(frontMesh);
      floatG.add(pivot);

      const spine = new THREE.Mesh(spineGeo, mSpine);
      spine.position.set(-W / 2 - 0.013, 0, 0);
      spine.castShadow = !lowPowerDevice;
      floatG.add(spine);

      const block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
      block.position.set(-0.0075, 0, BLOCK_Z);
      block.castShadow = block.receiveShadow = !lowPowerDevice;
      floatG.add(block);

      const pages = [],
        pageF = [];
      for (let i = 0; i < PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, 0.166 - i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, i === 0 ? indexPageMat : pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        floatG.add(pp);
        pages.push(pp);
        pageF.push(0.3 * Math.pow(1 - i / PAGE_N, 2.6));
      }

      const pagesB = [],
        pageFB = [];
      for (let i = 0; i < BACK_PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, -0.166 + i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        floatG.add(pp);
        pagesB.push(pp);
        pageFB.push(0.3 * Math.pow(1 - i / BACK_PAGE_N, 2.6));
      }

      const blob = new THREE.Mesh(
        blobGeo,
        new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.45, depthWrite: false }),
      );
      blob.scale.set(3.1, 3.9, 1);
      blob.position.set(0.1, -0.3, -0.85);
      blob.renderOrder = -5;
      rootG.add(blob);

      const hit = new THREE.Mesh(hitGeo, hitMat);
      floatG.add(hit);

      const springs = {
        px: new Spring(0, 17, 6.8),
        py: new Spring(0, 17, 6.8),
        pz: new Spring(0, 17, 6.8),
        rx: new Spring(0, 17, 6.8),
        ry: new Spring(0, 17, 6.8),
        rz: new Spring(0, 17, 6.8),
        sc: new Spring(1, 17, 6.8),
        tiltX: new Spring(0, 120, 13),
        tiltY: new Spring(0, 120, 13),
        lift: new Spring(0, 120, 13),
        cover: new Spring(0, 90, 12),
        coverB: new Spring(0, 90, 12),
        drag: new Spring(0, 160, 16),
      };

      const b = {
        cfg,
        index,
        root: rootG,
        float: floatG,
        pivot,
        backPivot,
        frontMesh,
        spine,
        block,
        pages,
        pageF,
        pagesB,
        pageFB,
        hit,
        springs,
        phase: Math.random() * 6.28,
        slotScale: 1,
        hitEdge: null,
        scr: { x: 0, y: 0 },
        orbY: 0,
        orbYv: 0,
        orbPhase: 'idle',
        orbTarget: 0,
        orbXs: new Spring(0, 60, 12),
        exit: null,
      };
      bookInstances.push(b);
      return b;
    }

    books.forEach(buildBook);
    const bookByHit = (m) => bookInstances.find((b) => b.hit === m);

    // Floating leaf particles
    const leaves = {
      items: [],
      anchor: null,
      activate(book) {
        this.anchor = book;
        this.items.forEach((l) => {
          l.kick.set(-l.hx + (Math.random() - 0.5) * 0.6, -l.hy + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.5);
          l.s.t = l.size;
          l.mesh.visible = true;
        });
      },
      deactivate() {
        this.items.forEach((l) => {
          l.s.t = 0;
        });
      },
      push(dx, dy) {
        if (!this.anchor) return;
        this.items.forEach((l) => {
          l.kick.x += dx * 2.4 * Math.random();
          l.kick.y += -dy * 2.4 * Math.random();
        });
      },
      update(dt, t) {
        if (!this.anchor) return;
        const ap = this.anchor.root.position;
        const w = RM ? 0.15 : 1;
        this.items.forEach((l) => {
          l.kick.multiplyScalar(Math.exp(-1.15 * dt));
          l.mesh.position.set(
            ap.x + l.hx + Math.sin(t * l.sp + l.ph) * 0.4 * w + l.kick.x,
            ap.y + l.hy + Math.cos(t * l.sp * 0.83 + l.ph * 1.3) * 0.3 * w + l.kick.y,
            ap.z * 0.4 + l.hz + l.kick.z,
          );
          l.mesh.rotation.x += l.rv.x * dt * (0.3 + w);
          l.mesh.rotation.y += l.rv.y * dt * (0.3 + w);
          l.mesh.rotation.z += l.rv.z * dt * (0.3 + w);
          const s = l.s.update(dt);
          l.mesh.scale.setScalar(Math.max(s, 0.0001));
          if (l.s.t === 0 && s < 0.01) l.mesh.visible = false;
        });
      },
    };

    (function buildLeaves() {
      const shape = new THREE.Shape();
      shape.moveTo(0, -0.5);
      shape.bezierCurveTo(0.3, -0.28, 0.3, 0.22, 0, 0.55);
      shape.bezierCurveTo(-0.3, 0.22, -0.3, -0.28, 0, -0.5);
      const geo = new THREE.ShapeGeometry(shape, 10);
      const cols = [0x2fbf9f, 0x1a7e68, 0x5eead4, 0x134e48];
      for (let i = 0; i < 16; i++) {
        const mat = std({ color: cols[i % 4], roughness: 0.55, envMapIntensity: 0.3, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.visible = false;
        bookRoot.add(mesh);
        let hx = (Math.random() - 0.5) * 4.6;
        if (i % 5 === 0) hx += 2.8 * Math.sign(hx || 1);
        leaves.items.push({
          mesh,
          hx,
          hy: (Math.random() - 0.5) * 3.2,
          hz: -0.5 + Math.random() * 1.5,
          sp: 0.25 + Math.random() * 0.5,
          ph: Math.random() * 6.28,
          rv: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
          kick: new THREE.Vector3(),
          size: 0.14 + Math.random() * 0.16,
          s: new Spring(0, 60, 10),
        });
      }
    })();

    // State machine
    const state = {
      mode: 'hero',
      selected: null,
      hovered: null,
      pillLock: null,
      kbIndex: -1,
    };

    const SLOTS = { hero: [], detail: null, portrait: false };

    function computeSlots() {
      const a = dims.w / Math.max(1, dims.h);
      const portrait = a < 0.92;
      const fit = portrait ? clamp(a / 1.08, 0.4, 0.76) : clamp(a / 1.62, 0.55, 1);
      bookRoot.scale.setScalar(fit);
      bookRoot.position.y = -(1 - fit) * 0.28;
      SLOTS.portrait = portrait;

      SLOTS.hero = SLOTS.portrait
        ? [
          { p: [-1.36, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.25 },
          { p: [0.2, -0.22, 0.6], r: [-0.05, -0.1, -0.035], s: 1.35 },
          { p: [1.62, -0.62, -0.34], r: [-0.045, -0.42, -0.17], s: 1.25 },
        ]
        : [
          { p: [-2.05, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.22 },
          { p: [0.25, -0.36, 0.6], r: [-0.05, -0.1, -0.035], s: 1.32 },
          { p: [2.35, -0.64, -0.34], r: [-0.045, -0.42, -0.17], s: 1.22 },
        ];

      if (SLOTS.portrait) {
        SLOTS.detail = { p: [0, 0.45, 0.8], r: [-0.02, -0.4, 0.06], s: 0.72 };
      } else {
        SLOTS.detail = { p: [-1.68, 0.0, 0.85], r: [0.02, -0.44, 0.08], s: 1.06 };
      }
    }

    function setTargets(b, slot) {
      const s = b.springs;
      s.px.t = slot.p[0];
      s.py.t = slot.p[1];
      s.pz.t = slot.p[2];
      s.rx.t = slot.r[0];
      s.ry.t = slot.r[1];
      s.rz.t = slot.r[2];
      b.slotScale = slot.s;
    }

    const EASE = {
      hold: () => 1,
      outQuad: (t) => 1 - (1 - t) * (1 - t),
      outQuint: (t) => 1 - Math.pow(1 - t, 5),
      inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    };
    const LIFT = 0.38,
      CLEAR = 4.2;

    function playY(b, segs) {
      b.exit = { segs, i: 0, t: 0 };
    }
    function stepY(b, dt) {
      const ex = b.exit,
        s = b.springs;
      ex.t += dt;
      let seg = ex.segs[ex.i];
      while (seg && ex.t >= seg.d) {
        ex.t -= seg.d;
        s.py.v = seg.to;
        if (seg.end) seg.end();
        seg = ex.segs[++ex.i];
      }
      if (seg) s.py.v = seg.from + (seg.to - seg.from) * seg.ease(ex.t / seg.d);
      else b.exit = null;
      s.py.t = s.py.v;
      s.py.vel = 0;
    }
    function pinInPlace(b) {
      const s = b.springs;
      s.px.t = s.px.v;
      s.pz.t = s.pz.v;
      s.rx.t = s.rx.v;
      s.ry.t = s.ry.v;
      s.rz.t = s.rz.v;
    }
    function sendOut(b, i, delay) {
      const y0 = SLOTS.hero[i].p[1],
        here = b.springs.py.v,
        apex = y0 + LIFT;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 0.28, from: here, to: apex, ease: EASE.outQuad },
        { d: 0.9, from: apex, to: y0 - CLEAR, ease: EASE.inOutSine, end: () => { b.root.visible = false; } },
      ]);
    }
    function bringBack(b, i, delay) {
      const here = b.springs.py.v;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 1.0, from: here, to: SLOTS.hero[i].p[1], ease: EASE.outQuint },
      ]);
    }

    function windowIndices(start, total, count) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push((start + i) % total);
      return arr;
    }
    let carouselStart = 0;
    let currentWindow = windowIndices(0, N, VISIBLE);
    let carouselBusy = false;

    function rebuildHitMeshes() {
      hitMeshes.length = 0;
      currentWindow.forEach((bi) => hitMeshes.push(bookInstances[bi].hit));
    }

    function applyMode() {
      if (state.mode === 'hero' || state.mode === 'closing') {
        currentWindow.forEach((bi, i) => {
          const slot = SLOTS.hero[i];
          if (slot) setTargets(bookInstances[bi], slot);
        });
      } else if (state.selected) {
        setTargets(state.selected, SLOTS.detail);
      }
    }

    function shiftCarousel(dir) {
      if (carouselBusy || state.mode !== 'hero' || N <= VISIBLE) return;
      carouselBusy = true;
      const outgoing = currentWindow;
      carouselStart = (((carouselStart + dir) % N) + N) % N;
      const incoming = windowIndices(carouselStart, N, VISIBLE);

      const toHide = outgoing.filter((bi) => !incoming.includes(bi));
      toHide.forEach((bi) => {
        const oldIdx = outgoing.indexOf(bi);
        const slot = SLOTS.hero[oldIdx];
        const b = bookInstances[bi];
        if (slot) b.springs.px.t = slot.p[0] - dir * 6.5;
      });
      setTimeout(() => toHide.forEach((bi) => { bookInstances[bi].root.visible = false; }), 650);

      incoming.forEach((bi, i) => {
        const slot = SLOTS.hero[i];
        if (!slot) return;
        const b = bookInstances[bi];
        const alreadyOnScreen = outgoing.includes(bi);
        b.root.visible = true;
        if (!alreadyOnScreen) {
          b.springs.px.set(slot.p[0] + dir * 6.5);
          b.springs.py.set(slot.p[1]);
          b.springs.pz.set(slot.p[2]);
          b.springs.rx.set(slot.r[0]);
          b.springs.ry.set(slot.r[1]);
          b.springs.rz.set(slot.r[2]);
          b.springs.sc.set(slot.s * 0.92);
        }
        setTargets(b, slot);
      });

      currentWindow = incoming;
      rebuildHitMeshes();
      setTimeout(() => { carouselBusy = false; }, 700);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => shiftCarousel(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => shiftCarousel(1));

    const camX = new Spring(0, 13, 6.5),
      camY = new Spring(0.1, 13, 6.5),
      camZ = new Spring(9.6, 13, 6.5);
    const lookX = new Spring(0, 13, 6.5),
      lookY = new Spring(0, 13, 6.5);
    const parX = new Spring(0, 60, 10),
      parY = new Spring(0, 60, 10);

    function camTo(mode) {
      if (mode === 'detail') {
        camX.t = SLOTS.portrait ? 0 : -0.25;
        camZ.t = SLOTS.portrait ? 10.4 : 9.6;
        lookX.t = SLOTS.portrait ? 0 : -0.35;
        lookY.t = SLOTS.portrait ? (SLOTS.portrait ? 0.35 : 0) : 0.15;
      } else {
        camX.t = 0;
        camZ.t = 9.6;
        lookX.t = 0;
        lookY.t = 0;
      }
    }

    const pillX = new Spring(0, 190, 23),
      pillY = new Spring(0, 190, 23);
    let pillOn = false;

    function showPill() {
      if (!openBtn) return;
      openBtn.classList.add('is-visible');
      pillOn = true;
    }
    function hidePill() {
      if (!openBtn) return;
      openBtn.classList.remove('is-visible');
      pillOn = false;
    }

    function updateDetailContent(cfg) {
      if (!dpEl || !cfg) return;
      const titleEl = dpEl.querySelector('.books-detail-title');
      const descEl = dpEl.querySelector('.books-detail-desc');
      const yearEl = dpEl.querySelector('.books-detail-year');
      const starsEl = dpEl.querySelector('.books-detail-stars');

      if (titleEl) titleEl.textContent = cfg.title;
      if (descEl) descEl.textContent = cfg.desc;
      if (yearEl) yearEl.textContent = cfg.year;

      if (starsEl) {
        starsEl.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          star.setAttribute('viewBox', '0 0 24 24');
          star.setAttribute('class', 'books-star-icon' + (i < cfg.stars ? ' active' : ''));
          star.innerHTML = '<path d="M12 2.6l2.8 6 6.6.6-5 4.4 1.5 6.5L12 16.7 6.1 20.1l1.5-6.5-5-4.4 6.6-.6z"/>';
          starsEl.appendChild(star);
        }
      }
    }

    function open(book) {
      if (state.mode !== 'hero' || !book) return;
      state.mode = 'opening';
      root.setAttribute('data-state', 'opening');
      state.selected = book;
      state.pillLock = null;
      state.kbIndex = -1;
      hidePill();
      book.exit = null;
      updateDetailContent(book.cfg);
      computeSlots();

      let out = 0;
      currentWindow.forEach((bi, i) => {
        const b = bookInstances[bi];
        if (b !== book) sendOut(b, i, out++ * 0.08);
      });

      setTimeout(() => {
        if (state.mode !== 'opening' && state.mode !== 'detail') return;
        book.orbY = RM ? 0 : -6.2832;
        book.orbYv = RM ? 0 : 3;
        book.orbPhase = 'return';
        book.orbTarget = 0;
        book.orbXs.set(0);
        applyMode();
        camTo('detail');
      }, 760);

      setTimeout(() => leaves.activate(book), 1000);

      setTimeout(() => {
        if (state.mode === 'opening') {
          currentWindow.forEach((bi) => {
            const sibling = bookInstances[bi];
            if (sibling !== book) {
              sibling.exit = null;
              sibling.root.visible = false;
            }
          });
          state.mode = 'detail';
          root.setAttribute('data-state', 'detail');
        }
      }, 1400);
    }

    function close() {
      if (state.mode !== 'detail') return;
      state.mode = 'closing';
      root.setAttribute('data-state', 'closing');
      leaves.deactivate();
      orbit.drag = false;
      const b = state.selected;
      if (b) {
        b.orbTarget = Math.round(b.orbY / 6.2832) * 6.2832 + 6.2832;
        b.orbYv = Math.max(b.orbYv, 3);
        b.orbPhase = 'return';
        b.orbXs.t = 0;
      }
      setTimeout(() => {
        applyMode();
        camTo('hero');
        let back = 0;
        currentWindow.forEach((bi, i) => {
          const bk = bookInstances[bi];
          if (bk !== b) bringBack(bk, i, 0.85 + back++ * 0.1);
        });
      }, 250);

      setTimeout(() => {
        if (state.mode === 'closing') {
          state.mode = 'hero';
          root.setAttribute('data-state', 'hero');
          state.selected = null;
        }
      }, 1600);
    }

    if (closeBtn) closeBtn.addEventListener('click', close);

    const ptr = {
      ndcX: 0,
      ndcY: 0,
      cx: 0,
      cy: 0,
      lastX: 0,
      lastY: 0,
      down: false,
      downX: 0,
      downY: 0,
      moved: 0,
      t0: 0,
      type: 'mouse',
      seen: false,
      id: null,
    };
    const isTouch = () => ptr.type === 'touch' || ptr.type === 'pen';
    let dragBook = null,
      rayBook = null;
    const orbit = { drag: false, dxAcc: 0, dyAcc: 0 };
    const ray = new THREE.Raycaster();
    const tmpV = new THREE.Vector3();

    canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());

    canvasEl.addEventListener('pointerleave', () => {
      rayBook = null;
      state.pillLock = null;
      state.kbIndex = -1;
      hidePill();
    });

    const localXY = (e) => {
      const r = root.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    function castRay() {
      ray.setFromCamera({ x: ptr.ndcX, y: ptr.ndcY }, camera);
      const hits = ray.intersectObjects(hitMeshes, false);
      if (hits.length) {
        rayBook = bookByHit(hits[0].object);
        const lp = rayBook.hit.worldToLocal(hits[0].point.clone());
        rayBook.hitEdge = clamp((lp.x / 0.9) * 0.5 + 0.5, 0, 1);
      } else {
        rayBook = null;
      }
    }

    canvasEl.addEventListener('pointermove', (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      const { x: cx, y: cy } = localXY(e);
      const dxN = (cx - ptr.lastX) / dims.w;
      const dyN = (cy - ptr.lastY) / dims.h;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      if (state.mode === 'detail') leaves.push(dxN, dyN);
      if (ptr.down && dragBook) {
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
        dragBook.springs.drag.t = clamp(((ptr.downX - cx) / dims.w) * 3.4, 0, 1.0);
      }
      if (ptr.down && orbit.drag) {
        orbit.dxAcc += dxN;
        orbit.dyAcc += dyN;
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
      }
    });

    canvasEl.addEventListener('pointerdown', (e) => {
      if (ptr.id !== null) return;
      ptr.id = e.pointerId;
      const { x: cx, y: cy } = localXY(e);
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      castRay();
      if (state.mode === 'hero' && rayBook) {
        ptr.down = true;
        dragBook = rayBook;
        ptr.downX = cx;
        ptr.downY = cy;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvasEl.setPointerCapture(e.pointerId);
      } else if (state.mode === 'detail' && rayBook === state.selected) {
        ptr.down = true;
        orbit.drag = true;
        orbit.dxAcc = 0;
        orbit.dyAcc = 0;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvasEl.setPointerCapture(e.pointerId);
      } else {
        state.pillLock = null;
        state.kbIndex = -1;
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      orbit.drag = false;
      if (dragBook) {
        const slop = isTouch() ? 26 : 14;
        const limit = isTouch() ? 650 : 450;
        const wasDrag = ptr.moved > slop;
        dragBook.springs.drag.t = 0;
        if (!wasDrag && state.mode === 'hero' && performance.now() - ptr.t0 < limit) open(dragBook);
        dragBook = null;
      }
      ptr.down = false;
      if (isTouch()) rayBook = null;
    });

    const onKeydown = (e) => {
      if (e.key === 'Escape') close();
      if (state.mode !== 'hero') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.shiftKey) {
          shiftCarousel(e.key === 'ArrowRight' ? 1 : -1);
        } else {
          const d = e.key === 'ArrowRight' ? 1 : -1;
          state.kbIndex = ((state.kbIndex < 0 ? (d > 0 ? -1 : 1) : state.kbIndex) + d + VISIBLE) % VISIBLE;
          state.pillLock = null;
        }
        e.preventDefault();
      }
      if (e.key === 'Enter' && state.hovered) open(state.hovered);
    };
    root.addEventListener('keydown', onKeydown);

    // Frame loop
    const idle = RM ? 0 : 1;
    const DETAIL_OPEN_ANGLE = 0.88;
    const DETAIL_OPEN_SWAY = 0.035;

    function screenPos(b) {
      b.root.getWorldPosition(tmpV).project(camera);
      b.scr.x = (tmpV.x * 0.5 + 0.5) * dims.w;
      b.scr.y = (-tmpV.y * 0.5 + 0.5) * dims.h;
    }

    function tickBook(b, dt, t) {
      const s = b.springs;
      const isHov = state.hovered === b;
      const inDetail = state.mode === 'detail' && state.selected === b;
      const orbitActive = state.selected === b && state.mode !== 'hero';

      let activity = 0;
      if (orbitActive) {
        if (orbit.drag && inDetail) {
          const step = orbit.dxAcc * 6.5;
          orbit.dxAcc = 0;
          b.orbY += step;
          b.orbYv = clamp(b.orbYv * 0.5 + (step / Math.max(dt, 0.001)) * 0.5, -14, 14);
          b.orbXs.t = clamp(b.orbXs.t + orbit.dyAcc * 3.2, -0.55, 0.55);
          orbit.dyAcc = 0;
          b.orbPhase = 'drag';
        } else {
          b.orbXs.t = 0;
          if (b.orbPhase === 'drag') {
            if (Math.abs(b.orbYv) > 0.6) b.orbPhase = 'spin';
            else {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          }
          if (b.orbPhase === 'spin') {
            b.orbYv *= Math.exp(-0.9 * dt);
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbYv) < 0.5) {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          } else if (b.orbPhase === 'return') {
            const acc = 16 * (b.orbTarget - b.orbY) - 8 * b.orbYv;
            b.orbYv += acc * dt;
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbTarget - b.orbY) < 0.002 && Math.abs(b.orbYv) < 0.01) {
              b.orbY = b.orbTarget;
              b.orbYv = 0;
              b.orbPhase = 'idle';
            }
          }
        }
        const distRest = Math.abs(b.orbY - Math.round(b.orbY / 6.2832) * 6.2832);
        activity = clamp(Math.abs(b.orbYv) * 1.5 + (orbit.drag ? 1 : 0) + distRest * 2, 0, 1);
      }
      b.orbXs.update(dt);

      let coverBase = 0;
      if (inDetail) coverBase = DETAIL_OPEN_ANGLE + Math.sin(t * 0.8 + b.phase) * DETAIL_OPEN_SWAY * idle;
      const fan = orbitActive ? clamp(b.orbYv * 0.16, 0, 0.75) : 0;
      const fanB = orbitActive ? clamp(-b.orbYv * 0.16, 0, 0.75) : 0;
      let coverBBase = 0;
      if (inDetail) coverBBase = 0.2 + Math.sin(t * 0.8 + b.phase + 1.7) * 0.02 * idle;

      if (isHov && ptr.seen && state.mode === 'hero') {
        const dxN = (ptr.cx - b.scr.x) / (dims.w * 0.25);
        const dyN = (b.scr.y - ptr.cy) / (dims.h * 0.3);
        s.tiltY.t = clamp(dxN * 0.28, -0.15, 0.15);
        s.tiltX.t = clamp(-dyN * 0.1, -0.09, 0.1);
        s.lift.t = 0.3;
        coverBase = 0;
      } else {
        s.tiltY.t = 0;
        s.tiltX.t = 0;
        s.lift.t = 0;
      }
      s.cover.t = coverBase + fan;
      s.coverB.t = coverBBase + fanB;
      s.sc.t = b.slotScale * (isHov && state.mode === 'hero' ? 1.09 : 1);

      s.px.update(dt);
      if (b.exit) stepY(b, dt);
      else s.py.update(dt);
      s.pz.update(dt);
      s.rx.update(dt);
      s.ry.update(dt);
      s.rz.update(dt);
      s.sc.update(dt);
      s.tiltX.update(dt);
      s.tiltY.update(dt);
      s.lift.update(dt);
      s.cover.update(dt);
      s.coverB.update(dt);
      s.drag.update(dt);

      b.float.position.y = Math.sin(t * 0.7 + b.phase) * 0.035 * idle;
      b.float.rotation.z = Math.sin(t * 0.9 + b.phase * 1.7) * 0.006 * idle;

      b.root.position.set(s.px.v, s.py.v, s.pz.v + s.lift.v);
      const sway = inDetail ? Math.sin(t * 0.45 + b.phase) * 0.035 * idle * (1 - activity) : 0;
      const swing = clamp(-s.px.vel * 0.12, -0.5, 0.5);
      b.root.rotation.set(s.rx.v + s.tiltX.v + b.orbXs.v, s.ry.v + s.tiltY.v + b.orbY + sway + swing, s.rz.v);
      b.root.scale.setScalar(Math.max(s.sc.v, 0.001));

      const ang = Math.max(0, s.cover.v + s.drag.v);
      const angB = Math.max(0, s.coverB.v);
      b.pivot.rotation.y = -ang;
      b.pivot.position.z = PIVOT_Z + ang * 0.022;
      b.backPivot.rotation.y = angB;
      b.backPivot.position.z = BPIVOT_Z - angB * 0.022;
      b.spine.rotation.y = -ang * 0.16 + angB * 0.16;
      b.block.scale.z = 1 - (ang + angB) * 0.05;
      b.block.position.z = BLOCK_Z - ang * 0.006 + angB * 0.006;
      for (let i = 0; i < PAGE_N; i++) {
        const fl = idle * Math.sin(t * 1.15 + b.phase + i * 0.6) * 0.006 * (1 - i / PAGE_N);
        b.pages[i].rotation.y = -(ang * b.pageF[i] + Math.max(0, fl));
      }
      for (let i = 0; i < BACK_PAGE_N; i++) b.pagesB[i].rotation.y = angB * b.pageFB[i];
    }

    let rafId = 0;
    let isInViewport = true;
    let lastTime = performance.now();

    function animate(timestamp) {
      if (!isInViewport || document.hidden) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
      const now = timestamp || performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now * 0.001;

      if (ptr.seen && (ptr.type === 'mouse' || ptr.down)) castRay();
      let hov = null;
      if (state.mode === 'hero') {
        const kb = state.kbIndex >= 0 ? bookInstances[currentWindow[state.kbIndex]] : null;
        hov = rayBook || state.pillLock || kb || null;
      } else if (state.mode === 'detail') {
        hov = rayBook === state.selected ? rayBook : null;
      }
      state.hovered = hov;
      let cur = 'default';
      if (state.mode === 'hero' && hov) cur = 'pointer';
      else if (state.mode === 'detail' && state.selected) {
        if (orbit.drag) cur = 'grabbing';
        else if (rayBook === state.selected) cur = 'grab';
      }
      canvasEl.style.cursor = cur;

      bookInstances.forEach((b) => screenPos(b));
      bookInstances.forEach((b) => tickBook(b, dt, t));
      leaves.update(dt, t);

      parX.t = RM ? 0 : ptr.ndcX * 0.02;
      parY.t = RM ? 0 : -ptr.ndcY * 0.012;
      bookRoot.rotation.y = parX.update(dt);
      bookRoot.rotation.x = parY.update(dt);

      camera.position.set(camX.update(dt), camY.update(dt), camZ.update(dt));
      camera.lookAt(lookX.update(dt), lookY.update(dt), 0);

      if (state.mode === 'hero' && state.hovered && ptr.seen && !isTouch() && !(ptr.down && ptr.moved > 14)) {
        const tx = ptr.cx,
          ty = ptr.cy + 34;
        if (!pillOn) {
          pillX.set(tx);
          pillY.set(ty);
        }
        pillX.t = tx;
        pillY.t = ty;
        if (openBtn) {
          openBtn.style.left = pillX.update(dt) + 'px';
          openBtn.style.top = pillY.update(dt) + 'px';
        }
        if (!pillOn) showPill();
      } else {
        hidePill();
      }

      renderer.render(scene, camera);
    }

    function resumeAnimation() {
      if (!rafId && isInViewport && !document.hidden) {
        lastTime = performance.now();
        animate();
      }
    }

    function relayout() {
      const r = root.getBoundingClientRect();
      dims.w = Math.max(1, Math.round(r.width));
      dims.h = Math.max(1, Math.round(r.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1 : 1.5));
      renderer.setSize(dims.w, dims.h);
      camera.aspect = dims.w / dims.h;
      camera.updateProjectionMatrix();
      computeSlots();
      applyMode();
      camTo(state.mode === 'detail' || state.mode === 'opening' ? 'detail' : 'hero');
    }

    relayout();
    currentWindow.forEach((bi, i) => {
      const b = bookInstances[bi];
      const slot = SLOTS.hero[i];
      const s = b.springs;
      s.px.set(slot.p[0]);
      s.py.set(slot.p[1] - 3.9);
      s.pz.set(slot.p[2]);
      s.rx.set(slot.r[0]);
      s.ry.set(slot.r[1]);
      s.rz.set(slot.r[2] + 0.35 * (i === 1 ? -1 : Math.sign(slot.p[0])));
      s.sc.set(slot.s);
      b.slotScale = slot.s;
      setTimeout(() => setTargets(b, slot), 240 + i * 150);
    });
    bookInstances.forEach((b, idx) => {
      if (!currentWindow.includes(idx)) b.root.visible = false;
    });
    rebuildHitMeshes();
    camTo('hero');
    animate();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) resumeAnimation();
        else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '160px' },
    );
    visibilityObserver.observe(root);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        resumeAnimation();
      }
    });

    window.addEventListener('resize', relayout);
    const ro = new ResizeObserver(relayout);
    ro.observe(root);
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBooksShowcase);
  } else {
    initBooksShowcase();
  }
})();
