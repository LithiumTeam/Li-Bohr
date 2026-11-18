const form = document.getElementById("atom-form");
const canvas = document.getElementById("atom-canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const captionText = document.getElementById("caption-text");
let atomUrl = null;

const SHELL_CAPACITIES = [2, 8, 18, 32, 50, 72];
const GOLDEN = 2.399963;
const STAR_SEED = 1337;
const STAR_COUNT = 90;

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

function drawBackground(cx, cy, half) {
    ctx.fillStyle = "#0c1226";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const rand = mulberry32(STAR_SEED);
    ctx.fillStyle = "#cdd8ff";
    for (let i = 0; i < STAR_COUNT; i++) {
        ctx.globalAlpha = 0.1 + rand() * 0.4;
        ctx.beginPath();
        ctx.arc(rand() * canvas.width, rand() * canvas.height, 0.4 + rand() * 1.1, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    const vignette = ctx.createRadialGradient(cx, cy, half * 0.55, cx, cy, half * 0.98);
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(2, 6, 18, 0.55)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawOrbit(cx, cy, r) {
    ctx.save();
    ctx.strokeStyle = "rgba(45, 212, 191, 0.14)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(94, 234, 212, 0.6)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#2dd4bf";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

function drawElectron(cx, cy, orbitR, angle) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = 2.5;
    for (let k = 0; k < 10; k++) {
        const from = angle + 0.8 - (k + 1) * 0.08;
        const to = angle + 0.8 - k * 0.08;
        ctx.strokeStyle = "rgba(34, 211, 238, " + (0.05 + (k / 10) * 0.3).toFixed(2) + ")";
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, from, to);
        ctx.stroke();
    }
    const x = cx + orbitR * Math.cos(angle);
    const y = cy + orbitR * Math.sin(angle);
    const grad = ctx.createRadialGradient(x - 4, y - 5, 1, x, y, 11);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.45, "#a5f3fc");
    grad.addColorStop(1, "#22d3ee");
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 18;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawSphere(x, y, r, inner, outer, glow) {
    ctx.save();
    ctx.shadowColor = glow;
    ctx.shadowBlur = 10;
    const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.15, x, y, r);
    grad.addColorStop(0, inner);
    grad.addColorStop(1, outer);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawAtom(protons, neutrons, electrons) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const half = Math.min(cx, cy);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(cx, cy, half);

    const shells = fillShells(electrons);
    const nucleons = protons + neutrons;

    const nucleusR = nucleons > 0 ? Math.min(half * 0.34, 34 + Math.sqrt(nucleons) * 6) : 0;
    const orbitStart = nucleusR + 56;
    const orbitGap = shells.length > 1 ? (half - 52 - orbitStart) / (shells.length - 1) : 0;

    shells.forEach((_, i) => drawOrbit(cx, cy, orbitStart + i * orbitGap));

    shells.forEach((count, i) => {
        const radius = orbitStart + i * orbitGap;
        const offset = -Math.PI / 2 + i * 0.4;
        for (let j = 0; j < count; j++) {
            drawElectron(cx, cy, radius, offset + (j / count) * Math.PI * 2);
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
            if (isProton) drawSphere(x, y, particleR, "#ffffff", "#b9c4dc", "rgba(232, 238, 252, 0.8)");
            else drawSphere(x, y, particleR, "#9db1d6", "#3e4c6b", "rgba(70, 90, 140, 0.9)");
        }
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const neutrons = Math.max(0, parseInt(document.getElementById("neutrons").value, 10) || 0);
    const protons = Math.max(0, parseInt(document.getElementById("protons").value, 10) || 0);
    const electrons = Math.max(0, parseInt(document.getElementById("electrons").value, 10) || 0);

    drawAtom(protons, neutrons, electrons);
    atomUrl = canvas.toDataURL("image/png");
    downloadBtn.disabled = false;
    captionText.textContent = `پروتون: ${protons} - نوترون: ${neutrons} - الکترون: ${electrons}`;
});

downloadBtn.addEventListener("click", () => {
    if (!atomUrl) return;
    const link = document.createElement("a");
    link.href = atomUrl;
    link.download = "li-bohr-atom.png";
    link.click();
});
