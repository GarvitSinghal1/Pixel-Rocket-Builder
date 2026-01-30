/**
 * PIXEL ROCKET BUILDER - Physics Engine
 * Handles rocket simulation, gravity, drag, and staging
 */

const PHYSICS = {
    // Constants
    GRAVITY: 9.81,          // m/s² at surface
    EARTH_RADIUS: 6371000,  // meters
    ATMOSPHERE_HEIGHT: 100000, // meters (Karman line)
    AIR_DENSITY_SEA: 1.225, // kg/m³

    // Simulation state
    rocket: null,
    isRunning: false,
    isPaused: false,
    time: 0,
    throttle: 1.0,

    // Position and velocity
    altitude: 0,
    velocity: 0,
    acceleration: 0,

    // Max values for results
    maxAltitude: 0,
    maxVelocity: 0,

    // Fuel
    fuel: 0,
    maxFuel: 0,

    // Stage tracking
    currentStage: 0,
    stages: []
};

/**
 * Initialize physics for a rocket
 */
function initPhysics(placedParts) {
    PHYSICS.rocket = placedParts;
    PHYSICS.isRunning = false;
    PHYSICS.isPaused = false;
    PHYSICS.time = 0;
    PHYSICS.throttle = 1.0;

    PHYSICS.altitude = 0;
    PHYSICS.velocity = 0;
    PHYSICS.acceleration = 0;
    PHYSICS.maxAltitude = 0;
    PHYSICS.maxVelocity = 0;

    // Calculate total fuel
    PHYSICS.maxFuel = calculateTotalFuel(placedParts);
    PHYSICS.fuel = PHYSICS.maxFuel;

    // Detect stages (separated by decouplers)
    PHYSICS.stages = detectStages(placedParts);
    PHYSICS.currentStage = 0;
}

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

    // Fuel mass (assume 1 unit = 1 kg for simplicity)
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
    const thrust = calculateTotalThrust(parts) * 1000; // Convert kN to N
    const weight = mass * PHYSICS.GRAVITY;

    if (weight === 0) return 0;
    return thrust / weight;
}

/**
 * Calculate Delta-V
 */
function calculateDeltaV(parts) {
    const dryMass = parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + partDef.mass;
    }, 0);

    const fuelCapacity = calculateTotalFuel(parts);
    const wetMass = dryMass + fuelCapacity;

    if (dryMass === 0 || wetMass === 0) return 0;

    // Average ISP of engines
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
 * Estimate maximum altitude (simplified)
 */
function estimateAltitude(parts) {
    const deltaV = calculateDeltaV(parts);
    const twr = calculateTWR(parts);

    if (twr <= 1) return 0;

    // Simplified altitude estimation
    // Real calculation would integrate the trajectory
    const effectiveVelocity = deltaV * 0.7; // Account for gravity losses

    // v² = 2gh (ignoring drag for estimate)
    return (effectiveVelocity * effectiveVelocity) / (2 * PHYSICS.GRAVITY);
}

/**
 * Calculate fuel efficiency
 */
function calculateEfficiency(parts) {
    const thrust = calculateTotalThrust(parts);
    const consumption = calculateFuelConsumption(parts);

    if (consumption === 0) return 0;

    // Thrust per unit fuel consumed
    const efficiency = thrust / consumption;

    // Normalize to percentage (max efficiency ~20)
    return Math.min(100, (efficiency / 20) * 100);
}

/**
 * Detect stages based on decoupler placement
 */
function detectStages(parts) {
    // Simple stage detection - parts below decouplers are stage 0
    // Parts above are higher stages
    // For now, treat everything as one stage
    return [parts];
}

/**
 * Get current gravity at altitude
 */
function getGravity(altitude) {
    const r = PHYSICS.EARTH_RADIUS + altitude;
    return PHYSICS.GRAVITY * Math.pow(PHYSICS.EARTH_RADIUS / r, 2);
}

/**
 * Get air density at altitude (exponential atmosphere)
 */
function getAirDensity(altitude) {
    if (altitude >= PHYSICS.ATMOSPHERE_HEIGHT) return 0;

    // Scale height ~8500m for Earth
    const scaleHeight = 8500;
    return PHYSICS.AIR_DENSITY_SEA * Math.exp(-altitude / scaleHeight);
}

/**
 * Calculate drag force
 */
function calculateDrag(velocity, altitude, parts) {
    const density = getAirDensity(altitude);
    if (density === 0) return 0;

    // Estimate cross-sectional area from parts
    let maxWidth = 0;
    parts.forEach(p => {
        const partDef = getPartById(p.partId);
        maxWidth = Math.max(maxWidth, partDef.width);
    });

    // Area in m² (assume 1 tile = 1m)
    const area = maxWidth * maxWidth * 0.5;

    // Drag coefficient (simplified)
    let cd = 0.5;

    // Check for nose cone
    const hasNoseCone = parts.some(p => p.partId === 'nose_cone');
    if (hasNoseCone) cd *= 0.5;

    // Check for fairing
    const hasFairing = parts.some(p => p.partId === 'fairing');
    if (hasFairing) cd *= 0.7;

    // Drag force: 0.5 * ρ * v² * Cd * A
    return 0.5 * density * velocity * velocity * cd * area;
}

/**
 * Physics simulation step
 */
function physicsStep(dt) {
    if (!PHYSICS.isRunning || PHYSICS.isPaused) return;

    const parts = PHYSICS.stages[PHYSICS.currentStage] || [];
    if (parts.length === 0) {
        PHYSICS.isRunning = false;
        return;
    }

    // Current mass
    const mass = calculateTotalMass(parts, PHYSICS.fuel);

    // Thrust (only if we have fuel)
    let thrustForce = 0;
    if (PHYSICS.fuel > 0) {
        thrustForce = calculateTotalThrust(parts) * 1000 * PHYSICS.throttle; // kN to N

        // Consume fuel
        const consumption = calculateFuelConsumption(parts) * PHYSICS.throttle * dt;
        PHYSICS.fuel = Math.max(0, PHYSICS.fuel - consumption);
    }

    // Gravity
    const gravity = getGravity(PHYSICS.altitude);
    const gravityForce = mass * gravity;

    // Drag
    const dragForce = PHYSICS.velocity > 0 ? calculateDrag(PHYSICS.velocity, PHYSICS.altitude, parts) : 0;

    // Net force
    const netForce = thrustForce - gravityForce - dragForce;

    // Acceleration
    PHYSICS.acceleration = netForce / mass;

    // Update velocity
    PHYSICS.velocity += PHYSICS.acceleration * dt;

    // Update altitude
    PHYSICS.altitude += PHYSICS.velocity * dt;

    // Track max values
    PHYSICS.maxAltitude = Math.max(PHYSICS.maxAltitude, PHYSICS.altitude);
    PHYSICS.maxVelocity = Math.max(PHYSICS.maxVelocity, Math.abs(PHYSICS.velocity));

    // Check for crash
    if (PHYSICS.altitude < 0) {
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
        // Recalculate fuel for remaining stages
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
    const fuelEfficiency = (1 - PHYSICS.fuel / PHYSICS.maxFuel) * 100;

    let stars = 0;
    if (altitudeReached) stars++;
    if (PHYSICS.fuel > PHYSICS.maxFuel * 0.05) stars++; // Fuel remaining bonus
    if (PHYSICS.maxAltitude > targetAltitude * 1.5) stars++; // Exceeded target

    return {
        success: altitudeReached,
        maxAltitude: PHYSICS.maxAltitude,
        maxVelocity: PHYSICS.maxVelocity,
        flightTime: PHYSICS.time,
        fuelUsed: fuelEfficiency,
        fuelRemaining: (PHYSICS.fuel / PHYSICS.maxFuel) * 100,
        stars: stars
    };
}
