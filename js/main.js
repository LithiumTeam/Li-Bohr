const form = document.getElementById("atom-form");
const canvas = document.getElementById("atom-canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const captionText = document.getElementById("caption-text");
const themeToggle = document.getElementById("theme-toggle");
const bigWarn = document.getElementById("big-warn");
const bigWarnYes = document.getElementById("big-warn-yes");
const bigWarnNo = document.getElementById("big-warn-no");
let atomUrl = null;
let lastCounts = null;
let pendingCounts = null;
let renderSeq = 0;

const SHELL_CAPACITIES = [2, 8, 18, 32, 50, 72];
const GOLDEN = 2.399963;
const STAR_SEED = 1337;
const BIG_LIMIT = 1000;
const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

const ELEMENTS = [
    null,
    ["H", "Hydrogen", "هیدروژن"],
    ["He", "Helium", "هلیوم"],
    ["Li", "Lithium", "لیتیوم"],
    ["Be", "Beryllium", "بریلیم"],
    ["B", "Boron", "بور"],
    ["C", "Carbon", "کربن"],
    ["N", "Nitrogen", "نیتروژن"],
    ["O", "Oxygen", "اکسیژن"],
    ["F", "Fluorine", "فلوئور"],
    ["Ne", "Neon", "نئون"],
    ["Na", "Sodium", "سدیم"],
    ["Mg", "Magnesium", "منیزیم"],
    ["Al", "Aluminium", "آلومینیم"],
    ["Si", "Silicon", "سیلیسیم"],
    ["P", "Phosphorus", "فسفر"],
    ["S", "Sulfur", "گوگرد"],
    ["Cl", "Chlorine", "کلر"],
    ["Ar", "Argon", "آرگون"],
    ["K", "Potassium", "پتاسیم"],
    ["Ca", "Calcium", "کلسیم"],
    ["Sc", "Scandium", "اسکاندیم"],
    ["Ti", "Titanium", "تیتانیم"],
    ["V", "Vanadium", "وانادیم"],
    ["Cr", "Chromium", "کروم"],
    ["Mn", "Manganese", "منگنز"],
    ["Fe", "Iron", "آهن"],
    ["Co", "Cobalt", "کبالت"],
    ["Ni", "Nickel", "نیکل"],
    ["Cu", "Copper", "مس"],
    ["Zn", "Zinc", "روی"],
    ["Ga", "Gallium", "گالیم"],
    ["Ge", "Germanium", "ژرمانیم"],
    ["As", "Arsenic", "آرسنیک"],
    ["Se", "Selenium", "سلنیم"],
    ["Br", "Bromine", "برم"],
    ["Kr", "Krypton", "کریپتون"],
    ["Rb", "Rubidium", "روبیدیم"],
    ["Sr", "Strontium", "استرانسیم"],
    ["Y", "Yttrium", "ایتریم"],
    ["Zr", "Zirconium", "زیرکونیم"],
    ["Nb", "Niobium", "نیوبیم"],
    ["Mo", "Molybdenum", "مولیبدن"],
    ["Tc", "Technetium", "تکنسیم"],
    ["Ru", "Ruthenium", "روتنیم"],
    ["Rh", "Rhodium", "رودیم"],
    ["Pd", "Palladium", "پالادیم"],
    ["Ag", "Silver", "نقره"],
    ["Cd", "Cadmium", "کادمیم"],
    ["In", "Indium", "ایندیم"],
    ["Sn", "Tin", "قلع"],
    ["Sb", "Antimony", "آنتیموان"],
    ["Te", "Tellurium", "تلوریم"],
    ["I", "Iodine", "ید"],
    ["Xe", "Xenon", "زنون"],
    ["Cs", "Caesium", "سزیم"],
    ["Ba", "Barium", "باریم"],
    ["La", "Lanthanum", "لانتان"],
    ["Ce", "Cerium", "سریم"],
    ["Pr", "Praseodymium", "پرازئودیمیم"],
    ["Nd", "Neodymium", "نئودیمیم"],
    ["Pm", "Promethium", "پرومتیم"],
    ["Sm", "Samarium", "ساماریم"],
    ["Eu", "Europium", "یوروپیم"],
    ["Gd", "Gadolinium", "گادولینیم"],
    ["Tb", "Terbium", "تربیم"],
    ["Dy", "Dysprosium", "دیسپروزیم"],
    ["Ho", "Holmium", "هولمیم"],
    ["Er", "Erbium", "اربیوم"],
    ["Tm", "Thulium", "تولیم"],
    ["Yb", "Ytterbium", "ایتربیم"],
    ["Lu", "Lutetium", "لوتتیم"],
    ["Hf", "Hafnium", "هافنیم"],
    ["Ta", "Tantalum", "تانتالیم"],
    ["W", "Tungsten", "تنگستن"],
    ["Re", "Rhenium", "رنیوم"],
    ["Os", "Osmium", "اسمیم"],
    ["Ir", "Iridium", "ایریدیم"],
    ["Pt", "Platinum", "پلاتین"],
    ["Au", "Gold", "طلا"],
    ["Hg", "Mercury", "جیوه"],
    ["Tl", "Thallium", "تالیم"],
    ["Pb", "Lead", "سرب"],
    ["Bi", "Bismuth", "بیسموت"],
    ["Po", "Polonium", "پولونیم"],
    ["At", "Astatine", "آستاتین"],
    ["Rn", "Radon", "رادون"],
    ["Fr", "Francium", "فرانسیم"],
    ["Ra", "Radium", "رادیم"],
    ["Ac", "Actinium", "اکتینیم"],
    ["Th", "Thorium", "توریم"],
    ["Pa", "Protactinium", "پروتاکتینیم"],
    ["U", "Uranium", "اورانیوم"],
    ["Np", "Neptunium", "نپتونیوم"],
    ["Pu", "Plutonium", "پلوتونیم"],
    ["Am", "Americium", "امریسیم"],
    ["Cm", "Curium", "کوریم"],
    ["Bk", "Berkelium", "برکلیم"],
    ["Cf", "Californium", "کالیفرنیم"],
    ["Es", "Einsteinium", "اینشتینیم"],
    ["Fm", "Fermium", "فرمیم"],
    ["Md", "Mendelevium", "مندلیفیم"],
    ["No", "Nobelium", "نوبلیم"],
    ["Lr", "Lawrencium", "لارنسیم"],
    ["Rf", "Rutherfordium", "رادرفوردیم"],
    ["Db", "Dubnium", "دوبنیم"],
    ["Sg", "Seaborgium", "سیبورگیم"],
    ["Bh", "Bohrium", "بوهریم"],
    ["Hs", "Hassium", "هاسیم"],
    ["Mt", "Meitnerium", "مایتنریم"],
    ["Ds", "Darmstadtium", "دارمشتادیم"],
    ["Rg", "Roentgenium", "رونتگنیم"],
    ["Cn", "Copernicium", "کوپرنیسیم"],
    ["Nh", "Nihonium", "نیهونیوم"],
    ["Fl", "Flerovium", "فلروویوم"],
    ["Mc", "Moscovium", "مسکوویم"],
    ["Lv", "Livermorium", "لیورموریوم"],
    ["Ts", "Tennessine", "تنسین"],
    ["Og", "Oganesson", "اوگانسون"],
];

const NEUTRAL_SHELLS = {
    1: [1],
    2: [2],
    3: [2,1],
    4: [2,2],
    5: [2,3],
    6: [2,4],
    7: [2,5],
    8: [2,6],
    9: [2,7],
    10: [2,8],
    11: [2,8,1],
    12: [2,8,2],
    13: [2,8,3],
    14: [2,8,4],
    15: [2,8,5],
    16: [2,8,6],
    17: [2,8,7],
    18: [2,8,8],
    19: [2,8,8,1],
    20: [2,8,8,2],
    21: [2,8,9,2],
    22: [2,8,10,2],
    23: [2,8,11,2],
    24: [2,8,13,1],
    25: [2,8,13,2],
    26: [2,8,14,2],
    27: [2,8,15,2],
    28: [2,8,16,2],
    29: [2,8,18,1],
    30: [2,8,18,2],
    31: [2,8,18,3],
    32: [2,8,18,4],
    33: [2,8,18,5],
    34: [2,8,18,6],
    35: [2,8,18,7],
    36: [2,8,18,8],
    37: [2,8,18,8,1],
    38: [2,8,18,8,2],
    39: [2,8,18,9,2],
    40: [2,8,18,10,2],
    41: [2,8,18,12,1],
    42: [2,8,18,13,1],
    43: [2,8,18,13,2],
    44: [2,8,18,15,1],
    45: [2,8,18,16,1],
    46: [2,8,18,18],
    47: [2,8,18,18,1],
    48: [2,8,18,18,2],
    49: [2,8,18,18,3],
    50: [2,8,18,18,4],
    51: [2,8,18,18,5],
    52: [2,8,18,18,6],
    53: [2,8,18,18,7],
    54: [2,8,18,18,8],
    55: [2,8,18,18,8,1],
    56: [2,8,18,18,8,2],
    57: [2,8,18,18,9,2],
    58: [2,8,18,19,9,2],
    59: [2,8,18,21,8,2],
    60: [2,8,18,22,8,2],
    61: [2,8,18,23,8,2],
    62: [2,8,18,24,8,2],
    63: [2,8,18,25,8,2],
    64: [2,8,18,25,9,2],
    65: [2,8,18,27,8,2],
    66: [2,8,18,28,8,2],
    67: [2,8,18,29,8,2],
    68: [2,8,18,30,8,2],
    69: [2,8,18,31,8,2],
    70: [2,8,18,32,8,2],
    71: [2,8,18,32,9,2],
    72: [2,8,18,32,10,2],
    73: [2,8,18,32,11,2],
    74: [2,8,18,32,12,2],
    75: [2,8,18,32,13,2],
    76: [2,8,18,32,14,2],
    77: [2,8,18,32,15,2],
    78: [2,8,18,32,17,1],
    79: [2,8,18,32,18,1],
    80: [2,8,18,32,18,2],
    81: [2,8,18,32,18,3],
    82: [2,8,18,32,18,4],
    83: [2,8,18,32,18,5],
    84: [2,8,18,32,18,6],
    85: [2,8,18,32,18,7],
    86: [2,8,18,32,18,8],
    87: [2,8,18,32,18,8,1],
    88: [2,8,18,32,18,8,2],
    89: [2,8,18,32,18,9,2],
    90: [2,8,18,32,18,10,2],
    91: [2,8,18,32,20,9,2],
    92: [2,8,18,32,21,9,2],
    93: [2,8,18,32,22,9,2],
    94: [2,8,18,32,24,8,2],
    95: [2,8,18,32,25,8,2],
    96: [2,8,18,32,25,9,2],
    97: [2,8,18,32,26,9,2],
    98: [2,8,18,32,28,8,2],
    99: [2,8,18,32,29,8,2],
    100: [2,8,18,32,30,8,2],
    101: [2,8,18,32,31,8,2],
    102: [2,8,18,32,32,8,2],
    103: [2,8,18,32,32,8,3],
    104: [2,8,18,32,32,10,2],
    105: [2,8,18,32,32,11,2],
    106: [2,8,18,32,32,12,2],
    107: [2,8,18,32,32,13,2],
    108: [2,8,18,32,32,14,2],
    109: [2,8,18,32,32,15,2],
    110: [2,8,18,32,32,16,2],
    111: [2,8,18,32,32,17,2],
    112: [2,8,18,32,32,18,2],
    113: [2,8,18,32,32,18,3],
    114: [2,8,18,32,32,18,4],
    115: [2,8,18,32,32,18,5],
    116: [2,8,18,32,32,18,6],
    117: [2,8,18,32,32,18,7],
    118: [2,8,18,32,32,18,8]
};
const PALETTES = {
    light: {
        bg: "#f6f4fc",
        stars: { count: 40, color: "#7c3aed", min: 0.04, range: 0.08 },
        vignette: "rgba(90, 70, 150, 0.08)",
        orbitWide: "rgba(124, 58, 237, 0.10)",
        orbitCore: "rgba(124, 58, 237, 0.55)",
        orbitGlow: "#7c3aed",
        electron: ["#ffffff", "#c4a5ff", "#7c3aed"],
        electronGlow: "#9d4edd",
        trailRgb: "124, 58, 237",
        proton: ["#ffffff", "#b9c4dc", "rgba(190, 180, 230, 0.8)"],
        neutron: ["#9db1d6", "#3e4c6b", "rgba(100, 120, 180, 0.8)"],
        nameColor: "#57409e",
    },
    dark: {
        bg: "#070410",
        stars: { count: 90, color: "#d9c7ff", min: 0.12, range: 0.38 },
        vignette: "rgba(0, 0, 0, 0.6)",
        orbitWide: "rgba(155, 80, 222, 0.16)",
        orbitCore: "rgba(179, 102, 255, 0.65)",
        orbitGlow: "#9d4edd",
        electron: ["#ffffff", "#c9a6ff", "#a855f7"],
        electronGlow: "#9d4edd",
        trailRgb: "168, 85, 247",
        proton: ["#ffffff", "#bfb3e8", "rgba(190, 170, 240, 0.8)"],
        neutron: ["#8f7fd0", "#3a3160", "rgba(90, 70, 150, 0.9)"],
        nameColor: "#e6dcff",
    },
};

function currentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function fillShells(total) {
    const shells = [];
    let remaining = total;
    let shellNo = 1;
    for (const cap of SHELL_CAPACITIES) {
        if (remaining <= 0) break;
        const filled = Math.min(cap, remaining);
        shells.push(filled);
        remaining -= filled;
        shellNo++;
    }
    while (remaining > 0) {
        const filled = Math.min(2 * shellNo * shellNo, remaining);
        shells.push(filled);
        remaining -= filled;
        shellNo++;
    }
    return shells;
}

function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), t | 1);
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function drawBackground(cx, cy, half, pal) {
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const rand = mulberry32(STAR_SEED);
    ctx.fillStyle = pal.stars.color;
    for (let i = 0; i < pal.stars.count; i++) {
        ctx.globalAlpha = pal.stars.min + rand() * pal.stars.range;
        ctx.beginPath();
        ctx.arc(rand() * canvas.width, rand() * canvas.height, 0.4 + rand() * 1.1, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    const vignette = ctx.createRadialGradient(cx, cy, half * 0.55, cx, cy, half * 0.98);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, pal.vignette);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawOrbit(cx, cy, r, pal) {
    ctx.save();
    ctx.strokeStyle = pal.orbitWide;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = pal.orbitCore;
    ctx.lineWidth = 2;
    ctx.shadowColor = pal.orbitGlow;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

const spriteCache = new Map();

function getSphereSprite(colors, r) {
    const key = "s" + colors[1] + "|" + Math.round(r * 100) / 100;
    let sprite = spriteCache.get(key);
    if (!sprite) {
        const pad = 12;
        const size = Math.max(2, Math.ceil(2 * r + 2 * pad));
        const off = document.createElement("canvas");
        off.width = size;
        off.height = size;
        const c2 = off.getContext("2d");
        c2.save();
        c2.shadowColor = colors[2];
        c2.shadowBlur = 10;
        const grad = c2.createRadialGradient(size / 2 - r * 0.35, size / 2 - r * 0.4, r * 0.15, size / 2, size / 2, r);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        c2.fillStyle = grad;
        c2.beginPath();
        c2.arc(size / 2, size / 2, r, 0, Math.PI * 2);
        c2.fill();
        c2.restore();
        sprite = { img: off, size };
        spriteCache.set(key, sprite);
        if (spriteCache.size > 128) spriteCache.clear();
    }
    return sprite;
}

function getElectronSprite(pal) {
    const key = "e" + pal.electron[1];
    let sprite = spriteCache.get(key);
    if (!sprite) {
        const r = 11;
        const pad = 20;
        const size = 2 * r + 2 * pad;
        const off = document.createElement("canvas");
        off.width = size;
        off.height = size;
        const c2 = off.getContext("2d");
        const c = size / 2;
        c2.save();
        c2.shadowColor = pal.electronGlow;
        c2.shadowBlur = 18;
        const grad = c2.createRadialGradient(c - 4, c - 5, 1, c, c, r);
        grad.addColorStop(0, pal.electron[0]);
        grad.addColorStop(0.45, pal.electron[1]);
        grad.addColorStop(1, pal.electron[2]);
        c2.fillStyle = grad;
        c2.beginPath();
        c2.arc(c, c, r, 0, Math.PI * 2);
        c2.fill();
        c2.restore();
        sprite = { img: off, size };
        spriteCache.set(key, sprite);
        if (spriteCache.size > 128) spriteCache.clear();
    }
    return sprite;
}

function drawElectrons(cx, cy, shells, orbitStart, orbitGap, electrons, pal) {
    const pos = [];
    shells.forEach((count, i) => {
        const radius = orbitStart + i * orbitGap;
        const offset = -Math.PI / 2 + i * 0.4;
        for (let j = 0; j < count; j++) {
            pos.push({ radius, angle: offset + (j / count) * Math.PI * 2 });
        }
    });
    const trailSegs = electrons > 5000 ? 0 : electrons > 1000 ? 2 : electrons > 200 ? 4 : 10;
    const seg = 0.8 / trailSegs;
    ctx.lineCap = "round";
    ctx.lineWidth = 2.5;
    for (let k = 0; k < trailSegs; k++) {
        ctx.beginPath();
        for (const el of pos) {
            const from = el.angle + 0.8 - (k + 1) * seg;
            const to = el.angle + 0.8 - k * seg;
            ctx.moveTo(cx + el.radius * Math.cos(from), cy + el.radius * Math.sin(from));
            ctx.arc(cx, cy, el.radius, from, to);
        }
        ctx.strokeStyle = "rgba(" + pal.trailRgb + ", " + (0.05 + (k / trailSegs) * 0.3).toFixed(2) + ")";
        ctx.stroke();
    }
    const sp = getElectronSprite(pal);
    for (const el of pos) {
        ctx.drawImage(sp.img, cx + el.radius * Math.cos(el.angle) - sp.size / 2, cy + el.radius * Math.sin(el.angle) - sp.size / 2);
    }
}

function toFaDigits(n) {
    return String(n).split("").map((d) => FA_DIGITS[Number(d)]).join("");
}

function drawAtomName(protons, neutrons, pal) {
    const element = ELEMENTS[protons];
    if (!element) return;
    const en = element[1] + (neutrons > 0 ? "-" + (protons + neutrons) : "");
    const fa = element[2] + (neutrons > 0 ? "-" + toFaDigits(protons + neutrons) : "");
    ctx.save();
    ctx.font = 'bold 32px "Vazirmatn", sans-serif';
    ctx.fillStyle = pal.nameColor;
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.direction = "rtl";
    ctx.fillText(fa, canvas.width - 44, 40);
    ctx.font = 'bold 32px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.direction = "ltr";
    ctx.fillText(en, 44, 40);
    ctx.restore();
}

function drawAtom(protons, neutrons, electrons, pal) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const half = Math.min(cx, cy);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(cx, cy, half, pal);

    const neutral = protons >= 1 && protons <= 118 && electrons === protons;
    const shells = neutral ? NEUTRAL_SHELLS[protons] : fillShells(electrons);
    const nucleons = protons + neutrons;

    const nucleusR = nucleons > 0 ? Math.min(half * 0.34, 34 + Math.sqrt(nucleons) * 6) : 0;
    const orbitStart = nucleusR + 56;
    const orbitGap = shells.length > 1 ? (half - 52 - orbitStart) / (shells.length - 1) : 0;

    shells.forEach((_, i) => drawOrbit(cx, cy, orbitStart + i * orbitGap, pal));

    drawElectrons(cx, cy, shells, orbitStart, orbitGap, electrons, pal);

    if (nucleons > 0) {
        const rings = Math.ceil(Math.sqrt(nucleons));
        const particleR = Math.max(5, Math.min(15, nucleusR / (1.4 * rings)));
        const spread = (nucleusR - particleR) / Math.max(Math.sqrt(nucleons - 1), 1);
        const pSprite = protons > 0 ? getSphereSprite(pal.proton, particleR) : null;
        const nSprite = getSphereSprite(pal.neutron, particleR);

        for (let i = 0; i < nucleons; i++) {
            const angle = i * GOLDEN;
            const dist = i === 0 ? 0 : spread * Math.sqrt(i);
            const x = cx + dist * Math.cos(angle);
            const y = cy + dist * Math.sin(angle);
            const isProton = protons > 0 &&
                Math.floor((i + 1) * protons / nucleons) > Math.floor(i * protons / nucleons);
            const sp = isProton ? pSprite : nSprite;
            ctx.drawImage(sp.img, x - sp.size / 2, y - sp.size / 2);
        }
    }

    drawAtomName(protons, neutrons, pal);
}

async function render() {
    if (!lastCounts) return;
    const seq = ++renderSeq;
    if (document.fonts && document.fonts.load) {
        await document.fonts.load('32px "Vazirmatn"');
        await document.fonts.load('bold 32px "JetBrains Mono"');
    }
    if (seq !== renderSeq) return;
    drawAtom(lastCounts.protons, lastCounts.neutrons, lastCounts.electrons, PALETTES[currentTheme()]);
    atomUrl = canvas.toDataURL("image/png");
}

function parseCount(value) {
    const n = parseInt(String(value).trim(), 10);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, n);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const neutrons = parseCount(document.getElementById("neutrons").value);
    const electrons = parseCount(document.getElementById("electrons").value);
    let protons = parseCount(document.getElementById("protons").value);
    if (protons === 0 && electrons >= 1 && electrons <= 118) {
        protons = electrons;
    }

    if (Math.max(protons, neutrons, electrons) > BIG_LIMIT) {
        pendingCounts = { protons, neutrons, electrons };
        bigWarn.hidden = false;
        return;
    }
    applyCounts(protons, neutrons, electrons);
});

function applyCounts(protons, neutrons, electrons) {
    bigWarn.hidden = true;
    pendingCounts = null;
    lastCounts = { protons, neutrons, electrons };
    render();
    downloadBtn.disabled = false;
    captionText.textContent = `پروتون: ${protons} - نوترون: ${neutrons} - الکترون: ${electrons}`;
}

bigWarnYes.addEventListener("click", () => {
    if (!pendingCounts) return;
    applyCounts(pendingCounts.protons, pendingCounts.neutrons, pendingCounts.electrons);
});

bigWarnNo.addEventListener("click", () => {
    pendingCounts = null;
    bigWarn.hidden = true;
});

themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("li-bohr-theme", next);
    render();
});

downloadBtn.addEventListener("click", () => {
    if (!atomUrl) return;
    const link = document.createElement("a");
    link.href = atomUrl;
    link.download = "li-bohr-atom.png";
    link.click();
});

render();
