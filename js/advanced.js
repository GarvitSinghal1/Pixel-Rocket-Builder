/**
 * PIXEL ROCKET BUILDER - Advanced Physics
 * Orbital mechanics, failures, and realistic simulation
 */

const ADVANCED = {
    enabled: false,

    // Orbital state
    orbit: {
        semiMajorAxis: 0,
        eccentricity: 0,
        apoapsis: 0,
        periapsis: 0,
        orbitalPeriod: 0,
        trueAnomaly: 0,
        meanAnomaly: 0,
        argumentOfPeriapsis: 0,
        inclination: 0
    },

    // Engine state
    engines: {
        throttleActual: 0,
        throttleTarget: 0,
        throttleResponseTime: 0.5, // seconds
        ignitionAttempted: false,
        ignitionSuccess: true,
        cavitating: false,
        cavitationLoss: 0
    },

    // Failure tracking
    failures: {
        ignitionFailures: 0,
        cavitationEvents: 0
    }
};

// Advanced mode constants
const ADV_CONST = {
    IGNITION_BASE_FAILURE_RATE: 0.05,    // 5% base failure chance
    IGNITION_LOW_PRESSURE_PENALTY: 0.15,  // +15% at low pressure
    CAVITATION_VAPOR_PRESSURE: 2000,      // Pa
    THROTTLE_RESPONSE_TIME: 0.5,          // seconds
    MIN_FUEL_PRESSURE: 0.1                // Minimum normalized pressure
};

/**
 * Enable/disable advanced mode
 */
function setAdvancedMode(enabled) {
    ADVANCED.enabled = enabled;
    resetAdvancedState();
    console.log(enabled ? '⚠️ ADVANCED MODE ENABLED' : '✅ Advanced mode disabled');
}

/**
 * Check if advanced mode is active
 */
function isAdvancedMode() {
    return ADVANCED.enabled;
}

/**
 * Reset advanced state
 */
function resetAdvancedState() {
    ADVANCED.engines.throttleActual = 0;
    ADVANCED.engines.throttleTarget = 0;
    ADVANCED.engines.ignitionAttempted = false;
    ADVANCED.engines.ignitionSuccess = true;
    ADVANCED.engines.cavitating = false;
    ADVANCED.engines.cavitationLoss = 0;

    ADVANCED.orbit = {
        semiMajorAxis: 0,
        eccentricity: 0,
        apoapsis: 0,
        periapsis: 0,
        orbitalPeriod: 0,
        trueAnomaly: 0,
        meanAnomaly: 0,
        argumentOfPeriapsis: 0,
        inclination: 0
    };
}

// ============================================
// ORBITAL MECHANICS
// ============================================

/**
 * Calculate orbital elements from state vectors
 * @param {Object} position - {x, y} in meters from body center
 * @param {Object} velocity - {vx, vy} in m/s
 * @param {number} mu - Gravitational parameter GM
 */
function calculateOrbitalElements(position, velocity, mu) {
    const r = Math.sqrt(position.x * position.x + position.y * position.y);
    const v = Math.sqrt(velocity.vx * velocity.vx + velocity.vy * velocity.vy);

    // Specific orbital energy
    const energy = (v * v / 2) - (mu / r);

    // Semi-major axis
    const a = -mu / (2 * energy);

    // Angular momentum (2D: h = r × v = x*vy - y*vx)
    const h = position.x * velocity.vy - position.y * velocity.vx;

    // Eccentricity vector
    const ex = (velocity.vy * h / mu) - (position.x / r);
    const ey = -(velocity.vx * h / mu) - (position.y / r);
    const e = Math.sqrt(ex * ex + ey * ey);

    // Apoapsis and periapsis
    const apoapsis = a * (1 + e);
    const periapsis = a * (1 - e);

    // Orbital period (only for elliptical orbits)
    const period = e < 1 ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : Infinity;

    // True anomaly
    const trueAnomaly = Math.atan2(position.y, position.x) - Math.atan2(ey, ex);

    // Argument of periapsis
    const argPe = Math.atan2(ey, ex);

    ADVANCED.orbit = {
        semiMajorAxis: a,
        eccentricity: e,
        apoapsis: apoapsis,
        periapsis: periapsis,
        orbitalPeriod: period,
        trueAnomaly: trueAnomaly,
        meanAnomaly: 0, // Simplified
        argumentOfPeriapsis: argPe,
        inclination: 0, // 2D simulation
        specificEnergy: energy,
        angularMomentum: h,
        isElliptical: e < 1,
        isHyperbolic: e >= 1
    };

    return ADVANCED.orbit;
}

/**
 * Get orbital velocity at current position for circular orbit
 */
function getCircularOrbitVelocity(altitude, planetId) {
    const planet = getPlanet(planetId || PLANETARY.currentBody);
    const r = planet.radius + altitude;
    return Math.sqrt(planet.mu / r);
}

/**
 * Get escape velocity at altitude
 */
function getEscapeVelocityAtAltitude(altitude, planetId) {
    const planet = getPlanet(planetId || PLANETARY.currentBody);
    const r = planet.radius + altitude;
    return Math.sqrt(2 * planet.mu / r);
}

/**
 * Calculate velocity vector components
 */
function getVelocityVectors(velocity, position) {
    const r = Math.sqrt(position.x * position.x + position.y * position.y);
    const v = Math.sqrt(velocity.vx * velocity.vx + velocity.vy * velocity.vy);

    // Radial unit vector (pointing outward from planet center)
    const radialX = position.x / r;
    const radialY = position.y / r;

    // Prograde unit vector (perpendicular to radial, in direction of orbit)
    const progradeX = -radialY;
    const progradeY = radialX;

    // Decompose velocity into radial and prograde components
    const radialV = velocity.vx * radialX + velocity.vy * radialY;
    const progradeV = velocity.vx * progradeX + velocity.vy * progradeY;

    return {
        radial: radialV,      // Positive = moving away from planet
        prograde: progradeV,  // Positive = moving in orbit direction
        total: v
    };
}

// ============================================
// ISP CURVES
// ============================================

/**
 * Calculate ISP at altitude (varies with atmospheric pressure)
 * Sea level ISP is lower than vacuum ISP
 */
function getAltitudeAdjustedISP(ispASL, ispVac, altitude) {
    // ISP variation is a fundamental physics effect, but we only apply scaling in advanced mode or 
    // if the user wants realistic behavior. For now, always scale if altitude > 0.
    const atmo = getPlanetAtmosphere(altitude);
    const planet = getCurrentPlanet();

    if (!planet || planet.seaLevelPressure === 0) {
        return ispVac;
    }

    // ISP varies linearly with pressure ratio (simplified linear model)
    const pressureRatio = Math.max(0, Math.min(1, atmo.pressure / planet.seaLevelPressure));

    // In vacuum (pressureRatio -> 0), ISP -> ispVac
    // At sea level (pressureRatio -> 1), ISP -> ispASL
    return ispVac - (ispVac - ispASL) * pressureRatio;
}

/**
 * Get vacuum ISP for an engine (typically 10-20% higher than sea level)
 */
function getVacuumISP(seaLevelISP) {
    return seaLevelISP * 1.15; // 15% improvement in vacuum
}

// ============================================
// THROTTLE RESPONSE
// ============================================

/**
 * Update actual throttle with lag
 */
function updateThrottleWithLag(targetThrottle, dt) {
    if (!ADVANCED.enabled) {
        ADVANCED.engines.throttleActual = targetThrottle;
        return targetThrottle;
    }

    ADVANCED.engines.throttleTarget = targetThrottle;

    const maxChange = dt / ADV_CONST.THROTTLE_RESPONSE_TIME;
    const diff = targetThrottle - ADVANCED.engines.throttleActual;

    if (Math.abs(diff) < maxChange) {
        ADVANCED.engines.throttleActual = targetThrottle;
    } else {
        ADVANCED.engines.throttleActual += Math.sign(diff) * maxChange;
    }

    return ADVANCED.engines.throttleActual;
}

/**
 * Get actual throttle (with lag applied)
 */
function getActualThrottle() {
    // Return actual tracked throttle (which mirrors input instantly if disabled)
    // instead of hardcoded 1 which breaks manual control
    return ADVANCED.engines.throttleActual;
}

// ============================================
// ENGINE FAILURES
// ============================================

/**
 * Attempt engine ignition
 * Returns true if successful, false if failed
 */
function attemptIgnition(fuelPressure = 1.0) {
    if (!ADVANCED.enabled) return true;

    if (ADVANCED.engines.ignitionAttempted) {
        return ADVANCED.engines.ignitionSuccess;
    }

    ADVANCED.engines.ignitionAttempted = true;

    // Calculate failure chance
    let failureChance = ADV_CONST.IGNITION_BASE_FAILURE_RATE;

    // Low fuel pressure increases failure chance
    if (fuelPressure < 0.5) {
        failureChance += ADV_CONST.IGNITION_LOW_PRESSURE_PENALTY * (1 - fuelPressure * 2);
    }

    // Roll the dice
    const roll = Math.random();
    ADVANCED.engines.ignitionSuccess = roll > failureChance;

    if (!ADVANCED.engines.ignitionSuccess) {
        ADVANCED.failures.ignitionFailures++;
        console.log('⚠️ IGNITION FAILURE! (roll:', roll.toFixed(3), 'threshold:', failureChance.toFixed(3), ')');
    }

    return ADVANCED.engines.ignitionSuccess;
}

/**
 * Reset ignition state (for retry)
 */
function resetIgnition() {
    ADVANCED.engines.ignitionAttempted = false;
    ADVANCED.engines.ignitionSuccess = true;
}

/**
 * Check if engine ignition failed
 */
function hasIgnitionFailed() {
    return ADVANCED.enabled && ADVANCED.engines.ignitionAttempted && !ADVANCED.engines.ignitionSuccess;
}

// ============================================
// FUEL PUMP CAVITATION
// ============================================

/**
 * Check for fuel pump cavitation
 * Occurs when fuel pressure drops below vapor pressure
 */
function checkCavitation(tankPressure, flowRate) {
    if (!ADVANCED.enabled) {
        return { cavitating: false, efficiencyLoss: 0 };
    }

    // Simplified: tankPressure is normalized 0-1
    const actualPressure = tankPressure * 100000; // Convert to Pa
    const dynamicPressureLoss = flowRate * 1000;  // Simplified flow loss

    const effectivePressure = actualPressure - dynamicPressureLoss;

    if (effectivePressure < ADV_CONST.CAVITATION_VAPOR_PRESSURE) {
        ADVANCED.engines.cavitating = true;
        // Efficiency loss proportional to cavitation severity
        const severity = 1 - (effectivePressure / ADV_CONST.CAVITATION_VAPOR_PRESSURE);
        ADVANCED.engines.cavitationLoss = Math.min(0.5, severity * 0.3); // Max 50% loss
        ADVANCED.failures.cavitationEvents++;

        return {
            cavitating: true,
            efficiencyLoss: ADVANCED.engines.cavitationLoss
        };
    }

    ADVANCED.engines.cavitating = false;
    ADVANCED.engines.cavitationLoss = 0;
    return { cavitating: false, efficiencyLoss: 0 };
}

/**
 * Is engine currently cavitating?
 */
function isCavitating() {
    return ADVANCED.enabled && ADVANCED.engines.cavitating;
}

// ============================================
// ORBITAL STATE GETTERS
// ============================================

/**
 * Get apoapsis altitude (above surface)
 */
function getApoapsis() {
    const planet = getCurrentPlanet();
    if (!planet || !ADVANCED.orbit.semiMajorAxis) return 0; // Uninitialized
    return ADVANCED.orbit.apoapsis - planet.radius;
}

/**
 * Get periapsis altitude (above surface)
 */
function getPeriapsis() {
    const planet = getCurrentPlanet();
    if (!planet || !ADVANCED.orbit.semiMajorAxis) return 0; // Uninitialized
    return ADVANCED.orbit.periapsis - planet.radius;
}

/**
 * Get full orbital info for display
 */
/**
 * Update orbital state based on current physics
 * Called from physics.js loop
 */
function updateOrbitalState(posX, posY, velX, velY) {
    // Calculate orbital state always
    const planet = getCurrentPlanet();
    if (!planet) return;

    const position = { x: posX, y: posY };
    const velocity = { vx: velX, vy: velY };

    calculateOrbitalElements(position, velocity, planet.mu);
}

/**
 * Get advanced mode status for telemetry
 */
function getAdvancedTelemetry() {
    // Always return telemetry structure, even if advanced physics are disabled
    try {
        const orbitInfo = getOrbitalInfo() || {
            apoapsis: 0, periapsis: 0, eccentricity: 0, period: 0,
            trueAnomaly: 0, argumentOfPeriapsis: 0, meanAnomaly: 0, inclination: 0,
            isOrbital: true, isInOrbit: false, isEscaping: false,
            radialVelocity: 0, progradeVelocity: 0
        };

        return {
            throttleLag: ADVANCED.engines.throttleTarget - ADVANCED.engines.throttleActual,
            ignitionFailed: typeof hasIgnitionFailed === 'function' && hasIgnitionFailed(),
            cavitating: typeof isCavitating === 'function' && isCavitating(),
            cavitationLoss: ADVANCED.engines.cavitationLoss || 0,
            orbit: orbitInfo
        };
    } catch (e) {
        console.error("Advanced Telemetry Fatal Error:", e);
        return {
            throttleLag: 0, ignitionFailed: false, cavitating: false, cavitationLoss: 0,
            orbit: { isOrbital: true, apoapsis: 0, periapsis: 0, eccentricity: 0 }
        };
    }
}

/**
 * Get orbital info for telemetry
 */
function getOrbitalInfo() {
    const planet = getCurrentPlanet();
    if (!planet) return null;

    try {
        // Use real 2D orbital state from PHYSICS
        const velocityVector = { vx: PHYSICS.vx || 0, vy: PHYSICS.vy || 0 };
        const positionVector = { x: PHYSICS.x || 0, y: PHYSICS.y || 0 };

        const vectors = getVelocityVectors(velocityVector, positionVector);

        return {
            apoapsis: getApoapsis(),
            periapsis: getPeriapsis(),
            eccentricity: ADVANCED.orbit.eccentricity || 0,
            period: ADVANCED.orbit.orbitalPeriod || 0,
            trueAnomaly: ADVANCED.orbit.trueAnomaly || 0,
            argumentOfPeriapsis: ADVANCED.orbit.argumentOfPeriapsis || 0,
            meanAnomaly: ADVANCED.orbit.meanAnomaly || 0,
            inclination: ADVANCED.orbit.inclination || 0,
            isOrbital: true, // Always show orbital data in advanced mode
            isInOrbit: (ADVANCED.orbit.periapsis > planet.radius),
            isEscaping: (ADVANCED.orbit.eccentricity >= 1),
            radialVelocity: vectors.radial,
            progradeVelocity: vectors.prograde
        };
    } catch (e) {
        console.error("Orbital Info Calculation Error:", e);
        return null;
    }
}


console.log('🚀 Advanced physics module loaded');

// Unified Telemetry Export
// Merges basic physics data with advanced orbital data
window.getTelemetry = function () {
    // 1. Get Basic Telemetry (if available)
    let basic = {};
    if (typeof getBaseTelemetry === 'function') {
        basic = getBaseTelemetry();
    } else if (typeof PHYSICS !== 'undefined') {
        // Fallback manual construction if physics.js isn't fully loaded or updated
        // This shouldn't happen if getBaseTelemetry rename worked, but good for safety
        console.warn("getBaseTelemetry not found, using fallback.");
    }

    // 2. Get Advanced Telemetry
    const advanced = getAdvancedTelemetry();

    // 3. Merge (Advanced overwrites basic if collision, but keys should be distinct)
    return {
        ...basic,
        ...advanced,
        // Ensure orbit is always present even if advanced failed
        orbit: advanced.orbit || { isOrbital: false }
    };
};
