const form = document.getElementById("atom-form");
const canvas = document.getElementById("atom-canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("download-btn");
const caption = document.getElementById("atom-caption");
let atomUrl = null;

const SHELL_CAPACITIES = [2, 8, 18, 32, 50, 72];

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

function drawGlowCircle(x, y, r, colors, glowColor, glowBlur) {
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowBlur;
    const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawAtom(protons, neutrons, electrons) {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const half = Math.min(cx, cy);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, w, h);

    const shells = fillShells(electrons);
    const nucleons = protons + neutrons;

    const nucleusR = nucleons > 0 ? Math.min(half * 0.34, 34 + Math.sqrt(nucleons) * 6) : 0;
    const orbitStart = nucleusR + 52;
    const orbitGap = shells.length > 0 ? (half - 48 - orbitStart) / Math.max(shells.length - 1, 1) : 0;

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(157, 78, 221, 0.8)";
    ctx.shadowColor = "#9d4edd";
    ctx.shadowBlur = 16;
    shells.forEach((_, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, orbitStart + i * orbitGap, 0, Math.PI * 2);
        ctx.stroke();
    });
    ctx.restore();

    shells.forEach((count, i) => {
        const radius = orbitStart + i * orbitGap;
        const offset = -Math.PI / 2 + i * 0.4;
        for (let j = 0; j < count; j++) {
            const angle = offset + (j / count) * Math.PI * 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            drawGlowCircle(x, y, 11, ["#ffffff", "#b388ff"], "#9d4edd", 22);
        }
    });

    if (nucleons > 0) {
        const rings = Math.ceil(Math.sqrt(nucleons));
        const particleR = Math.max(5, Math.min(15, nucleusR / (1.4 * rings)));
        const spread = (nucleusR - particleR) / Math.max(Math.sqrt(nucleons - 1), 1);
        const golden = 2.399963;

        for (let i = 0; i < nucleons; i++) {
            const angle = i * golden;
            const dist = i === 0 ? 0 : spread * Math.sqrt(i);
            const x = cx + dist * Math.cos(angle);
            const y = cy + dist * Math.sin(angle);
            const isProton = protons === 0 ? false :
                Math.floor((i + 0.5) * protons / nucleons) > Math.floor(i * protons / nucleons);
            const colors = isProton ? ["#ffffff", "#b9b9d9"] : ["#8b5cf6", "#4c1d95"];
            drawGlowCircle(x, y, particleR, colors, isProton ? "#e0e0ff" : "#7c3aed", 14);
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
    caption.textContent = `پروتون: ${protons} - نوترون: ${neutrons} - الکترون: ${electrons}`;
});

downloadBtn.addEventListener("click", () => {
    if (!atomUrl) return;
    const link = document.createElement("a");
    link.href = atomUrl;
    link.download = "li-bohr-atom.png";
    link.click();
});
