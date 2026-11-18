const form = document.getElementById("atom-form");
const canvas = document.getElementById("atom-canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const captionText = document.getElementById("caption-text");
const themeToggle = document.getElementById("theme-toggle");
let atomUrl = null;
let lastCounts = null;

const SHELL_CAPACITIES = [2, 8, 18, 32, 50, 72];
const GOLDEN = 2.399963;
const STAR_SEED = 1337;
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
    ["Er", "Erbium", "اربیم"],
    ["Tm", "Thulium", "تولیم"],
    ["Yb", "Ytterbium", "ایتربیم"],
    ["Lu", "Lutetium", "لوتتیم"],
    ["Hf", "Hafnium", "هافنیم"],
    ["Ta", "Tantalum", "تانتال"],
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
    ["U", "Uranium", "اورانیم"],
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
    ["Bh", "Bohrium", "بوریم"],
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
        bg: "#0a0512",
        stars: { count: 90, color: "#d9c7ff", min: 0.12, range: 0.38 },
        vignette: "rgba(0, 0, 0, 0.5)",
        orbitWide: "rgba(155, 80, 222, 0.16)",
        orbitCore: "rgba(179, 102, 255, 0.75)",
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
    for (const cap of SHELL_CAPACITIES) {
        if (remaining <= 0) break;
        const filled = Math.min(cap, remaining);
        shells.push(filled);
        remaining -= filled;
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

function drawElectron(cx, cy, orbitR, angle, pal) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = 2.5;
    for (let k = 0; k < 10; k++) {
        const from = angle + 0.8 - (k + 1) * 0.08;
        const to = angle + 0.8 - k * 0.08;
        ctx.strokeStyle = "rgba(" + pal.trailRgb + ", " + (0.05 + (k / 10) * 0.3).toFixed(2) + ")";
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, from, to);
        ctx.stroke();
    }
    const x = cx + orbitR * Math.cos(angle);
    const y = cy + orbitR * Math.sin(angle);
    const grad = ctx.createRadialGradient(x - 4, y - 5, 1, x, y, 11);
    grad.addColorStop(0, pal.electron[0]);
    grad.addColorStop(0.45, pal.electron[1]);
    grad.addColorStop(1, pal.electron[2]);
    ctx.shadowColor = pal.electronGlow;
    ctx.shadowBlur = 18;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawSphere(x, y, r, colors, pal) {
    ctx.save();
    ctx.shadowColor = colors[2];
    ctx.shadowBlur = 10;
    const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.15, x, y, r);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
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
    ctx.font = 'bold 40px "Vazirmatn", sans-serif';
    ctx.fillStyle = pal.nameColor;
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.direction = "rtl";
    ctx.fillText(fa, canvas.width - 44, 40);
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

    const shells = fillShells(electrons);
    const nucleons = protons + neutrons;

    const nucleusR = nucleons > 0 ? Math.min(half * 0.34, 34 + Math.sqrt(nucleons) * 6) : 0;
    const orbitStart = nucleusR + 56;
    const orbitGap = shells.length > 1 ? (half - 52 - orbitStart) / (shells.length - 1) : 0;

    shells.forEach((_, i) => drawOrbit(cx, cy, orbitStart + i * orbitGap, pal));

    shells.forEach((count, i) => {
        const radius = orbitStart + i * orbitGap;
        const offset = -Math.PI / 2 + i * 0.4;
        for (let j = 0; j < count; j++) {
            drawElectron(cx, cy, radius, offset + (j / count) * Math.PI * 2, pal);
        }
    });

    if (nucleons > 0) {
        const rings = Math.ceil(Math.sqrt(nucleons));
        const particleR = Math.max(5, Math.min(15, nucleusR / (1.4 * rings)));
        const spread = (nucleusR - particleR) / Math.max(Math.sqrt(nucleons - 1), 1);

        for (let i = 0; i < nucleons; i++) {
            const angle = i * GOLDEN;
            const dist = i === 0 ? 0 : spread * Math.sqrt(i);
            const x = cx + dist * Math.cos(angle);
            const y = cy + dist * Math.sin(angle);
            const isProton = protons > 0 &&
                Math.floor((i + 0.5) * protons / nucleons) > Math.floor(i * protons / nucleons);
            drawSphere(x, y, particleR, isProton ? pal.proton : pal.neutron, pal);
        }
    }

    drawAtomName(protons, neutrons, pal);
}

async function render() {
    if (!lastCounts) return;
    if (document.fonts && document.fonts.load) await document.fonts.load('40px "Vazirmatn"');
    drawAtom(lastCounts.protons, lastCounts.neutrons, lastCounts.electrons, PALETTES[currentTheme()]);
    atomUrl = canvas.toDataURL("image/png");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const neutrons = Math.max(0, parseInt(document.getElementById("neutrons").value, 10) || 0);
    const protons = Math.max(0, parseInt(document.getElementById("protons").value, 10) || 0);
    const electrons = Math.max(0, parseInt(document.getElementById("electrons").value, 10) || 0);

    lastCounts = { protons, neutrons, electrons };
    render();
    downloadBtn.disabled = false;
    captionText.textContent = `پروتون: ${protons} - نوترون: ${neutrons} - الکترون: ${electrons}`;
});

themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("li-bohr-theme", next);
    themeToggle.setAttribute("aria-checked", String(next === "dark"));
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
