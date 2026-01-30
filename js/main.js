/**
 * PIXEL ROCKET BUILDER - Main Game Controller
 * Ties everything together - modes, levels, launch simulation, audio
 */

const GAME = {
    currentMode: 'level', // 'level' or 'fun'
    currentLevel: 1,
    maxUnlockedLevel: 1,
    unlockedParts: [],

    // Animation
    animationFrame: null,
    lastTime: 0,

    // Launch visualization
    launchCtx: null,
    rocketY: 0,
    smokeParticles: [],
    stars: [],
    clouds: [],

    // Skip simulation flag
    skipRequested: false,

    // Store the actual rocket parts for rendering during flight
    launchParts: [],
    rocketBounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 }
};

// Level definitions
const LEVELS = [
    {
        id: 1,
        name: 'First Flight',
        description: 'Reach 1,000m altitude',
        targetAltitude: 1000,
        unlocksPartId: null
    },
    {
        id: 2,
        name: 'Higher Ground',
        description: 'Reach 5,000m altitude',
        targetAltitude: 5000,
        unlocksPartId: 'medium_tank'
    },
    {
        id: 3,
        name: 'Boost It',
        description: 'Reach 10,000m altitude',
        targetAltitude: 10000,
        unlocksPartId: 'booster'
    },
    {
        id: 4,
        name: 'Sky High',
        description: 'Reach 25,000m altitude',
        targetAltitude: 25000,
        unlocksPartId: 'large_tank'
    },
    {
        id: 5,
        name: 'Stratosphere',
        description: 'Reach 50,000m altitude',
        targetAltitude: 50000,
        unlocksPartId: 'heavy_lifter'
    },
    {
        id: 6,
        name: 'Edge of Space',
        description: 'Reach 80,000m altitude',
        targetAltitude: 80000,
        unlocksPartId: 'gimbal'
    },
    {
        id: 7,
        name: 'Karman Line',
        description: 'Reach 100,000m (space!)',
        targetAltitude: 100000,
        unlocksPartId: 'fairing'
    },
    {
        id: 8,
        name: 'Beyond',
        description: 'Reach 150,000m altitude',
        targetAltitude: 150000,
        unlocksPartId: 'reaction_wheel'
    },
    {
        id: 9,
        name: 'Low Orbit',
        description: 'Reach 250,000m altitude',
        targetAltitude: 250000,
        unlocksPartId: null
    },
    {
        id: 10,
        name: 'Orbital',
        description: 'Reach 400,000m altitude',
        targetAltitude: 400000,
        unlocksPartId: 'crew_capsule'
    }
];

/**
 * Initialize the game
 */
function initGame() {
    // Load saved progress
    loadProgress();

    // Initialize audio
    if (typeof initAudio === 'function') {
        initAudio();
    }

    // Initialize editor
    initEditor();

    // Setup button events
    setupGameEvents();

    // Generate stars for launch screen
    generateStars();

    // Initial stats update
    updateStats();

    console.log('🚀 Pixel Rocket Builder initialized!');
}

/**
 * Setup game event listeners
 */
function setupGameEvents() {
    // Mode buttons
    document.getElementById('btn-level-mode').addEventListener('click', () => {
        setGameMode('level');
        if (typeof playClickSound === 'function') playClickSound();
    });

    document.getElementById('btn-fun-mode').addEventListener('click', () => {
        setGameMode('fun');
        if (typeof playClickSound === 'function') playClickSound();
    });

    // Header actions
    document.getElementById('btn-save').addEventListener('click', saveRocket);
    document.getElementById('btn-load').addEventListener('click', loadRocket);
    document.getElementById('btn-clear').addEventListener('click', () => {
        clearEditor();
        if (typeof playClickSound === 'function') playClickSound();
    });

    // Launch button
    document.getElementById('btn-launch').addEventListener('click', startLaunch);

    // Launch controls
    document.getElementById('throttle-slider').addEventListener('input', (e) => {
        const value = e.target.value / 100;
        setThrottle(value);
        document.getElementById('throttle-value').textContent = `${e.target.value}%`;
        if (typeof updateThrustSound === 'function') updateThrustSound(value);
    });

    document.getElementById('btn-stage').addEventListener('click', () => {
        if (triggerStage()) {
            if (typeof playStagingSound === 'function') playStagingSound();
        }
    });

    // SKIP button - fast forward simulation
    document.getElementById('btn-skip').addEventListener('click', skipLaunch);

    document.getElementById('btn-abort').addEventListener('click', abortLaunch);

    // Results buttons
    document.getElementById('btn-retry').addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        showScreen('editor');
        setTimeout(startLaunch, 100);
    });

    document.getElementById('btn-edit').addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        showScreen('editor');
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        if (GAME.currentLevel < LEVELS.length) {
            GAME.currentLevel++;
            saveProgress();
        }
        showScreen('editor');
        clearEditor();
    });

    // Level selection
    document.getElementById('btn-close-levels').addEventListener('click', () => {
        document.getElementById('level-modal').classList.remove('active');
    });
}

/**
 * Set game mode
 */
function setGameMode(mode) {
    GAME.currentMode = mode;

    // Update UI
    document.getElementById('btn-level-mode').classList.toggle('active', mode === 'level');
    document.getElementById('btn-fun-mode').classList.toggle('active', mode === 'fun');

    // Refresh parts panel
    renderPartsPanel(EDITOR.currentCategory);
}

/**
 * Show a specific screen
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`${screenId}-screen`).classList.add('active');

    // Show/hide stats bar
    document.getElementById('stats-bar').style.display =
        screenId === 'editor' ? 'flex' : 'none';
}

/**
 * Start the launch sequence
 */
function startLaunch() {
    // Get only connected parts
    const connectedParts = typeof getValidRocketParts === 'function'
        ? getValidRocketParts()
        : EDITOR.placedParts;

    if (connectedParts.length === 0) {
        alert('Add some parts to your rocket first! Make sure they are connected.');
        return;
    }

    const twr = calculateTWR(connectedParts);
    if (twr < 1) {
        alert('Your rocket needs more thrust! TWR must be greater than 1.');
        return;
    }

    // Resume audio context on user interaction
    if (typeof resumeAudio === 'function') resumeAudio();

    // Switch to launch screen
    showScreen('launch');
    GAME.skipRequested = false;

    // Play ignition sound
    if (typeof playIgnitionSound === 'function') playIgnitionSound();

    // Store the rocket parts for rendering during flight
    GAME.launchParts = connectedParts.map(p => ({
        ...p,
        partDef: getPartById(p.partId)
    }));

    // Calculate rocket bounding box
    if (GAME.launchParts.length > 0) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        GAME.launchParts.forEach(p => {
            const w = p.partDef.width * TILE_SIZE;
            const h = p.partDef.height * TILE_SIZE;
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x + w);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y + h);
        });

        GAME.rocketBounds = {
            minX, maxX, minY, maxY,
            width: maxX - minX,
            height: maxY - minY,
            centerX: (minX + maxX) / 2
        };
    }

    // Initialize physics with CONNECTED parts only
    startSimulation(connectedParts);

    // Start thrust sound
    setTimeout(() => {
        if (typeof startThrustSound === 'function') startThrustSound();
    }, 500);

    // Setup launch canvas
    const canvas = document.getElementById('launch-canvas');
    GAME.launchCtx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Reset visual state
    GAME.rocketY = canvas.height - 150;
    GAME.smokeParticles = [];
    GAME.clouds = generateClouds(canvas.width, canvas.height);

    // Reset throttle slider
    document.getElementById('throttle-slider').value = 100;
    document.getElementById('throttle-value').textContent = '100%';

    // Start animation loop
    GAME.lastTime = performance.now();
    animateLaunch();
}

/**
 * Skip the launch simulation - fast forward to results
 */
function skipLaunch() {
    if (!PHYSICS.isRunning) return;

    GAME.skipRequested = true;

    // Stop thrust sound
    if (typeof stopThrustSound === 'function') stopThrustSound();

    // Fast forward physics until rocket lands or reaches max altitude and descends
    const maxIterations = 100000; // Prevent infinite loop
    let iterations = 0;
    let wasAscending = PHYSICS.velocity > 0;

    while (PHYSICS.isRunning && iterations < maxIterations) {
        // Simulate at 0.1 second steps for speed
        physicsStep(0.1);
        iterations++;

        // Track if we've peaked and are descending
        if (PHYSICS.velocity < 0 && wasAscending) {
            wasAscending = false;
        }

        // Once descending and hit ground, stop
        if (PHYSICS.altitude <= 0 && !wasAscending) {
            PHYSICS.isRunning = false;
            break;
        }
    }

    // Show results immediately
    showResults();
}

/**
 * Abort the launch
 */
function abortLaunch() {
    stopSimulation();
    cancelAnimationFrame(GAME.animationFrame);

    // Stop sounds
    if (typeof stopThrustSound === 'function') stopThrustSound();

    showScreen('editor');
}

/**
 * Generate stars for background
 */
function generateStars() {
    GAME.stars = [];
    for (let i = 0; i < 200; i++) {
        GAME.stars.push({
            x: Math.random(),
            y: Math.random() * 0.7,
            size: Math.random() * 2 + 1,
            brightness: Math.random() * 0.5 + 0.3
        });
    }
}

/**
 * Generate clouds
 */
function generateClouds(width, height) {
    const clouds = [];
    for (let i = 0; i < 10; i++) {
        clouds.push({
            x: Math.random() * width,
            y: height * 0.5 + Math.random() * height * 0.3,
            width: 80 + Math.random() * 120,
            height: 30 + Math.random() * 40,
            speed: 0.2 + Math.random() * 0.3
        });
    }
    return clouds;
}

/**
 * Animation loop for launch
 */
function animateLaunch() {
    if (GAME.skipRequested) return; // Skip was pressed

    const now = performance.now();
    const dt = (now - GAME.lastTime) / 1000;
    GAME.lastTime = now;

    // Physics step (10 substeps for stability)
    for (let i = 0; i < 10; i++) {
        physicsStep(dt / 10);
    }

    // Update thrust sound based on fuel
    if (PHYSICS.fuel <= 0 && typeof stopThrustSound === 'function') {
        stopThrustSound();
    }

    // Update flight data display
    updateFlightData();

    // Render launch scene
    renderLaunchScene(dt);

    // Check if simulation ended
    if (!PHYSICS.isRunning) {
        // Stop sounds
        if (typeof stopThrustSound === 'function') stopThrustSound();

        // Play appropriate sound
        if (PHYSICS.velocity < -10) {
            if (typeof playExplosionSound === 'function') playExplosionSound();
        }

        showResults();
        return;
    }

    GAME.animationFrame = requestAnimationFrame(animateLaunch);
}

/**
 * Update flight data display
 */
function updateFlightData() {
    document.getElementById('data-altitude').textContent = formatAltitude(PHYSICS.altitude);
    document.getElementById('data-velocity').textContent = `${Math.round(PHYSICS.velocity)} m/s`;

    const fuelPercent = PHYSICS.maxFuel > 0 ? Math.round((PHYSICS.fuel / PHYSICS.maxFuel) * 100) : 0;
    document.getElementById('data-fuel').textContent = `${fuelPercent}%`;
}

/**
 * Render the launch scene
 */
function renderLaunchScene(dt) {
    const ctx = GAME.launchCtx;
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Calculate visual rocket position (follow camera)
    const targetY = height * 0.6;

    // Background color based on altitude (transition to space)
    const spaceProgress = Math.min(1, PHYSICS.altitude / 100000);

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    if (spaceProgress < 0.5) {
        // Atmosphere
        gradient.addColorStop(0, lerpColor('#001133', '#000005', spaceProgress * 2));
        gradient.addColorStop(0.5, lerpColor('#003366', '#000011', spaceProgress * 2));
        gradient.addColorStop(1, lerpColor('#004488', '#000022', spaceProgress * 2));
    } else {
        // Space
        gradient.addColorStop(0, '#000005');
        gradient.addColorStop(1, '#000011');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars (more visible in space)
    const starAlpha = 0.3 + spaceProgress * 0.7;
    ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
    GAME.stars.forEach(star => {
        ctx.globalAlpha = star.brightness * starAlpha;
        ctx.fillRect(star.x * width, star.y * height, star.size, star.size);
    });
    ctx.globalAlpha = 1;

    // Draw clouds (only in atmosphere)
    if (spaceProgress < 0.3) {
        const cloudOffset = PHYSICS.altitude * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * (1 - spaceProgress / 0.3)})`;

        GAME.clouds.forEach(cloud => {
            const y = cloud.y + cloudOffset % (height * 2) - height;
            if (y > -cloud.height && y < height + cloud.height) {
                drawCloud(ctx, (cloud.x + cloud.speed * PHYSICS.time * 100) % (width + cloud.width) - cloud.width / 2, y, cloud.width, cloud.height);
            }
        });
    }

    // Draw ground (only when low altitude)
    if (PHYSICS.altitude < 5000) {
        const groundY = height - 50 + Math.min(PHYSICS.altitude * 0.1, height);
        if (groundY < height + 100) {
            ctx.fillStyle = '#1a3322';
            ctx.fillRect(0, groundY, width, 100);

            // Ground details
            ctx.fillStyle = '#2a4433';
            for (let x = 0; x < width; x += 20) {
                ctx.fillRect(x, groundY, 10, 5);
            }

            // Launch pad
            if (groundY > height - 100) {
                ctx.fillStyle = '#444455';
                ctx.fillRect(width / 2 - 50, groundY - 10, 100, 15);
            }
        }
    }

    // Draw rocket
    const rocketX = width / 2;

    // Rocket bobbing based on velocity
    GAME.rocketY = targetY - Math.sin(PHYSICS.time * 5) * 2;

    drawRocketAtPosition(ctx, rocketX, GAME.rocketY, PHYSICS.throttle);

    // Draw smoke/exhaust particles
    if (PHYSICS.throttle > 0 && PHYSICS.fuel > 0) {
        addSmokeParticle(rocketX, GAME.rocketY + getRocketHeight());
    }

    updateAndDrawSmoke(ctx, dt);

    // Draw altitude marker
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'right';
    ctx.fillText(`ALT: ${formatAltitude(PHYSICS.altitude)}`, width - 20, 30);
    ctx.fillText(`VEL: ${Math.round(PHYSICS.velocity)} m/s`, width - 20, 50);

    // Show "descending" indicator
    if (PHYSICS.velocity < 0) {
        ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.fillText('DESCENDING', width - 20, 70);
    }
}

/**
 * Draw a cloud
 */
function drawCloud(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.arc(x + w * 0.3, y + h * 0.5, h * 0.5, 0, Math.PI * 2);
    ctx.arc(x + w * 0.5, y + h * 0.3, h * 0.6, 0, Math.PI * 2);
    ctx.arc(x + w * 0.7, y + h * 0.5, h * 0.5, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw rocket at launch position - NOW RENDERS ACTUAL PARTS
 */
function drawRocketAtPosition(ctx, x, y, throttle) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Calculate scale to fit rocket nicely on screen
    const maxHeight = 200; // Max visual height
    const scale = Math.min(1.5, maxHeight / Math.max(GAME.rocketBounds.height, 50));

    // Get rocket dimensions
    const rocketWidth = GAME.rocketBounds.width * scale;
    const rocketHeight = GAME.rocketBounds.height * scale;

    // Position rocket centered at x, with top at y
    const drawX = x - rocketWidth / 2;
    const drawY = y;

    // Draw each part in the rocket
    GAME.launchParts.forEach(placedPart => {
        const partDef = placedPart.partDef;

        // Calculate relative position within rocket
        const relX = (placedPart.x - GAME.rocketBounds.minX) * scale;
        const relY = (placedPart.y - GAME.rocketBounds.minY) * scale;

        // Draw the part
        drawPart(ctx, partDef, drawX + relX, drawY + relY, scale);
    });

    // Draw engine flame for all engines
    if (throttle > 0 && PHYSICS.fuel > 0) {
        GAME.launchParts.forEach(placedPart => {
            const partDef = placedPart.partDef;
            if (partDef.category !== 'engines') return;

            const relX = (placedPart.x - GAME.rocketBounds.minX) * scale;
            const relY = (placedPart.y - GAME.rocketBounds.minY) * scale;
            const partW = partDef.width * TILE_SIZE * scale;
            const partH = partDef.height * TILE_SIZE * scale;

            const flameX = drawX + relX + partW / 2;
            const flameY = drawY + relY + partH;
            const flameHeight = (20 + throttle * 30 + Math.random() * 15) * scale;
            const flameWidth = partW * 0.6;

            // Flame gradient
            const flameGradient = ctx.createLinearGradient(flameX, flameY, flameX, flameY + flameHeight);
            flameGradient.addColorStop(0, '#ffffff');
            flameGradient.addColorStop(0.15, '#ffffaa');
            flameGradient.addColorStop(0.3, '#ffff00');
            flameGradient.addColorStop(0.5, '#ff8800');
            flameGradient.addColorStop(0.8, '#ff4400');
            flameGradient.addColorStop(1, 'rgba(255, 68, 0, 0)');

            ctx.fillStyle = flameGradient;
            ctx.beginPath();
            ctx.moveTo(flameX - flameWidth / 2, flameY);
            ctx.quadraticCurveTo(flameX - flameWidth / 4, flameY + flameHeight * 0.5, flameX, flameY + flameHeight);
            ctx.quadraticCurveTo(flameX + flameWidth / 4, flameY + flameHeight * 0.5, flameX + flameWidth / 2, flameY);
            ctx.closePath();
            ctx.fill();

            // Inner hot core
            const coreGradient = ctx.createLinearGradient(flameX, flameY, flameX, flameY + flameHeight * 0.6);
            coreGradient.addColorStop(0, '#ffffff');
            coreGradient.addColorStop(0.5, '#ffffdd');
            coreGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.moveTo(flameX - flameWidth / 4, flameY);
            ctx.quadraticCurveTo(flameX, flameY + flameHeight * 0.4, flameX, flameY + flameHeight * 0.6);
            ctx.quadraticCurveTo(flameX, flameY + flameHeight * 0.4, flameX + flameWidth / 4, flameY);
            ctx.closePath();
            ctx.fill();
        });
    }

    ctx.restore();
}

/**
 * Get rocket visual height - now uses actual rocket bounds
 */
function getRocketHeight() {
    const scale = Math.min(1.5, 200 / Math.max(GAME.rocketBounds.height, 50));
    return GAME.rocketBounds.height * scale;
}

/**
 * Add smoke particle
 */
function addSmokeParticle(x, y) {
    GAME.smokeParticles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y,
        vx: (Math.random() - 0.5) * 30,
        vy: Math.random() * 50 + 50,
        size: 10 + Math.random() * 20,
        life: 1
    });

    // Limit particles
    if (GAME.smokeParticles.length > 100) {
        GAME.smokeParticles.shift();
    }
}

/**
 * Update and draw smoke particles
 */
function updateAndDrawSmoke(ctx, dt) {
    GAME.smokeParticles.forEach((p, i) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.size += dt * 30;
        p.life -= dt * 0.8;

        if (p.life > 0) {
            ctx.fillStyle = `rgba(200, 200, 200, ${p.life * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Remove dead particles
    GAME.smokeParticles = GAME.smokeParticles.filter(p => p.life > 0);
}

/**
 * Color interpolation helper
 */
function lerpColor(color1, color2, t) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);

    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Show results screen
 */
function showResults() {
    cancelAnimationFrame(GAME.animationFrame);

    // Stop any sounds
    if (typeof stopThrustSound === 'function') stopThrustSound();

    const level = LEVELS[GAME.currentLevel - 1];
    const targetAltitude = level ? level.targetAltitude : 10000;
    const results = getFlightResults(targetAltitude);

    // Play result sound
    if (results.success && typeof playSuccessSound === 'function') {
        playSuccessSound();
    }

    // Update title
    const title = document.getElementById('results-title');
    title.textContent = results.success ? 'MISSION SUCCESS!' : 'MISSION FAILED';
    title.style.color = results.success ? '#00ffff' : '#ff3366';

    // Stars
    const starsContainer = document.getElementById('results-stars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.textContent = i < results.stars ? '⭐' : '☆';
        star.style.opacity = i < results.stars ? 1 : 0.3;
        starsContainer.appendChild(star);
    }

    // Stats
    const statsContainer = document.getElementById('results-stats');
    statsContainer.innerHTML = `
        <div class="result-stat">
            <span class="result-stat-label">Max Altitude</span>
            <span class="result-stat-value ${results.maxAltitude >= targetAltitude ? 'success' : 'fail'}">
                ${formatAltitude(results.maxAltitude)} / ${formatAltitude(targetAltitude)}
            </span>
        </div>
        <div class="result-stat">
            <span class="result-stat-label">Max Velocity</span>
            <span class="result-stat-value">${Math.round(results.maxVelocity)} m/s</span>
        </div>
        <div class="result-stat">
            <span class="result-stat-label">Flight Time</span>
            <span class="result-stat-value">${formatTime(results.flightTime)}</span>
        </div>
        <div class="result-stat">
            <span class="result-stat-label">Fuel Remaining</span>
            <span class="result-stat-value ${results.fuelRemaining > 5 ? 'success' : ''}">${Math.round(results.fuelRemaining)}%</span>
        </div>
    `;

    // Unlock message
    const unlockContainer = document.getElementById('results-unlock');
    if (results.success && level && level.unlocksPartId) {
        const part = getPartById(level.unlocksPartId);
        unlockContainer.innerHTML = `🔓 NEW UNLOCK: ${part.name}`;

        // Actually unlock the level
        if (GAME.currentLevel >= GAME.maxUnlockedLevel) {
            GAME.maxUnlockedLevel = GAME.currentLevel + 1;
            saveProgress();
        }
    } else {
        unlockContainer.innerHTML = '';
    }

    // Show/hide next button
    document.getElementById('btn-next').style.display =
        results.success && GAME.currentMode === 'level' ? 'block' : 'none';

    showScreen('results');
}

/**
 * Format time for display
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
}

/**
 * Save progress to localStorage
 */
function saveProgress() {
    const progress = {
        maxUnlockedLevel: GAME.maxUnlockedLevel,
        currentLevel: GAME.currentLevel
    };
    localStorage.setItem('pixelRocketProgress', JSON.stringify(progress));
}

/**
 * Load progress from localStorage
 */
function loadProgress() {
    const saved = localStorage.getItem('pixelRocketProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        GAME.maxUnlockedLevel = progress.maxUnlockedLevel || 1;
        GAME.currentLevel = progress.currentLevel || 1;
    }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);
