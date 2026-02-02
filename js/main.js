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

    // Advanced mode - shows warning first
    document.getElementById('btn-advanced-mode').addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        document.getElementById('advanced-warning-modal').classList.add('active');
    });

    // Advanced mode warning modal buttons
    document.getElementById('btn-accept-advanced').addEventListener('click', () => {
        document.getElementById('advanced-warning-modal').classList.remove('active');
        setGameMode('advanced');
        if (typeof playClickSound === 'function') playClickSound();
    });

    document.getElementById('btn-cancel-advanced').addEventListener('click', () => {
        document.getElementById('advanced-warning-modal').classList.remove('active');
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

    // Ignition button
    const btnIgnition = document.getElementById('btn-ignition');
    if (btnIgnition) {
        btnIgnition.addEventListener('click', startIgnition);
    }

    // Preset button
    document.getElementById('btn-load-preset').addEventListener('click', () => {
        showPresetModal();
        if (typeof playClickSound === 'function') playClickSound();
    });

    document.getElementById('close-preset-modal').addEventListener('click', () => {
        document.getElementById('preset-modal').classList.remove('active');
        if (typeof playClickSound === 'function') playClickSound();
    });

    // Validation modal close
    const closeValidationBtn = document.getElementById('close-validation-modal');
    if (closeValidationBtn) {
        closeValidationBtn.addEventListener('click', () => {
            document.getElementById('validation-modal').classList.remove('active');
            if (typeof playClickSound === 'function') playClickSound();
        });
    }

    // Launch controls
    document.getElementById('throttle-slider').addEventListener('input', (e) => {
        const value = e.target.value / 100;
        setThrottle(value);
        document.getElementById('throttle-value').textContent = `${e.target.value}%`;
        if (typeof updateThrustSound === 'function') updateThrustSound(value);
    });

    document.getElementById('btn-stage').addEventListener('click', () => {
        console.log("👆 'Stage' button clicked!");
        const result = triggerStage();
        console.log("Trigger Result:", result);
        if (result && result.success) {
            console.log("Dropped parts count:", result.droppedParts.length);
            handleStagingEvent(result.droppedParts);
            if (typeof playStagingSound === 'function') playStagingSound();
        } else {
            console.warn("Staging triggered but failed (no next stage available?)");
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

    // Planet Selector
    const planetSelector = document.getElementById('planet-selector');
    if (planetSelector) {
        planetSelector.addEventListener('change', (e) => {
            const planetId = e.target.value;
            setCurrentPlanet(planetId);
            updatePlanetVisuals();

            // Recalculate stats with new gravity
            if (typeof updateStats === 'function') updateStats();

            // Re-run analysis if available
            if (typeof analyzeRocket === 'function') analyzeRocket(EDITOR.placedParts);

            if (typeof playClickSound === 'function') playClickSound();
        });

        // Initial set
        updatePlanetVisuals();
    }
}

/**
 * Update visual elements based on current planet
 */
function updatePlanetVisuals() {
    // Current Planet is already set in planets.js
    // We might want to force a re-render of clouds or background color

    // Reset clouds for new planet atmosphere
    const canvas = document.getElementById('launch-canvas');
    if (canvas) {
        GAME.clouds = [];
        if (typeof generateClouds === 'function') {
            GAME.clouds = generateClouds(canvas.width, canvas.height);
        }
    }
}

/**
 * Set game mode
 */
function setGameMode(mode) {
    GAME.currentMode = mode;

    // Update UI buttons
    document.getElementById('btn-level-mode').classList.toggle('active', mode === 'level');
    document.getElementById('btn-fun-mode').classList.toggle('active', mode === 'fun');
    document.getElementById('btn-advanced-mode').classList.toggle('active', mode === 'advanced');

    // Enable/disable advanced physics
    if (typeof setAdvancedMode === 'function') {
        setAdvancedMode(mode === 'advanced');
    }

    // Show/hide orbital telemetry
    const orbitalTelemetry = document.getElementById('orbital-telemetry');
    if (orbitalTelemetry) {
        orbitalTelemetry.style.display = mode === 'advanced' ? 'flex' : 'none';
    }

    // Refresh parts panel (all parts unlocked in fun/advanced)
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
    // FORCE PLANET UPDATE from UI selector before launch
    // This ensures physics is always in sync with the user's choice
    const planetSelector = document.getElementById('planet-selector');
    if (planetSelector && typeof setCurrentPlanet === 'function') {
        setCurrentPlanet(planetSelector.value);
        console.log(`🚀 Launch Sequence Initiated on ${planetSelector.value}`);

        // Also ensure visuals are synced
        if (typeof updatePlanetVisuals === 'function') updatePlanetVisuals();
    }

    // Get only connected parts
    const connectedParts = typeof getValidRocketParts === 'function'
        ? getValidRocketParts()
        : EDITOR.placedParts;

    if (connectedParts.length === 0) {
        alert('Add some parts to your rocket first! Make sure they are connected.');
        return;
    }

    // STRICT PHYSICS VALIDATION
    if (typeof validateRocketDesign === 'function') {
        const validation = validateRocketDesign(EDITOR.placedParts);
        if (!validation.valid) {
            showValidationErrors(validation.errors, validation.warnings);
            return; // BLOCK LAUNCH
        }
        // Show warnings even if valid
        if (validation.warnings && validation.warnings.length > 0) {
            console.warn('Launch warnings:', validation.warnings);
        }
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

    // Prepare for launch but waiting for IGNITION
    GAME.launchParts = connectedParts.map(p => ({
        ...p,
        partDef: getPartById(p.partId)
    }));

    // Initialize physics but don't start running yet
    initPhysics(connectedParts);

    // Setup launch canvas and render initial state
    const canvas = document.getElementById('launch-canvas');
    const controls = document.getElementById('launch-controls');
    GAME.launchCtx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    // Reserve space for controls at bottom
    const controlsHeight = controls ? controls.offsetHeight || 80 : 80;
    canvas.height = canvas.parentElement.clientHeight - controlsHeight;

    GAME.rocketY = canvas.height - 150;
    GAME.smokeParticles = [];
    GAME.clouds = generateClouds(canvas.width, canvas.height);

    // Reset inputs - start at 30% throttle for reliable liftoff
    document.getElementById('throttle-slider').value = 30;
    document.getElementById('throttle-value').textContent = '30%';
    setThrottle(0.3);

    // Show Ignition Overlay
    const ignitionOverlay = document.getElementById('ignition-overlay');
    ignitionOverlay.classList.remove('hidden');

    // Initialize debris
    GAME.debris = [];
    GAME.hasLoggedDebris = false;

    // Calculate rocket bounds
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

    // Initial Render
    renderLaunchScene(0);
}

/**
 * Start actual ignition and physics
 */
function startIgnition() {
    // Hide overlay
    document.getElementById('ignition-overlay').classList.add('hidden');

    // Play ignition sound
    if (typeof playIgnitionSound === 'function') playIgnitionSound();

    // Start physics
    PHYSICS.isRunning = true;

    // Start thrust sound after delay
    setTimeout(() => {
        if (typeof startThrustSound === 'function') startThrustSound();
    }, 500);

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

    // Check if rocket failed
    if (PHYSICS.hasFailed) {
        // Stop sounds
        if (typeof stopThrustSound === 'function') stopThrustSound();

        // Play explosion sound
        if (typeof playExplosionSound === 'function') playExplosionSound();

        // Show failure overlay
        const failureOverlay = document.getElementById('failure-overlay');
        const failureText = document.getElementById('failure-text');
        if (failureOverlay && failureText) {
            failureText.textContent = PHYSICS.failureMessage || 'MISSION FAILED';
            failureOverlay.classList.remove('hidden');
        }

        // Wait a moment then show results
        setTimeout(() => {
            showResults();
        }, 2000);
        return;
    }

    // Check if simulation ended normally
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
 * Update flight data display with full telemetry
 */
function updateFlightData() {
    // Get telemetry from physics engine
    const telemetry = typeof getTelemetry === 'function' ? getTelemetry() : null;

    // Basic data
    document.getElementById('data-altitude').textContent = formatAltitude(PHYSICS.altitude);
    document.getElementById('data-velocity').textContent = `${Math.round(PHYSICS.velocity)} m/s`;

    // Orbit data
    if (telemetry && telemetry.orbit) {
        if (telemetry.orbit.isOrbital) {
            document.getElementById('data-apoapsis').textContent = formatAltitude(telemetry.orbit.apoapsis);
            document.getElementById('data-periapsis').textContent = formatAltitude(telemetry.orbit.periapsis);
            document.getElementById('data-eccentricity').textContent = telemetry.orbit.eccentricity.toFixed(3);

            // New Elements
            const toDeg = (rad) => ((rad * 180 / Math.PI) % 360).toFixed(1);
            document.getElementById('data-true-anomaly').textContent = `${toDeg(telemetry.orbit.trueAnomaly)}°`;
            document.getElementById('data-arg-pe').textContent = `${toDeg(telemetry.orbit.argumentOfPeriapsis)}°`;
            document.getElementById('data-mean-anomaly').textContent = `${toDeg(telemetry.orbit.meanAnomaly)}°`;
            document.getElementById('data-inclination').textContent = `${toDeg(telemetry.orbit.inclination)}°`;
        }

        // Engine Status
        const engineRow = document.getElementById('engine-telemetry');
        if (engineRow) {
            engineRow.style.display = 'flex';

            // Ignition
            const ignEl = document.getElementById('data-ignition');
            if (telemetry.ignitionFailed) {
                ignEl.textContent = 'FAIL';
                ignEl.style.color = '#ff0000';
            } else {
                ignEl.textContent = 'OK';
                ignEl.style.color = '#00ff00';
            }

            // Cavitation
            const cavEl = document.getElementById('data-cavitation');
            if (telemetry.cavitating) {
                const loss = (telemetry.cavitationLoss * 100).toFixed(0);
                cavEl.textContent = `YES (-${loss}%)`;
                cavEl.style.color = '#ff9900';
            } else {
                cavEl.textContent = 'NO';
                cavEl.style.color = '#888888';
            }

            // Lag
            document.getElementById('data-throttle-lag').textContent = telemetry.throttleLag.toFixed(2);
        }
    }

    // Mach number
    const machEl = document.getElementById('data-mach');
    if (machEl) {
        const mach = telemetry ? telemetry.machNumber : 0;
        machEl.textContent = mach.toFixed(2);

        // Color coding for speed regime
        machEl.classList.remove('supersonic', 'hypersonic');
        if (mach >= 5) {
            machEl.classList.add('hypersonic');
        } else if (mach >= 1) {
            machEl.classList.add('supersonic');
        }
    }

    // Dynamic Pressure (Q)
    const qEl = document.getElementById('data-q');
    const qIndicator = document.getElementById('q-indicator');
    const qFill = document.getElementById('q-fill');
    if (qEl && telemetry) {
        const q = telemetry.dynamicPressure / 1000; // Convert to kPa
        qEl.textContent = q.toFixed(1);

        // Update warning bar
        const qPercent = Math.min(100, (telemetry.dynamicPressure / PHYSICS.MAX_Q_LIMIT) * 100);
        if (qFill) qFill.style.width = qPercent + '%';

        // Update warning class
        if (qIndicator) {
            qIndicator.classList.remove('warning', 'danger');
            if (telemetry.warnings.q === 2) qIndicator.classList.add('danger');
            else if (telemetry.warnings.q === 1) qIndicator.classList.add('warning');
        }
    }

    // G-Force
    const gEl = document.getElementById('data-g');
    const gIndicator = document.getElementById('g-indicator');
    const gFill = document.getElementById('g-fill');
    if (gEl && telemetry) {
        gEl.textContent = telemetry.gForce.toFixed(1) + ' g';

        // Update warning bar
        const gPercent = Math.min(100, (Math.abs(telemetry.gForce) / PHYSICS.MAX_G_LIMIT) * 100);
        if (gFill) gFill.style.width = gPercent + '%';

        // Update warning class
        if (gIndicator) {
            gIndicator.classList.remove('warning', 'danger');
            if (telemetry.warnings.g === 2) gIndicator.classList.add('danger');
            else if (telemetry.warnings.g === 1) gIndicator.classList.add('warning');
        }
    }

    // Surface Temperature
    const tempEl = document.getElementById('data-temp');
    const tempIndicator = document.getElementById('temp-indicator');
    const tempFill = document.getElementById('temp-fill');
    if (tempEl && telemetry) {
        tempEl.textContent = Math.round(telemetry.surfaceTemp);

        // Update warning bar
        const tempPercent = Math.min(100, (telemetry.surfaceTemp / PHYSICS.MAX_TEMP_LIMIT) * 100);
        if (tempFill) tempFill.style.width = tempPercent + '%';

        // Update warning class
        if (tempIndicator) {
            tempIndicator.classList.remove('warning', 'danger');
            if (telemetry.warnings.temp === 2) tempIndicator.classList.add('danger');
            else if (telemetry.warnings.temp === 1) tempIndicator.classList.add('warning');
        }
    }

    // Fuel
    const fuelPercent = PHYSICS.maxFuel > 0 ? Math.round((PHYSICS.fuel / PHYSICS.maxFuel) * 100) : 0;
    document.getElementById('data-fuel').textContent = `${fuelPercent}%`;

    // Staging Info
    const stagesEl = document.getElementById('data-stages');
    if (stagesEl) {
        const current = PHYSICS.currentStage + 1;
        const total = PHYSICS.stages.length;
        stagesEl.textContent = `${current}/${total}`;

        // Highlight stage button if next stage is available
        const stageBtn = document.getElementById('btn-stage');
        if (stageBtn) {
            const hasNext = PHYSICS.currentStage < PHYSICS.stages.length - 1;
            stageBtn.classList.toggle('highlight', hasNext);
        }
    }

    // Time
    const timeEl = document.getElementById('data-time');
    if (timeEl) {
        timeEl.textContent = PHYSICS.time.toFixed(1) + 's';
    }
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
    // Background color based on altitude (transition to space)
    const spaceProgress = Math.min(1, PHYSICS.altitude / 100000);
    const planet = getCurrentPlanet();

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    if (planet.hasAtmosphere) {
        if (spaceProgress < 0.5) {
            // Atmosphere
            // We derive sky colors from the planet's base color
            // This is a simplification: assuming planet.color is a good "sky" representation or "map" representation
            // Earth #4477ff is good for sky. Mars #ff6644 is good for sky.

            // Horizon color (lighter)
            const horizonColor = planet.color;
            // Zenith color (darker, approximated by mixing with black)
            const zenithColor = lerpColor(planet.color, '#000000', 0.7);

            gradient.addColorStop(0, lerpColor(zenithColor, '#000000', spaceProgress * 2));
            gradient.addColorStop(1, lerpColor(horizonColor, '#000011', spaceProgress * 2));
        } else {
            // Space
            gradient.addColorStop(0, '#000005');
            gradient.addColorStop(1, '#000011');
        }
    } else {
        // No atmosphere (Moon) - Black sky immediately
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#000000');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars (more visible in space or if no atmosphere)
    // If no atmosphere, stars are always visible (alpha 1)
    // If atmosphere, alpha increases with altitude
    let starAlpha = 1;
    if (planet.hasAtmosphere) {
        starAlpha = 0.3 + spaceProgress * 0.7;
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
    GAME.stars.forEach(star => {
        ctx.globalAlpha = star.brightness * starAlpha;
        ctx.fillRect(star.x * width, star.y * height, star.size, star.size);
    });
    ctx.globalAlpha = 1;

    // Draw clouds (only in atmosphere)
    if (planet.hasAtmosphere && spaceProgress < 0.3) {
        const cloudOffset = PHYSICS.altitude * 0.5;
        // Clouds fade out higher up
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * (1 - spaceProgress / 0.3)})`;

        // Tint clouds slightly with atmosphere color? 
        // For now white is fine, but maybe Mars clouds are dusty?
        // Let's keep them white/default for now to avoid complexity.

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
            ctx.fillStyle = planet.groundColor;
            ctx.fillRect(0, groundY, width, 100);

            // Ground details (slightly lighter/darker variation)
            ctx.fillStyle = lerpColor(planet.groundColor, '#ffffff', 0.1);
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

    // Draw debris (behind rocket)
    updateAndDrawDebris(ctx, dt, rocketX);

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

    // Get stress levels for visual effects
    const stressLevels = typeof getStressLevels === 'function' ? getStressLevels() : { heat: 0, gForce: 0, pressure: 0 };

    // Apply shake effect based on G-force and pressure stress
    const shakeIntensity = (stressLevels.gForce * 3 + stressLevels.pressure * 2);
    const shakeX = (Math.random() - 0.5) * shakeIntensity;
    const shakeY = (Math.random() - 0.5) * shakeIntensity;

    // Position rocket centered at x, with top at y
    const drawX = x - rocketWidth / 2 + shakeX;
    const drawY = y + shakeY;

    // Draw each part in the rocket
    GAME.launchParts.forEach(placedPart => {
        const partDef = placedPart.partDef;

        // Calculate relative position within rocket
        const relX = (placedPart.x - GAME.rocketBounds.minX) * scale;
        const relY = (placedPart.y - GAME.rocketBounds.minY) * scale;

        // Calculate flip based on position relative to rocket center
        const partW = partDef.width * TILE_SIZE;
        const partCX = placedPart.x + partW / 2;
        const flipX = partCX < GAME.rocketBounds.centerX - 1;

        // Draw the part
        drawPart(ctx, partDef, drawX + relX, drawY + relY, scale, flipX);
    });

    // Draw heat glow overlay when hot
    if (stressLevels.heat > 0.1) {
        const heatIntensity = stressLevels.heat;

        // Create hot glow around rocket
        ctx.save();

        // Heat color transitions: yellow -> orange -> red -> white hot
        let heatColor;
        if (heatIntensity < 0.3) {
            heatColor = `rgba(255, 200, 50, ${heatIntensity * 0.5})`;
        } else if (heatIntensity < 0.6) {
            heatColor = `rgba(255, 100, 0, ${heatIntensity * 0.6})`;
        } else if (heatIntensity < 0.9) {
            heatColor = `rgba(255, 50, 0, ${heatIntensity * 0.7})`;
        } else {
            heatColor = `rgba(255, 255, 200, ${heatIntensity * 0.8})`;
        }

        // Draw heat glow
        const glowSize = 10 + heatIntensity * 20;
        const gradient = ctx.createRadialGradient(
            x, drawY + rocketHeight / 2, rocketWidth / 2,
            x, drawY + rocketHeight / 2, rocketWidth + glowSize
        );
        gradient.addColorStop(0, heatColor);
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x - rocketWidth - glowSize, drawY - glowSize,
            rocketWidth * 2 + glowSize * 2, rocketHeight + glowSize * 2);

        // Draw heat streaks on nose cone area
        if (heatIntensity > 0.3) {
            const streakCount = Math.floor(heatIntensity * 5);
            for (let i = 0; i < streakCount; i++) {
                const streakX = x + (Math.random() - 0.5) * rocketWidth;
                const streakY = drawY + Math.random() * 20;
                const streakLength = 10 + heatIntensity * 30;

                const streakGrad = ctx.createLinearGradient(streakX, streakY, streakX, streakY + streakLength);
                streakGrad.addColorStop(0, `rgba(255, 200, 100, ${heatIntensity})`);
                streakGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');

                ctx.strokeStyle = streakGrad;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(streakX, streakY);
                ctx.lineTo(streakX + (Math.random() - 0.5) * 5, streakY + streakLength);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    // Draw pressure distortion effect when high Q
    if (stressLevels.pressure > 0.5) {
        ctx.save();
        ctx.strokeStyle = `rgba(100, 150, 255, ${stressLevels.pressure * 0.3})`;
        ctx.lineWidth = 2 + stressLevels.pressure * 3;
        ctx.setLineDash([5, 5]);

        // Draw stress lines
        ctx.beginPath();
        ctx.moveTo(x - rocketWidth / 2 - 5, drawY);
        ctx.lineTo(x - rocketWidth / 2 - 10, drawY + rocketHeight);
        ctx.moveTo(x + rocketWidth / 2 + 5, drawY);
        ctx.lineTo(x + rocketWidth / 2 + 10, drawY + rocketHeight);
        ctx.stroke();

        ctx.restore();
    }

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

    // Hide failure overlay
    const failureOverlay = document.getElementById('failure-overlay');
    if (failureOverlay) failureOverlay.classList.add('hidden');

    const level = LEVELS[GAME.currentLevel - 1];
    const targetAltitude = level ? level.targetAltitude : 10000;
    const results = getFlightResults(targetAltitude);

    // Play result sound
    if (results.success && typeof playSuccessSound === 'function') {
        playSuccessSound();
    }

    // Update title based on success or failure type
    const title = document.getElementById('results-title');
    if (results.failed) {
        title.textContent = 'ROCKET DESTROYED!';
        title.style.color = '#ff3366';
    } else if (results.success) {
        title.textContent = 'MISSION SUCCESS!';
        title.style.color = '#00ffff';
    } else {
        title.textContent = 'MISSION FAILED';
        title.style.color = '#ff3366';
    }

    // Stars (none if failed)
    const starsContainer = document.getElementById('results-stars');
    starsContainer.innerHTML = '';
    if (!results.failed) {
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('span');
            star.textContent = i < results.stars ? '⭐' : '☆';
            star.style.opacity = i < results.stars ? 1 : 0.3;
            starsContainer.appendChild(star);
        }
    } else {
        starsContainer.innerHTML = '💥';
    }

    // Stats - include more physics data for educational purposes
    const statsContainer = document.getElementById('results-stats');
    let statsHTML = `
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
            <span class="result-stat-label">Max Q (Dynamic Pressure)</span>
            <span class="result-stat-value ${results.maxQ > PHYSICS.MAX_Q_LIMIT ? 'fail' : ''}">${(results.maxQ / 1000).toFixed(1)} kPa</span>
        </div>
        <div class="result-stat">
            <span class="result-stat-label">Max G-Force</span>
            <span class="result-stat-value ${results.maxG > PHYSICS.MAX_G_LIMIT ? 'fail' : ''}">${results.maxG.toFixed(1)} g</span>
        </div>
        <div class="result-stat">
            <span class="result-stat-label">Max Temperature</span>
            <span class="result-stat-value ${results.maxTemp > PHYSICS.MAX_TEMP_LIMIT ? 'fail' : ''}">${Math.round(results.maxTemp)} K</span>
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

    // Add detailed failure explanation if applicable
    if (results.failed && results.failureReason) {
        const explanation = typeof getFailureExplanation === 'function' ?
            getFailureExplanation(results.failureReason) : null;

        if (explanation) {
            let improvementsHTML = explanation.improvements.map(tip =>
                `<li>${tip}</li>`
            ).join('');

            statsHTML = `
                <div class="failure-explanation">
                    <div class="failure-header">
                        <span class="failure-icon-large">${explanation.icon}</span>
                        <span class="failure-title">${explanation.title}</span>
                    </div>
                    
                    <div class="explanation-section">
                        <div class="explanation-label">What Happened:</div>
                        <div class="explanation-text">${explanation.whatHappened}</div>
                    </div>
                    
                    <div class="explanation-section">
                        <div class="explanation-label">📚 The Physics:</div>
                        <div class="explanation-text">${explanation.physics}</div>
                    </div>
                    
                    <div class="explanation-section">
                        <div class="explanation-label">🌍 Real World:</div>
                        <div class="explanation-text">${explanation.realWorld}</div>
                    </div>
                    
                    <div class="explanation-section improvements">
                        <div class="explanation-label">💡 How to Improve:</div>
                        <ul class="improvement-list">${improvementsHTML}</ul>
                    </div>
                </div>
            ` + statsHTML;
        } else {
            statsHTML = `
                <div class="result-stat" style="border-color: var(--accent-danger);">
                    <span class="result-stat-label" style="color: var(--accent-danger);">Cause of Failure</span>
                    <span class="result-stat-value fail">${results.failureMessage}</span>
                </div>
            ` + statsHTML;
        }
    }

    statsContainer.innerHTML = statsHTML;

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
/**
 * Handle visual effects for staging
 */
function handleStagingEvent(droppedParts) {
    if (!droppedParts || droppedParts.length === 0) return;

    // Remove from active launch parts
    const droppedIds = new Set(droppedParts.map(p => p.id));
    GAME.launchParts = GAME.launchParts.filter(p => !droppedIds.has(p.id));

    // Add to debris
    // Position needs to be relative to current rocket Visual position ??
    // Actually, GAME.launchParts `x,y` are their ORIGINAL Editor positions.
    // They are drawn relative to rocket center.
    // So debris should inherit that relative position.

    // We need to know where the rocket is visually?
    // In drawRocketAtPosition, parts are drawn at `drawX + relX`.
    // Debris should start there.

    droppedParts.forEach(p => {
        GAME.debris.push({
            partDef: getPartById(p.partId),
            x: p.x, // Absolute editor coordinate
            y: p.y,
            // Visual offsets (starts attached)
            offsetX: 0,
            offsetY: 0,
            // Velocity relative to rocket (pixels per frame approx)
            vx: (Math.random() - 0.5) * 5,
            vy: 2 + Math.random() * 2, // Falling down relative to rocket
            rot: 0,
            rotSpeed: (Math.random() - 0.5) * 0.2
        });

        // Trigger puff
        createStagingEffect(p.x + getPartById(p.partId).width * TILE_SIZE / 2, p.y);
    });

    // Recalculate rocket bounds after parts removed so camera centers on new stage
    if (GAME.launchParts.length > 0) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        GAME.launchParts.forEach(p => {
            const def = getPartById(p.partId);
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x + def.width * TILE_SIZE);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y + def.height * TILE_SIZE);
        });
        GAME.rocketBounds = { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY, centerX: (minX + maxX) / 2 };
    }
}
/**
 * Update and draw debris
 */
function updateAndDrawDebris(ctx, dt, centerX) {
    if (!GAME.debris || GAME.debris.length === 0) return;

    // Log once
    if (!GAME.hasLoggedDebris) {
        console.log(`[Visuals] Drawing ${GAME.debris.length} debris parts.`);
        GAME.hasLoggedDebris = true;
    }

    // Calculate scale (must match drawRocketAtPosition)
    const maxHeight = 200;
    const scale = Math.min(1.5, maxHeight / Math.max(GAME.rocketBounds.height, 50));

    // Rocket alignment
    const rocketCenterEditorX = GAME.rocketBounds.centerX;
    const rocketMinEditorY = GAME.rocketBounds.minY;

    // Remove debris that is way off screen
    GAME.debris = GAME.debris.filter(p => p.time < 30); // 30 second lifespan

    GAME.debris.forEach(p => {
        // Update physics
        // Fall away from rocket
        const gravity = 400; // Increased visual gravity
        const drag = 0.5;   // Simple air resistance

        // Acceleration
        p.vy += gravity * dt;

        // Drag (opposes velocity)
        p.vx *= (1 - drag * dt);
        p.vy *= (1 - drag * dt);

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.rotSpeed * dt;
        p.time = (p.time || 0) + dt;

        // Draw Position
        // ScreenX = ScreenCenter + (PartX - RocketCenterX) * scale
        const drawX = centerX + (p.x - rocketCenterEditorX) * scale;

        // ScreenY = VisualTopY + (PartY - RocketMinY) * scale
        // Use GAME.rocketY for VisualTopY
        const drawY = GAME.rocketY + (p.y - rocketMinEditorY) * scale;

        // Draw rotated
        ctx.save();
        const w = p.partDef.width * TILE_SIZE * scale;
        const h = p.partDef.height * TILE_SIZE * scale;

        // Center of part
        const cx = drawX + w / 2;
        const cy = drawY + h / 2;

        ctx.translate(cx, cy);
        ctx.rotate(p.rot);
        ctx.translate(-cx, -cy);

        // Debris always darkened slightly
        ctx.globalAlpha = 0.8;
        drawPart(ctx, p.partDef, drawX, drawY, scale, false);
        ctx.globalAlpha = 1.0;

        ctx.restore();
    });
}
/**
 * Create a puff of smoke at position
 */
function createStagingEffect(x, y) {
    if (!GAME.smokeParticles) GAME.smokeParticles = [];

    // Add 10-20 particles
    const count = 10 + Math.random() * 10;
    for (let i = 0; i < count; i++) {
        GAME.smokeParticles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            life: 1.0, // Seconds
            color: `rgba(200, 200, 200, ${0.5 + Math.random() * 0.5})`,
            size: 5 + Math.random() * 10
        });
    }
}
