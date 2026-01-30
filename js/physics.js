/**
 * PIXEL ROCKET BUILDER - Advanced Physics Engine
 * Educational-grade rocket simulation for teaching aerospace engineering
 * 
 * Features:
 * - Realistic atmospheric model (ISA)
 * - Mach-dependent aerodynamic drag
 * - Aerodynamic heating
 * - Multiple failure conditions
 * - Accurate gravity model
 */

const PHYSICS = {
    // ============================================
    // PHYSICAL CONSTANTS
    // ============================================

    // Gravity & Earth
    GRAVITY: 9.80665,           // m/s² standard gravity
    EARTH_RADIUS: 6371000,      // meters
    EARTH_MASS: 5.972e24,       // kg

    // Atmosphere (ISA - International Standard Atmosphere)
    ATMOSPHERE_HEIGHT: 100000,  // meters (Karman line)
    SEA_LEVEL_PRESSURE: 101325, // Pa
    SEA_LEVEL_TEMP: 288.15,     // K (15°C)
    SEA_LEVEL_DENSITY: 1.225,   // kg/m³
    TEMP_LAPSE_RATE: 0.0065,    // K/m in troposphere
    TROPOPAUSE_ALT: 11000,      // m - where temp stops decreasing
    TROPOPAUSE_TEMP: 216.65,    // K at tropopause

    // Gas properties
    MOLAR_MASS_AIR: 0.0289644,  // kg/mol
    GAS_CONSTANT: 8.31447,      // J/(mol·K)
    SPECIFIC_GAS_CONSTANT: 287.058, // J/(kg·K) for dry air
    SPECIFIC_HEAT_RATIO: 1.4,   // γ (gamma) for air

    // ============================================
    // FAILURE THRESHOLDS
    // ============================================
    MAX_Q_LIMIT: 35000,         // Pa - typical structural limit
    MAX_G_LIMIT: 10,            // g - structural/crew limit
    MAX_TEMP_LIMIT: 1500,       // K - material thermal limit
    MAX_LANDING_VELOCITY: 10,   // m/s - safe touchdown speed

    // ============================================
    // SIMULATION STATE
    // ============================================
    rocket: null,
    isRunning: false,
    isPaused: false,
    time: 0,
    throttle: 1.0,

    // Position and motion
    altitude: 0,
    velocity: 0,
    acceleration: 0,

    // Atmospheric conditions
    airDensity: 1.225,
    airPressure: 101325,
    airTemperature: 288.15,
    speedOfSound: 340.3,
    machNumber: 0,

    // Forces (in Newtons)
    thrustForce: 0,
    gravityForce: 0,
    dragForce: 0,
    netForce: 0,

    // Critical parameters for failure detection
    dynamicPressure: 0,         // Q (Pa)
    gForce: 0,                  // Current g-force
    surfaceTemperature: 288.15, // K - hull temperature
    heatFlux: 0,                // W/m²

    // Drag parameters
    dragCoefficient: 0.5,
    crossSectionalArea: 1,

    // Max values for results
    maxAltitude: 0,
    maxVelocity: 0,
    maxQ: 0,
    maxG: 0,
    maxTemp: 0,

    // Fuel
    fuel: 0,
    maxFuel: 0,

    // Stage tracking
    currentStage: 0,
    stages: [],

    // Failure state
    hasFailed: false,
    failureReason: null,
    failureMessage: null
};

// ============================================
// ATMOSPHERIC MODEL (ISA)
// ============================================

/**
 * Get temperature at altitude using ISA model
 * @param {number} altitude - Altitude in meters
 * @returns {number} Temperature in Kelvin
 */
function getTemperature(altitude) {
    if (altitude < 0) altitude = 0;

    if (altitude <= PHYSICS.TROPOPAUSE_ALT) {
        // Troposphere: temperature decreases linearly
        return PHYSICS.SEA_LEVEL_TEMP - PHYSICS.TEMP_LAPSE_RATE * altitude;
    } else if (altitude <= 20000) {
        // Lower stratosphere: isothermal
        return PHYSICS.TROPOPAUSE_TEMP;
    } else if (altitude <= 32000) {
        // Upper stratosphere: temperature increases
        return PHYSICS.TROPOPAUSE_TEMP + 0.001 * (altitude - 20000);
    } else if (altitude <= PHYSICS.ATMOSPHERE_HEIGHT) {
        // Mesosphere and above: continues to vary
        return 228.65 + 0.0028 * (altitude - 32000);
    }

    // Above atmosphere
    return 2.7; // Cosmic background temperature
}

/**
 * Get air pressure at altitude using barometric formula
 * @param {number} altitude - Altitude in meters
 * @returns {number} Pressure in Pascals
 */
function getPressure(altitude) {
    if (altitude < 0) altitude = 0;
    if (altitude >= PHYSICS.ATMOSPHERE_HEIGHT) return 0;

    if (altitude <= PHYSICS.TROPOPAUSE_ALT) {
        // Troposphere: use barometric formula with lapse rate
        const temp = getTemperature(altitude);
        const exponent = PHYSICS.GRAVITY * PHYSICS.MOLAR_MASS_AIR /
            (PHYSICS.GAS_CONSTANT * PHYSICS.TEMP_LAPSE_RATE);
        return PHYSICS.SEA_LEVEL_PRESSURE * Math.pow(temp / PHYSICS.SEA_LEVEL_TEMP, exponent);
    } else {
        // Above tropopause: use exponential approximation
        const tropopausePressure = getPressure(PHYSICS.TROPOPAUSE_ALT);
        const scaleHeight = PHYSICS.SPECIFIC_GAS_CONSTANT * PHYSICS.TROPOPAUSE_TEMP / PHYSICS.GRAVITY;
        return tropopausePressure * Math.exp(-(altitude - PHYSICS.TROPOPAUSE_ALT) / scaleHeight);
    }
}

/**
 * Get air density at altitude using ideal gas law
 * @param {number} altitude - Altitude in meters
 * @returns {number} Density in kg/m³
 */
function getAirDensity(altitude) {
    if (altitude >= PHYSICS.ATMOSPHERE_HEIGHT) return 0;

    const pressure = getPressure(altitude);
    const temperature = getTemperature(altitude);

    // Ideal gas law: ρ = P / (R_specific * T)
    return pressure / (PHYSICS.SPECIFIC_GAS_CONSTANT * temperature);
}

/**
 * Get speed of sound at altitude
 * @param {number} altitude - Altitude in meters
 * @returns {number} Speed of sound in m/s
 */
function getSpeedOfSound(altitude) {
    const temperature = getTemperature(altitude);
    // a = sqrt(γ * R_specific * T)
    return Math.sqrt(PHYSICS.SPECIFIC_HEAT_RATIO * PHYSICS.SPECIFIC_GAS_CONSTANT * temperature);
}

/**
 * Get current gravity at altitude (inverse square law)
 * @param {number} altitude - Altitude in meters
 * @returns {number} Gravity in m/s²
 */
function getGravity(altitude) {
    const r = PHYSICS.EARTH_RADIUS + altitude;
    return PHYSICS.GRAVITY * Math.pow(PHYSICS.EARTH_RADIUS / r, 2);
}

// ============================================
// AERODYNAMIC CALCULATIONS
// ============================================

/**
 * Get drag coefficient based on Mach number
 * Models subsonic, transonic, and supersonic regimes
 * @param {number} mach - Mach number
 * @param {boolean} hasNoseCone - Whether rocket has nose cone
 * @param {boolean} hasFairing - Whether rocket has fairing
 * @returns {number} Drag coefficient
 */
function getDragCoefficient(mach, hasNoseCone, hasFairing) {
    let baseCd;

    if (mach < 0.8) {
        // Subsonic: relatively constant
        baseCd = 0.4;
    } else if (mach < 1.0) {
        // Transonic rise (approaching sound barrier)
        baseCd = 0.4 + 0.8 * Math.pow((mach - 0.8) / 0.2, 2);
    } else if (mach < 1.2) {
        // Transonic peak (passing through sound barrier)
        baseCd = 1.2 - 0.4 * (mach - 1.0) / 0.2;
    } else if (mach < 5.0) {
        // Supersonic: decreases with Mach
        baseCd = 0.8 / Math.sqrt(mach);
    } else {
        // Hypersonic
        baseCd = 0.35;
    }

    // Nose cone reduces drag significantly
    if (hasNoseCone) {
        baseCd *= 0.5; // 50% reduction
    }

    // Fairing provides additional streamlining
    if (hasFairing) {
        baseCd *= 0.7; // 30% reduction
    }

    return baseCd;
}

/**
 * Calculate drag force
 * F_drag = 0.5 * ρ * v² * Cd * A
 */
function calculateDrag(velocity, altitude, parts) {
    const density = getAirDensity(altitude);
    if (density === 0 || velocity === 0) return 0;

    // Calculate cross-sectional area from widest part
    let maxWidth = 0;
    parts.forEach(p => {
        const partDef = getPartById(p.partId);
        maxWidth = Math.max(maxWidth, partDef.width);
    });

    // Area in m² (1 tile = 1m, circular cross-section approximation)
    const area = Math.PI * Math.pow(maxWidth * 0.5, 2);
    PHYSICS.crossSectionalArea = area;

    // Check for aerodynamic parts
    const hasNoseCone = parts.some(p => p.partId === 'nose_cone');
    const hasFairing = parts.some(p => p.partId === 'fairing');

    // Get Mach number
    const speedOfSound = getSpeedOfSound(altitude);
    const mach = Math.abs(velocity) / speedOfSound;
    PHYSICS.machNumber = mach;
    PHYSICS.speedOfSound = speedOfSound;

    // Get Mach-dependent drag coefficient
    const cd = getDragCoefficient(mach, hasNoseCone, hasFairing);
    PHYSICS.dragCoefficient = cd;

    // Drag force: F = 0.5 * ρ * v² * Cd * A
    // Direction opposes velocity
    const dragMagnitude = 0.5 * density * velocity * velocity * cd * area;
    return velocity > 0 ? dragMagnitude : -dragMagnitude;
}

/**
 * Calculate dynamic pressure (Q)
 * Q = 0.5 * ρ * v²
 */
function calculateDynamicPressure(velocity, altitude) {
    const density = getAirDensity(altitude);
    return 0.5 * density * velocity * velocity;
}

// ============================================
// AERODYNAMIC HEATING
// ============================================

/**
 * Calculate aerodynamic heating effects
 * @param {number} velocity - Velocity in m/s
 * @param {number} altitude - Altitude in meters
 * @returns {object} Heating parameters
 */
function calculateAerodynamicHeating(velocity, altitude) {
    const density = getAirDensity(altitude);
    const ambientTemp = getTemperature(altitude);
    const speedOfSound = getSpeedOfSound(altitude);
    const mach = Math.abs(velocity) / speedOfSound;

    // Stagnation temperature (temperature at stagnation point)
    // T_stag = T_ambient * (1 + (γ-1)/2 * M²)
    const recoveryFactor = 0.9; // Typical for turbulent boundary layer
    const gamma = PHYSICS.SPECIFIC_HEAT_RATIO;
    const stagnationTemp = ambientTemp * (1 + recoveryFactor * (gamma - 1) / 2 * mach * mach);

    // Heat flux (simplified Sutton-Graves correlation for stagnation point)
    // q = C * sqrt(ρ/r_n) * v³
    const noseRadius = 0.5; // Assume 0.5m nose radius
    const heatFlux = 1.83e-4 * Math.sqrt(density / noseRadius) * Math.pow(Math.abs(velocity), 3);

    return {
        stagnationTemp: stagnationTemp,
        heatFlux: heatFlux,
        mach: mach
    };
}

/**
 * Update surface temperature based on heating
 * Simple thermal model with heating and radiation cooling
 */
function updateSurfaceTemperature(dt) {
    const heating = calculateAerodynamicHeating(PHYSICS.velocity, PHYSICS.altitude);
    PHYSICS.heatFlux = heating.heatFlux;

    // Thermal mass model (simplified)
    const thermalMass = 10000; // J/K - effective thermal capacity
    const emissivity = 0.8;
    const stefanBoltzmann = 5.67e-8;
    const surfaceArea = PHYSICS.crossSectionalArea * 4; // Approximate total surface

    // Radiative cooling: P_rad = ε * σ * A * T⁴
    const radiativeCooling = emissivity * stefanBoltzmann * surfaceArea *
        Math.pow(PHYSICS.surfaceTemperature, 4);

    // Net heat rate
    const heatIn = heating.heatFlux * PHYSICS.crossSectionalArea;
    const netHeatRate = heatIn - radiativeCooling;

    // Temperature change
    const dT = (netHeatRate / thermalMass) * dt;
    PHYSICS.surfaceTemperature += dT;

    // Minimum temperature is ambient
    const ambientTemp = getTemperature(PHYSICS.altitude);
    PHYSICS.surfaceTemperature = Math.max(ambientTemp, PHYSICS.surfaceTemperature);
}

// ============================================
// FAILURE CONDITIONS
// ============================================

/**
 * Check all failure conditions
 * @returns {object} Failure status and reason
 */
function checkFailureConditions() {
    // Max Q - structural failure from aerodynamic pressure
    if (PHYSICS.dynamicPressure > PHYSICS.MAX_Q_LIMIT) {
        return {
            failed: true,
            reason: 'MAX_Q',
            message: `STRUCTURAL FAILURE: Max Q exceeded! (${(PHYSICS.dynamicPressure / 1000).toFixed(1)} kPa > ${PHYSICS.MAX_Q_LIMIT / 1000} kPa limit)`
        };
    }

    // G-force limit - structural failure from acceleration
    if (Math.abs(PHYSICS.gForce) > PHYSICS.MAX_G_LIMIT) {
        return {
            failed: true,
            reason: 'G_FORCE',
            message: `STRUCTURAL FAILURE: G-force limit exceeded! (${PHYSICS.gForce.toFixed(1)}g > ${PHYSICS.MAX_G_LIMIT}g limit)`
        };
    }

    // Thermal failure - overheating
    if (PHYSICS.surfaceTemperature > PHYSICS.MAX_TEMP_LIMIT) {
        return {
            failed: true,
            reason: 'THERMAL',
            message: `THERMAL FAILURE: Hull overheated! (${PHYSICS.surfaceTemperature.toFixed(0)}K > ${PHYSICS.MAX_TEMP_LIMIT}K limit)`
        };
    }

    // Hard landing - crash on impact
    if (PHYSICS.altitude <= 0 && Math.abs(PHYSICS.velocity) > PHYSICS.MAX_LANDING_VELOCITY) {
        return {
            failed: true,
            reason: 'IMPACT',
            message: `CRASH: Impact velocity too high! (${Math.abs(PHYSICS.velocity).toFixed(1)} m/s > ${PHYSICS.MAX_LANDING_VELOCITY} m/s safe limit)`
        };
    }

    return { failed: false };
}

// ============================================
// ROCKET CALCULATIONS
// ============================================

/**
 * Calculate total fuel capacity
 */
function calculateTotalFuel(parts) {
    return parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + (partDef.fuelCapacity || 0);
    }, 0);
}

/**
 * Calculate total mass (dry + fuel)
 */
function calculateTotalMass(parts, currentFuel) {
    const dryMass = parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + partDef.mass;
    }, 0);

    // Fuel mass (1 unit = 1 kg)
    return dryMass + currentFuel;
}

/**
 * Calculate total thrust from active engines
 */
function calculateTotalThrust(parts) {
    return parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + (partDef.thrust || 0);
    }, 0);
}

/**
 * Calculate fuel consumption rate
 */
function calculateFuelConsumption(parts) {
    return parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + (partDef.fuelConsumption || 0);
    }, 0);
}

/**
 * Calculate Thrust-to-Weight Ratio
 */
function calculateTWR(parts, fuel = null) {
    if (fuel === null) {
        fuel = calculateTotalFuel(parts);
    }
    const mass = calculateTotalMass(parts, fuel);
    const thrust = calculateTotalThrust(parts) * 1000; // kN to N
    const weight = mass * PHYSICS.GRAVITY;

    if (weight === 0) return 0;
    return thrust / weight;
}

/**
 * Calculate Delta-V using Tsiolkovsky rocket equation
 * ΔV = Isp * g₀ * ln(m_wet / m_dry)
 */
function calculateDeltaV(parts) {
    const dryMass = parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + partDef.mass;
    }, 0);

    const fuelCapacity = calculateTotalFuel(parts);
    const wetMass = dryMass + fuelCapacity;

    if (dryMass === 0 || wetMass === 0) return 0;

    // Get average ISP of engines
    const engines = parts.filter(p => {
        const partDef = getPartById(p.partId);
        return partDef.category === 'engines';
    });

    if (engines.length === 0) return 0;

    const avgIsp = engines.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + partDef.isp;
    }, 0) / engines.length;

    // Tsiolkovsky rocket equation
    return avgIsp * PHYSICS.GRAVITY * Math.log(wetMass / dryMass);
}

/**
 * Estimate maximum altitude
 */
function estimateAltitude(parts) {
    const deltaV = calculateDeltaV(parts);
    const twr = calculateTWR(parts);

    if (twr <= 1) return 0;

    // Account for gravity losses (roughly 1500 m/s for Earth)
    const gravityLoss = 1500;
    const effectiveVelocity = Math.max(0, deltaV - gravityLoss);

    // Kinematic equation: h = v² / (2g)
    return (effectiveVelocity * effectiveVelocity) / (2 * PHYSICS.GRAVITY);
}

/**
 * Calculate fuel efficiency
 */
function calculateEfficiency(parts) {
    const thrust = calculateTotalThrust(parts);
    const consumption = calculateFuelConsumption(parts);

    if (consumption === 0) return 0;

    const efficiency = thrust / consumption;
    return Math.min(100, (efficiency / 20) * 100);
}

/**
 * Detect stages based on decoupler placement
 */
function detectStages(parts) {
    // Simple: treat all as one stage for now
    return [parts];
}

// ============================================
// PHYSICS SIMULATION
// ============================================

/**
 * Initialize physics for a rocket
 */
function initPhysics(placedParts) {
    PHYSICS.rocket = placedParts;
    PHYSICS.isRunning = false;
    PHYSICS.isPaused = false;
    PHYSICS.time = 0;
    PHYSICS.throttle = 1.0;

    // Reset motion
    PHYSICS.altitude = 0;
    PHYSICS.velocity = 0;
    PHYSICS.acceleration = 0;

    // Reset atmospheric
    PHYSICS.airDensity = PHYSICS.SEA_LEVEL_DENSITY;
    PHYSICS.airPressure = PHYSICS.SEA_LEVEL_PRESSURE;
    PHYSICS.airTemperature = PHYSICS.SEA_LEVEL_TEMP;
    PHYSICS.speedOfSound = 340.3;
    PHYSICS.machNumber = 0;

    // Reset forces
    PHYSICS.thrustForce = 0;
    PHYSICS.gravityForce = 0;
    PHYSICS.dragForce = 0;
    PHYSICS.netForce = 0;

    // Reset critical parameters
    PHYSICS.dynamicPressure = 0;
    PHYSICS.gForce = 0;
    PHYSICS.surfaceTemperature = PHYSICS.SEA_LEVEL_TEMP;
    PHYSICS.heatFlux = 0;

    // Reset max tracking
    PHYSICS.maxAltitude = 0;
    PHYSICS.maxVelocity = 0;
    PHYSICS.maxQ = 0;
    PHYSICS.maxG = 0;
    PHYSICS.maxTemp = 0;

    // Fuel
    PHYSICS.maxFuel = calculateTotalFuel(placedParts);
    PHYSICS.fuel = PHYSICS.maxFuel;

    // Stages
    PHYSICS.stages = detectStages(placedParts);
    PHYSICS.currentStage = 0;

    // Reset failure state
    PHYSICS.hasFailed = false;
    PHYSICS.failureReason = null;
    PHYSICS.failureMessage = null;
}

/**
 * Main physics simulation step
 * @param {number} dt - Time step in seconds
 */
function physicsStep(dt) {
    if (!PHYSICS.isRunning || PHYSICS.isPaused || PHYSICS.hasFailed) return;

    const parts = PHYSICS.stages[PHYSICS.currentStage] || [];
    if (parts.length === 0) {
        PHYSICS.isRunning = false;
        return;
    }

    // ============================================
    // UPDATE ATMOSPHERIC CONDITIONS
    // ============================================
    PHYSICS.airTemperature = getTemperature(PHYSICS.altitude);
    PHYSICS.airPressure = getPressure(PHYSICS.altitude);
    PHYSICS.airDensity = getAirDensity(PHYSICS.altitude);
    PHYSICS.speedOfSound = getSpeedOfSound(PHYSICS.altitude);
    PHYSICS.machNumber = PHYSICS.speedOfSound > 0 ?
        Math.abs(PHYSICS.velocity) / PHYSICS.speedOfSound : 0;

    // ============================================
    // CALCULATE FORCES
    // ============================================

    // Current mass
    const mass = calculateTotalMass(parts, PHYSICS.fuel);

    // Thrust force (only if we have fuel)
    PHYSICS.thrustForce = 0;
    if (PHYSICS.fuel > 0 && PHYSICS.throttle > 0) {
        PHYSICS.thrustForce = calculateTotalThrust(parts) * 1000 * PHYSICS.throttle; // kN to N

        // Consume fuel
        const consumption = calculateFuelConsumption(parts) * PHYSICS.throttle * dt;
        PHYSICS.fuel = Math.max(0, PHYSICS.fuel - consumption);
    }

    // Gravity force
    const gravity = getGravity(PHYSICS.altitude);
    PHYSICS.gravityForce = mass * gravity;

    // Drag force
    PHYSICS.dragForce = calculateDrag(PHYSICS.velocity, PHYSICS.altitude, parts);

    // Net force (thrust up, gravity and drag oppose motion)
    PHYSICS.netForce = PHYSICS.thrustForce - PHYSICS.gravityForce;
    if (PHYSICS.velocity > 0) {
        PHYSICS.netForce -= PHYSICS.dragForce;
    } else {
        PHYSICS.netForce += Math.abs(PHYSICS.dragForce);
    }

    // ============================================
    // UPDATE MOTION
    // ============================================

    // Acceleration
    PHYSICS.acceleration = PHYSICS.netForce / mass;
    PHYSICS.gForce = PHYSICS.acceleration / PHYSICS.GRAVITY;

    // Velocity (Euler integration)
    PHYSICS.velocity += PHYSICS.acceleration * dt;

    // Altitude
    PHYSICS.altitude += PHYSICS.velocity * dt;

    // ============================================
    // UPDATE CRITICAL PARAMETERS
    // ============================================

    // Dynamic pressure
    PHYSICS.dynamicPressure = calculateDynamicPressure(PHYSICS.velocity, PHYSICS.altitude);

    // Surface temperature from aerodynamic heating
    updateSurfaceTemperature(dt);

    // ============================================
    // TRACK MAXIMUM VALUES
    // ============================================
    PHYSICS.maxAltitude = Math.max(PHYSICS.maxAltitude, PHYSICS.altitude);
    PHYSICS.maxVelocity = Math.max(PHYSICS.maxVelocity, Math.abs(PHYSICS.velocity));
    PHYSICS.maxQ = Math.max(PHYSICS.maxQ, PHYSICS.dynamicPressure);
    PHYSICS.maxG = Math.max(PHYSICS.maxG, Math.abs(PHYSICS.gForce));
    PHYSICS.maxTemp = Math.max(PHYSICS.maxTemp, PHYSICS.surfaceTemperature);

    // ============================================
    // CHECK FAILURE CONDITIONS
    // ============================================
    const failureCheck = checkFailureConditions();
    if (failureCheck.failed) {
        PHYSICS.hasFailed = true;
        PHYSICS.failureReason = failureCheck.reason;
        PHYSICS.failureMessage = failureCheck.message;
        PHYSICS.isRunning = false;
        return;
    }

    // ============================================
    // CHECK FOR LANDING/CRASH
    // ============================================
    if (PHYSICS.altitude <= 0) {
        PHYSICS.altitude = 0;
        PHYSICS.velocity = 0;
        PHYSICS.isRunning = false;
    }

    // Update time
    PHYSICS.time += dt;
}

/**
 * Start simulation
 */
function startSimulation(placedParts) {
    initPhysics(placedParts);
    PHYSICS.isRunning = true;
}

/**
 * Stop simulation
 */
function stopSimulation() {
    PHYSICS.isRunning = false;
}

/**
 * Pause/resume simulation
 */
function togglePause() {
    PHYSICS.isPaused = !PHYSICS.isPaused;
}

/**
 * Set throttle (0-1)
 */
function setThrottle(value) {
    PHYSICS.throttle = Math.max(0, Math.min(1, value));
}

/**
 * Trigger staging
 */
function triggerStage() {
    if (PHYSICS.currentStage < PHYSICS.stages.length - 1) {
        PHYSICS.currentStage++;
        const remainingParts = PHYSICS.stages.slice(PHYSICS.currentStage).flat();
        PHYSICS.maxFuel = calculateTotalFuel(remainingParts);
        PHYSICS.fuel = PHYSICS.maxFuel;
        return true;
    }
    return false;
}

/**
 * Get flight results
 */
function getFlightResults(targetAltitude = 10000) {
    const altitudeReached = PHYSICS.maxAltitude >= targetAltitude;
    const fuelEfficiency = PHYSICS.maxFuel > 0 ?
        (1 - PHYSICS.fuel / PHYSICS.maxFuel) * 100 : 0;

    let stars = 0;
    if (altitudeReached && !PHYSICS.hasFailed) stars++;
    if (PHYSICS.fuel > PHYSICS.maxFuel * 0.05 && !PHYSICS.hasFailed) stars++;
    if (PHYSICS.maxAltitude > targetAltitude * 1.5 && !PHYSICS.hasFailed) stars++;

    return {
        success: altitudeReached && !PHYSICS.hasFailed,
        failed: PHYSICS.hasFailed,
        failureReason: PHYSICS.failureReason,
        failureMessage: PHYSICS.failureMessage,
        maxAltitude: PHYSICS.maxAltitude,
        maxVelocity: PHYSICS.maxVelocity,
        maxQ: PHYSICS.maxQ,
        maxG: PHYSICS.maxG,
        maxTemp: PHYSICS.maxTemp,
        flightTime: PHYSICS.time,
        fuelUsed: fuelEfficiency,
        fuelRemaining: PHYSICS.maxFuel > 0 ? (PHYSICS.fuel / PHYSICS.maxFuel) * 100 : 0,
        stars: stars
    };
}

/**
 * Get current telemetry data for display
 */
function getTelemetry() {
    return {
        altitude: PHYSICS.altitude,
        velocity: PHYSICS.velocity,
        acceleration: PHYSICS.acceleration,
        gForce: PHYSICS.gForce,
        machNumber: PHYSICS.machNumber,
        dynamicPressure: PHYSICS.dynamicPressure,
        surfaceTemp: PHYSICS.surfaceTemperature,
        airDensity: PHYSICS.airDensity,
        airPressure: PHYSICS.airPressure,
        airTemp: PHYSICS.airTemperature,
        throttle: PHYSICS.throttle,
        fuel: PHYSICS.fuel,
        maxFuel: PHYSICS.maxFuel,
        time: PHYSICS.time,
        // Warning levels (0 = safe, 1 = caution, 2 = danger)
        warnings: {
            q: PHYSICS.dynamicPressure > PHYSICS.MAX_Q_LIMIT * 0.9 ? 2 :
                PHYSICS.dynamicPressure > PHYSICS.MAX_Q_LIMIT * 0.7 ? 1 : 0,
            g: Math.abs(PHYSICS.gForce) > PHYSICS.MAX_G_LIMIT * 0.9 ? 2 :
                Math.abs(PHYSICS.gForce) > PHYSICS.MAX_G_LIMIT * 0.7 ? 1 : 0,
            temp: PHYSICS.surfaceTemperature > PHYSICS.MAX_TEMP_LIMIT * 0.9 ? 2 :
                PHYSICS.surfaceTemperature > PHYSICS.MAX_TEMP_LIMIT * 0.7 ? 1 : 0
        }
    };
}
