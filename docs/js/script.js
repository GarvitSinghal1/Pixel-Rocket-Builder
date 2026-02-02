/**
 * PIXEL ROCKET DOCS - Premium Interactive Subsystems
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c PIXEL ROCKET BUILDER - PREMIUM COMMAND CENTER ACTIVATED ", "background: #000; color: #00ffff; font-weight: bold; border: 2px solid #00ffff; padding: 10px;");

    // 1. DYNAMIC STARFIELD
    const starfield = document.getElementById('starfield');
    const createStars = () => {
        const starCount = 150;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2 + 1;
            const duration = Math.random() * 3 + 2;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.setProperty('--duration', `${duration}s`);
            starfield.appendChild(star);
        }
    };
    createStars();

    // 2. MATRIX TELEMETRY OVERLAY
    const matrixOverlay = document.getElementById('matrix-overlay');
    const equations = [
        "F_net = F_thrust + F_gravity + F_drag",
        "Q = 0.5 * rho * v^2",
        "T_stag = T_amb * (1 + 0.2 * M^2)",
        "v_c = sqrt(GM / r)",
        "a = F / m",
        "E = -GMm / 2a",
        "P_rad = epsilon * sigma * A * T^4",
        "Isp = F / (g * m_dot)",
        "Delta_v = Isp * g * ln(m0 / m1)"
    ];

    const createMatrixStream = () => {
        const stream = document.createElement('div');
        stream.style.position = 'absolute';
        stream.style.left = `${Math.random() * 100}%`;
        stream.style.top = `-10%`;
        stream.innerText = equations[Math.floor(Math.random() * equations.length)];

        const duration = Math.random() * 10 + 10;
        stream.style.transition = `all ${duration}s linear`;
        matrixOverlay.appendChild(stream);

        setTimeout(() => {
            stream.style.top = '110%';
        }, 100);

        setTimeout(() => {
            stream.remove();
        }, duration * 1000);
    };

    setInterval(createMatrixStream, 2000);

    // 3. SCROLL REVEAL (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .recruiter-note, .transmission-box, .eng-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // 4. MOUSE NEBULA EFFECT (Subtle GLOW)
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.body.style.backgroundImage = `
            radial-gradient(circle at ${x}% ${y}%, rgba(0, 163, 255, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0, 163, 255, 0.1) 0%, transparent 80%),
            radial-gradient(circle at 20% 80%, rgba(255, 0, 255, 0.05) 0%, transparent 50%)
        `;
    });

    // Simulated "Boot Sequence" in Console (Upgraded)
    const bootSequence = [
        "> INITIALIZING PIXEL_ROCKET_CORE_PRO...",
        "> LOADING NEWTONIAN_INTEGRATOR...",
        "> CALCULATING ISA_LAPSE_RATES...",
        "> SYNCING ORBITAL_STATE_VECTORS...",
        "> OPTIMIZING CANVAS_BUFFERING...",
        "> SYSTEMS_NOMINAL: MISSION_READY."
    ];

    bootSequence.forEach((step, index) => {
        setTimeout(() => {
            console.log(`%c${step}`, "color: #00ffff; font-family: monospace;");
        }, index * 200);
    });
});
