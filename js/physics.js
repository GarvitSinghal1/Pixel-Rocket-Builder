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
    failureMessage: null,

    // Liftoff tracking
    hasLiftedOff: false,

    /**
     * Reset physics state
     */
    reset: function () {
        this.isRunning = false;
        this.isPaused = false;
        this.time = 0;
        this.throttle = 1.0;
        this.altitude = 0;
        this.x = 0; // Relative to planet center (on surface: rotation * radius)
        this.y = 0; // Relative to planet center (on surface: radius)
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0; // Radians, 0 is vertical UP (relative to local surface)
        this.velocity = 0;
        this.acceleration = 0;
        this.airDensity = 1.225;
        this.airPressure = 101325;
        this.airTemperature = 288.15;
        this.speedOfSound = 340.3;
        this.machNumber = 0;
        this.thrustForce = 0;
        this.gravityForce = 0;
        this.dragForce = 0;
        this.netForce = 0;
        this.dynamicPressure = 0;
        this.gForce = 0;
        this.surfaceTemperature = 288.15;
        this.heatFlux = 0;
        this.maxAltitude = 0;
        this.maxVelocity = 0;
        this.maxQ = 0;
        this.maxG = 0;
        this.maxTemp = 0;
        this.fuel = 0;
        this.maxFuel = 0;
        this.activeFuel = 0;
        this.activeMaxFuel = 0;
        this.currentStage = 0;
        this.stages = [];
        this.hasFailed = false;
        this.failureReason = null;
        this.failureMessage = null;
        this.hasLiftedOff = false;
        this.rocket = null;

        console.log("Physics reset.");
    }
};

// ============================================
// ATMOSPHERIC MODEL (ISA)
// ============================================

/**
 * Get temperature at altitude using ISA model
 * @param {number} altitude - Altitude in meters
 * @returns {number} Temperature in Kelvin
 */
// ============================================
// ATMOSPHERIC MODEL (Delegated to planets.js)
// ============================================

/**
 * Get temperature at altitude
 * @param {number} altitude - Altitude in meters
 * @returns {number} Temperature in Kelvin
 */
function getTemperature(altitude) {
    if (typeof getPlanetAtmosphere === 'function') {
        return getPlanetAtmosphere(altitude).temperature;
    }
    // Fallback (Earth ISA)
    if (altitude < 0) altitude = 0;
    if (altitude <= 11000) return 288.15 - 0.0065 * altitude;
    return 216.65;
}

/**
 * Get air pressure at altitude
 * @param {number} altitude - Altitude in meters
 * @returns {number} Pressure in Pascals
 */
function getPressure(altitude) {
    if (typeof getPlanetAtmosphere === 'function') {
        return getPlanetAtmosphere(altitude).pressure;
    }
    // Fallback: Earth Isothermal Model (Scale Height ~7400m)
    // P = P0 * e^(-h/H)
    return 101325 * Math.exp(-Math.max(0, altitude) / 7400);
}

/**
 * Get air density at altitude
 * @param {number} altitude - Altitude in meters
 * @returns {number} Density in kg/m³
 */
function getAirDensity(altitude) {
    if (typeof getPlanetAtmosphere === 'function') {
        return getPlanetAtmosphere(altitude).density;
    }
    // Fallback: Earth Isothermal Model
    // rho = rho0 * e^(-h/H)
    return 1.225 * Math.exp(-Math.max(0, altitude) / 7400);
}

/**
 * Get speed of sound at altitude
 * @param {number} altitude - Altitude in meters
 * @returns {number} Speed of sound in m/s
 */
function getSpeedOfSound(altitude) {
    if (typeof getPlanetAtmosphere === 'function') {
        return getPlanetAtmosphere(altitude).speedOfSound;
    }
    return 340.3;
}

/**
 * Get current gravity at altitude (inverse square law)
 * @param {number} altitude - Altitude in meters
 * @returns {number} Gravity in m/s²
 */
function getGravity(altitude) {
    if (typeof getGravityAtAltitude === 'function') {
        return getGravityAtAltitude(altitude);
    }
    // Fallback if planets.js logic fails
    const r = PHYSICS.EARTH_RADIUS + altitude;
    return PHYSICS.GRAVITY * Math.pow(PHYSICS.EARTH_RADIUS / r, 2);
}

// ============================================
// AERODYNAMIC CALCULATIONS
// ============================================

/**
 * Calculate drag coefficient based on Mach number
 * @param {number} mach - Mach number
 * @param {number} maxDragReduction - Maximum drag reduction factor (0-1) from parts
 * @returns {number} Drag Coefficient (Cd)
 */
function getDragCoefficient(mach, maxDragReduction = 0) {
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
        // Match value at Mach 1.2: 1.2 - 0.4(1) = 0.8
        // Curve: k / sqrt(M). At M=1.2, k/sqrt(1.2) = 0.8 -> k = 0.8 * 1.0954 = ~0.876
        baseCd = 0.876 / Math.sqrt(mach);
    } else {
        // Hypersonic
        baseCd = 0.35;
    }

    // Drag Reduction is now handled per-stack in calculateDrag() and should not be global multiplier
    /*
    if (maxDragReduction > 0) {
        baseCd *= (1 - maxDragReduction);
    }
    */

    return baseCd;
}

/**
 * Calculate drag force
 * F_drag = 0.5 * ρ * v² * Cd * A
 */
function calculateDrag(velocity, altitude, parts) {
    const density = getAirDensity(altitude);
    if (density === 0 || velocity === 0) return 0;

    // FIXED: Calculate projected area of all stacks (e.g. core + boosters)
    // 1. Collect all X intervals [start, end] in pixels
    const tileSize = (typeof TILE_SIZE !== 'undefined' ? TILE_SIZE : 32);
    const intervals = [];
    parts.forEach(p => {
        const partDef = getPartById(p.partId);
        if (!partDef) return;

        // Use part width in pixels
        const widthPx = (partDef.width || 1) * tileSize;
        const start = p.x;
        const end = p.x + widthPx;
        intervals.push({ start, end });
    });

    // 2. Sort and merge intervals to find independent stacks
    intervals.sort((a, b) => a.start - b.start);
    const merged = [];
    if (intervals.length > 0) {
        let current = intervals[0];
        for (let i = 1; i < intervals.length; i++) {
            const next = intervals[i];
            if (next.start <= current.end + 1) { // Allow 1px overlap/slop
                current.end = Math.max(current.end, next.end);
            } else {
                merged.push(current);
                current = next;
            }
        }
        merged.push(current);
    }

    // 3. Sum areas of each stack
    let totalArea = 0;
    merged.forEach(interval => {
        const widthPx = interval.end - interval.start;
        const widthMeters = widthPx / tileSize;

        let area;
        if (widthMeters <= 2.5) {
            // Small objects: treat as circular (Aerodynamic)
            const radius = widthMeters * 0.5;
            area = Math.PI * radius * radius;
        } else {
            // Wide objects: treat as slab (Linear scaling)
            // Use blended depth to match circular area at 2.5m width
            // Area(2.5) = PI * 1.25^2 = 4.9087
            // Depth = Area / Width = 4.9087 / 2.5 = 1.9635
            const effectiveDepth = 1.9635;
            area = widthMeters * effectiveDepth;
        }
        totalArea += area;
    });

    // Check for aerodynamic parts (nose cones) at the TOP of each stack
    // Enhanced Logic: Calculate "Aerodynamic Area" vs "Blunt Area"

    // Helper to find checking occlusion
    const isOccluded = (part) => {
        const pDef = getPartById(part.partId);
        const pLeft = part.x + 1;
        const pRight = part.x + (pDef.width * tileSize) - 1;

        return parts.some(other => {
            if (other === part) return false;
            const oDef = getPartById(other.partId);
            const oLeft = other.x;
            const oRight = other.x + (oDef.width * tileSize);

            // Check horizontal overlap
            if (pRight < oLeft || pLeft > oRight) return false;

            // Check vertical occlusion (other must be ABOVE current)
            // In canvas, Y=0 is top. Flow comes from top (negative Y relative to rocket).
            // A part is occluded if there is a part with SAME X and LOWER Y.
            return (other.y < part.y) && (Math.max(pLeft, oLeft) < Math.min(pRight, oRight));
        });
    };

    let weightedDragReduction = 0;
    let exposedTotalArea = 0;

    parts.forEach(p => {
        const def = getPartById(p.partId);
        if (!isOccluded(p)) {
            // This part is exposed to the front
            const w = (def.width * tileSize) / tileSize;
            // Area contribution (using the same wide-body logic as above)
            const partArea = (w <= 2.5) ? (Math.PI * w * w * 0.25) : (w * 2.0);

            exposedTotalArea += partArea;

            if (def.dragReduction > 0) {
                weightedDragReduction += (def.dragReduction * partArea);
            }
        }
    });

    // If we have no exposed parts (weird?), fallback to merged area
    if (exposedTotalArea === 0) {
        exposedTotalArea = totalArea;
    }

    PHYSICS.crossSectionalArea = exposedTotalArea;

    let globalReductionFactor = 0;
    if (exposedTotalArea > 0) {
        globalReductionFactor = weightedDragReduction / exposedTotalArea;
    }

    // Get Mach number
    const speedOfSound = getSpeedOfSound(altitude);
    // Handle vacuum (speedOfSound = 0)
    const mach = (speedOfSound > 0.1) ? Math.abs(velocity) / speedOfSound : 0;
    PHYSICS.machNumber = mach;
    PHYSICS.speedOfSound = speedOfSound;

    // Get Mach-dependent drag coefficient
    const cd = getDragCoefficient(mach, globalReductionFactor);
    PHYSICS.dragCoefficient = cd;

    // Drag force: F = 0.5 * ρ * v² * Cd * A
    // Direction opposes velocity
    const dragMagnitude = 0.5 * density * velocity * velocity * cd * PHYSICS.crossSectionalArea;
    return velocity > 0 ? -dragMagnitude : dragMagnitude;
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
    // Handle vacuum (speedOfSound = 0)
    const mach = (speedOfSound > 0.1) ? Math.abs(velocity) / speedOfSound : 0;

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

    // Thermal mass model
    // Aluminum specific heat ~900 J/(kg·K)
    // Fuel (RP-1/LOX) specific heat ~2000 J/(kg·K)
    let thermalMass = 900000; // Default fallback

    if (typeof calculateTotalMass === 'function' && PHYSICS.rocket) {
        const totalMass = calculateTotalMass(PHYSICS.rocket, PHYSICS.fuel);
        const fuelMass = PHYSICS.fuel;
        const dryMass = Math.max(0, totalMass - fuelMass);

        thermalMass = (dryMass * 900) + (fuelMass * 2000);
    }
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

    // Advanced: Ignition Failure
    if (typeof hasIgnitionFailed === 'function' && hasIgnitionFailed()) {
        return {
            failed: true,
            reason: 'IGNITION',
            message: 'CRITICAL FAILURE: Engine Ignition Failed!'
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
 * Calculate current remaining fuel
 */
function calculateCurrentFuel(parts) {
    return parts.reduce((total, p) => {
        return total + (p.currentFuel || 0);
    }, 0);
}

/**
 * Calculate fuel for the active stage (reachable from active engines)
 */
function calculateActiveFuelStats(parts) {
    // 1. Identify active engines in the current part list
    const activeEngines = parts.filter(p => {
        const def = getPartById(p.partId);
        return def.category === 'engines';
    });

    if (activeEngines.length === 0) return { current: 0, capacity: 0 };

    // 2. BFS to find all reachable fuel tanks from all engines
    const reachableTanks = new Set();
    const visited = new Set();
    const queue = [];

    // Seed BFS with all active engines
    activeEngines.forEach(eng => {
        queue.push(eng);
        visited.add(eng.id);
    });

    while (queue.length > 0) {
        const current = queue.shift();
        const currentDef = getPartById(current.partId);

        if (currentDef.category === 'fuel') {
            reachableTanks.add(current);
        }

        // Stop at decouplers (don't pull fuel FROM above a decoupler)
        if (currentDef.isDecoupler && !activeEngines.includes(current)) {
            continue;
        }

        // Neighbors
        for (const other of parts) {
            if (visited.has(other.id)) continue;
            if (arePartsConnected(current, currentDef, other)) {
                visited.add(other.id);
                queue.push(other);
            }
        }
    }

    // 3. Sum up stats for reachable tanks
    let currentTotal = 0;
    let capacityTotal = 0;
    reachableTanks.forEach(tank => {
        const def = getPartById(tank.partId);
        currentTotal += (tank.currentFuel || 0);
        capacityTotal += (def.fuelCapacity || 0);
    });

    return { current: currentTotal, capacity: capacityTotal };
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
function calculateTotalThrust(parts, throttle = 1.0) {
    return parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        return total + ((partDef.thrust || 0) * throttle);
    }, 0);
}

/**
 * Calculate fuel consumption rate
 */
function calculateFuelConsumption(parts) {
    return parts.reduce((total, p) => {
        const partDef = getPartById(p.partId);
        // Only engines consume fuel
        if (partDef.category === 'engines') {
            const ispVac = partDef.ispVac || (partDef.isp * 1.15) || 280;
            // m_dot = Thrust / (Isp * g0)
            const thrustN = (partDef.thrust || 0) * 1000;
            const consumption = thrustN / (ispVac * PHYSICS.GRAVITY);
            return total + consumption;
        }
        return total;
    }, 0);
}

/**
 * Calculate Thrust-to-Weight Ratio
 */
function calculateTWR(parts, fuel = null, throttle = 1.0) {
    if (fuel === null) {
        fuel = calculateTotalFuel(parts);
    }
    const mass = calculateTotalMass(parts, fuel);
    const thrust = calculateTotalThrust(parts, throttle) * 1000; // kN to N

    // Use surface gravity of current planet for TWR check (launch capability)
    // TWR = Thrust / Weight
    // Weight = Mass * Gravity
    const planet = typeof getCurrentPlanet === 'function' ? getCurrentPlanet() : { surfaceGravity: PHYSICS.GRAVITY };

    // FIXED: Use surface gravity ALWAYS for TWR. 
    // TWR is a reference metric relative to planetary surface gravity.
    // In orbit, "Weight" is zero, so local TWR would be infinite.
    // For actual acceleration, we use F/m. TWR is F/(m*g0).
    const localGravity = planet.surfaceGravity;
    /*
    if (PHYSICS.isRunning && typeof getGravity === 'function') {
        localGravity = getGravity(PHYSICS.altitude);
    }
    */

    const weight = mass * localGravity;

    if (weight === 0) return 0;
    return thrust / weight;
}

/**
 * Get all fuel tanks reachable from an engine without passing through a decoupler
 */
function getReachableFuelTanks(root, allParts) {
    const reachableTanks = [];
    const visited = new Set();
    const queue = [root];
    visited.add(root.id);

    while (queue.length > 0) {
        const current = queue.shift();
        const currentDef = getPartById(current.partId);

        // If this part is a fuel tank (or booster with fuel), add to list
        if (currentDef.fuelCapacity > 0 && current.currentFuel > 0) {
            reachableTanks.push(current);
        }

        // If this part is a decoupler, we DO NOT pass through it
        // However, we can pull FROM a decoupler if it's the root (unlikely for fuel)
        // or if we just reached it. But we don't explore PAST it.
        if (currentDef.isDecoupler && current.id !== root.id) {
            continue;
        }

        // Check neighbors
        for (const other of allParts) {
            if (visited.has(other.id)) continue;

            if (arePartsConnected(current, currentDef, other)) {
                visited.add(other.id);
                queue.push(other);
            }
        }
    }

    return reachableTanks;
}

/**
 * Consume fuel from active tanks and return produced thrust
 */
function consumeFuelAndGetThrust(parts, dt, throttle) {
    if (throttle <= 0) return 0;

    // Advanced: Ignition Check
    if (typeof attemptIgnition === 'function') {
        const fuelPressure = PHYSICS.maxFuel > 0 ? (PHYSICS.fuel / PHYSICS.maxFuel) : 0;
        const ignitionSuccess = attemptIgnition(fuelPressure);
        if (!ignitionSuccess) return 0;
    }

    // 1. Identify engines
    const engines = [];
    parts.forEach(p => {
        const def = getPartById(p.partId);
        if (def.category === 'engines') {
            engines.push({ part: p, def: def });
        }
    });

    if (engines.length === 0) return 0;

    let totalThrust = 0;

    // 2. Process each engine
    engines.forEach(engine => {
        const ispASL = engine.def.ispASL || engine.def.isp || 250;
        const ispVac = engine.def.ispVac || (ispASL * 1.15);
        const thrustN = engine.def.thrust * 1000;

        let currentISP = ispASL;
        if (typeof getAltitudeAdjustedISP === 'function') {
            currentISP = getAltitudeAdjustedISP(ispASL, ispVac, PHYSICS.altitude);
        }

        // FIXED: Use Vacuum ISP for constant mass flow (Fuel consumption shouldn't drop in vacuum)
        const consumptionRate = thrustN / (ispVac * PHYSICS.GRAVITY);
        const fuelNeeded = consumptionRate * throttle * dt;

        // 3. Identify reachable tanks for THIS engine
        const activeTanks = getReachableFuelTanks(engine.part, parts);

        if (activeTanks.length === 0) {
            return; // Flameout for this engine
        }

        // 4. Drain fuel (Equal distribution)
        const drawPerTank = fuelNeeded / activeTanks.length;
        let fuelObtained = 0;

        activeTanks.forEach(tank => {
            const amountToTake = Math.min(tank.currentFuel, drawPerTank);
            tank.currentFuel -= amountToTake;
            fuelObtained += amountToTake;
        });

        // 5. Calculate Thrust based on fuel obtained
        const efficiency = fuelObtained / fuelNeeded;
        if (efficiency > 0.1) {
            let thrustMultiplier = efficiency; // Scale thrust by fuel available

            // ISP effect on thrust: F = m_dot * Isp * g
            // Since m_dot is constant (consumptionRate), thrust scales linearly with ISP
            // We scale relative to Vacuum ISP since consumption is based on that
            thrustMultiplier *= (currentISP / ispVac);

            // Advanced: Cavitation Check
            if (typeof checkCavitation === 'function') {
                const tankPressure = PHYSICS.maxFuel > 0 ? (PHYSICS.fuel / PHYSICS.maxFuel) : 0;
                const cavResult = checkCavitation(tankPressure, throttle);
                if (cavResult.cavitating) {
                    thrustMultiplier *= (1 - cavResult.efficiencyLoss);
                }
            }

            totalThrust += (thrustN * throttle * thrustMultiplier);
        }
    });

    return totalThrust;
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

    // FIXED: Use current fuel for flight delta-V
    let fuelMass = 0;
    // Check if parts have state (flight) or are definitions (editor)
    const hasFuelState = parts.some(p => typeof p.currentFuel !== 'undefined');

    if (hasFuelState) {
        fuelMass = calculateCurrentFuel(parts);
    } else {
        fuelMass = calculateTotalFuel(parts);
    }

    const wetMass = dryMass + fuelMass;

    if (dryMass === 0 || wetMass === 0) return 0;

    // Get average ISP of engines
    const engines = parts.filter(p => {
        const partDef = getPartById(p.partId);
        return partDef.category === 'engines';
    });

    if (engines.length === 0) return 0;

    // Calculate Thrust-Weighted Harmonic Mean ISP
    // Formula: Sum(Thrust) / Sum(Thrust / ISP)
    let totalThrust = 0;
    let totalFlowRate = 0; // Proportional to Thrust/ISP

    engines.forEach(p => {
        const partDef = getPartById(p.partId);
        // Assuming max thrust for delta-v calc
        const thrust = partDef.thrust;
        totalThrust += thrust;
        if (partDef.isp > 0) {
            totalFlowRate += thrust / partDef.isp;
        }
    });

    if (totalFlowRate === 0) return 0;

    const avgIsp = totalThrust / totalFlowRate;

    // Tsiolkovsky rocket equation
    // NOTE: This assumes all engines and fuel are in a single stage (parallel burn).
    // For multi-stage rockets, this is an approximation that underestimates total Delta-V.
    return avgIsp * PHYSICS.GRAVITY * Math.log(wetMass / dryMass);
}

/**
 * Estimate maximum altitude
 * Uses dynamic gravity loss based on TWR and Planet Gravity
 */
function estimateAltitude(parts) {
    const deltaV = calculateDeltaV(parts);
    const twr = calculateTWR(parts);

    // Get current planet gravity
    const planet = typeof getCurrentPlanet === 'function' ? getCurrentPlanet() : { surfaceGravity: PHYSICS.GRAVITY };
    const g = planet.surfaceGravity;

    if (twr <= 1) return 0;

    // Gravity Loss Approximation:
    // Faster acceleration (high TWR) means less time fighting gravity.
    // V_loss ≈ DeltaV / TWR
    const gravityLoss = deltaV / twr;

    // Atmospheric Drag approximation (roughly 10% for Earth, less for Mars)
    const dragLoss = (planet.hasAtmosphere) ? deltaV * 0.1 : 0;

    const effectiveVelocity = Math.max(0, deltaV - gravityLoss - dragLoss);

    // Kinematic equation: h = v² / (2g)
    return (effectiveVelocity * effectiveVelocity) / (2 * g);
}

/**
 * Calculate fuel efficiency
 */
/**
 * Calculate Average ISP (Weighted by Thrust)
 * Combined ISP = Total Thrust / (Total Mass Flow * g0)
 */
function calculateAverageISP(parts) {
    const thrustN = calculateTotalThrust(parts) * 1000; // kN -> N
    const massFlow = calculateFuelConsumption(parts); // kg/s

    if (massFlow === 0 || thrustN === 0) return 0;

    // Isp = F / (m_dot * g0)
    // Use Standard Gravity (9.80665) for ISP definition
    const g0 = PHYSICS.GRAVITY;
    return Math.round(thrustN / (massFlow * g0));
}

/**
 * Detect stages based on decoupler placement
 */

/**
 * Detect stages based on decoupler placement (Bottom-Up)
 * Analyzes connectivity graph to determine what drops when decouplers fire.
 */
function detectStages(parts) {
    if (!parts || parts.length === 0) return [];

    console.log(`[Staging] Analyzing ${parts.length} parts...`);

    // 1. Identify Root Part (Capsule or Probe)
    const rootPart = findRootPart(parts);
    if (!rootPart) {
        console.warn("[Staging] No root part found!");
        return [parts];
    }
    console.log(`[Staging] Root part found: ${rootPart.partId} at ${rootPart.y}`);

    // 2. Identify and Group Decouplers
    const decouplers = parts.filter(p => {
        const def = getPartById(p.partId);
        return def && def.isDecoupler;
    });

    console.log(`[Staging] Found ${decouplers.length} decouplers.`);

    if (decouplers.length === 0) {
        return [parts]; // Single stage
    }

    // Group decouplers by Y level (tolerance 5px) to fire together
    const groups = {};
    decouplers.forEach(d => {
        // Round Y to nearest 10px to group
        const yLevel = Math.round(d.y / 10) * 10;
        if (!groups[yLevel]) groups[yLevel] = [];
        groups[yLevel].push(d);
    });

    const sortedLevels = Object.keys(groups).sort((a, b) => parseFloat(b) - parseFloat(a));
    console.log(`[Staging] Decoupler levels: ${sortedLevels.join(', ')}`);

    const stages = [];

    // 3. Simulate Staging Sequence
    let currentParts = [...parts];

    // Stage 0: The full rocket
    stages.push(currentParts);

    sortedLevels.forEach((level, index) => {
        const groupDecouplers = groups[level];
        const groupIds = new Set(groupDecouplers.map(d => d.id));

        console.log(`[Staging] Loop #${index} (Level ${level}): Input parts ${currentParts.length}`);
        console.log(`[Staging] Firing level ${level} with ${groupDecouplers.length} decouplers.`);

        let nextStageParts = getConnectedParts(rootPart, currentParts, groupIds);

        // Fallback: Check if Struts are bypassing the decoupler
        // If separation didn't happen, force break any struts that cross the decoupler line
        if (nextStageParts.length === currentParts.length) {
            console.log(`[Staging] Staging blocked. Attempting to break crossing struts...`);

            const struts = currentParts.filter(p => p.partId === 'strut');
            // Find struts that are "crossing" the decoupler level
            // A crossing strut has Y < level < Y+H (roughly) or connects parts across the level
            // Simple heuristic: If a strut exists, and we are staging, assume struts CROSSING the cut line should break.

            const crossingStruts = struts.filter(s => {
                // Check if strut essentially overlaps the decoupler Y plane
                // Level is the center Y of the decoupler group
                // Strut top
                const sTop = s.y;
                // Strut bottom
                const sBot = s.y + 32; // 1 tile assumed

                // If the strut is reasonably close to the cut line, break it
                // Level is roughly the Y coordinate of the cut
                return Math.abs(s.y - level) < 60; // 60px tolerance (approx 2 tiles)
            });

            if (crossingStruts.length > 0) {
                console.log(`[Staging] Breaking ${crossingStruts.length} struts crossing level ${level}`);
                const ignoreWithStruts = new Set([...groupIds, ...crossingStruts.map(s => s.id)]);
                const nextStageNoStruts = getConnectedParts(rootPart, currentParts, ignoreWithStruts);

                if (nextStageNoStruts.length < currentParts.length) {
                    console.log(`[Staging] Success! Breaking struts allowed staging.`);
                    nextStageParts = nextStageNoStruts;
                }
            }
        }

        // Fallback 2: Geometric Force (RESTORED)
        // If physical separation failed, force a geometric cut.
        // This handles cases where parts are "glued" by side-attachments that the graph doesn't handle well.
        if (nextStageParts.length === currentParts.length) {
            console.warn(`[Staging] Physical staging failed. Forcing Geometric Cut at Y=${level}`);

            // Keep parts ABOVE the decoupler (y < level)
            // Allow a small tolerance (e.g. 10px) to include the decoupler itself or adjacent parts
            nextStageParts = currentParts.filter(p => {
                // Keep if above the cut line (with slight buffer)
                // Also always keep the root part to ensure we track the main ship
                if (p.id === rootPart.id) return true;
                return p.y < level + 16; // 16px = half a tile tolerance
            });

            console.log(`[Staging] Geometric Cut Result: ${nextStageParts.length} parts (Prev: ${currentParts.length})`);
        }

        console.log(`[Staging] Result: ${nextStageParts.length} parts (Prev: ${currentParts.length})`);

        if (nextStageParts.length < currentParts.length) {
            stages.push(nextStageParts);
            currentParts = nextStageParts;
            console.log(`[Staging] Stage pushed. New currentParts count: ${currentParts.length}`);
        } else {
            console.warn(`[Staging] Warning: Decoupler fired but nothing dropped? Check for overlapping parts.`);
        }
    });

    console.log(`[Staging] Final stages count: ${stages.length}`);
    return stages;
}

/**
 * Find the primary control part (Root)
 */
function findRootPart(parts) {
    // Priority: Crew Capsule > Probe > Any Payload > Topmost Part
    let root = parts.find(p => {
        const def = getPartById(p.partId);
        return def && def.id === 'crew_capsule';
    });
    if (root) return root;

    root = parts.find(p => {
        const def = getPartById(p.partId);
        return def && def.category === 'payload';
    });
    if (root) return root;

    // Fallback: Top-most part (lowest Y)
    return parts.reduce((highest, p) => p.y < highest.y ? p : highest, parts[0]);
}

/**
 * Get all parts connected to root, utilizing BFS
 * @param {object} root - Starting part
 * @param {array} allParts - Universe of valid parts
 * @param {Set} ignoredPartIds - Parts to treat as non-existent (fired decouplers)
 */
function getConnectedParts(root, allParts, ignoredPartIds = new Set()) {
    // Debug log to trace input size
    if (allParts.length > 20) {
        // Avoid spamming if huge, but here we expect small
    }
    // console.log(`[Physics] getConnectedParts: Input ${allParts.length}, Root: ${root.partId}`);

    const connected = new Set();
    const queue = [root];
    connected.add(root.id);

    // Build adjacency map for performance
    // Only map parts present in allParts
    const validIds = new Set(allParts.map(p => p.id));

    while (queue.length > 0) {
        const current = queue.shift();
        const currentDef = getPartById(current.partId);

        // Check against all other parts
        for (const other of allParts) {
            if (connected.has(other.id)) continue;
            if (ignoredPartIds.has(other.id)) continue; // Treat fired decoupler as void
            if (!validIds.has(other.id)) continue;

            if (arePartsConnected(current, currentDef, other)) {
                connected.add(other.id);
                queue.push(other);
            }
        }
    }

    const result = allParts.filter(p => connected.has(p.id));
    // console.log(`[Physics] getConnectedParts: Returning ${result.length}`);
    return result;
    return result;
}

/**
 * Check if two parts are physically connected
 */
function arePartsConnected(partA, defA, partB) {
    const defB = getPartById(partB.partId);
    if (!defA || !defB) return false;

    // Bounding boxes with slight tolerance for "touching"
    const BUFFER = 2; // Reduced from 5 to prevent false positives with side-by-side gap parts

    const aLeft = partA.x;
    const aRight = partA.x + defA.width * TILE_SIZE;
    const aTop = partA.y;
    const aBottom = partA.y + defA.height * TILE_SIZE;

    const bLeft = partB.x;
    const bRight = partB.x + defB.width * TILE_SIZE;
    const bTop = partB.y;
    const bBottom = partB.y + defB.height * TILE_SIZE;

    // Axis-Aligned Bounding Box intersection/touch check
    // We expand A by BUFFER to see if it touches B
    return !(
        aRight + BUFFER < bLeft ||
        aLeft - BUFFER > bRight ||
        aBottom + BUFFER < bTop ||
        aTop - BUFFER > bBottom
    );
}

// ============================================
// PHYSICS SIMULATION
// ============================================

/**
 * Initialize physics for a rocket
 */
function initPhysics(placedParts) {
    // Initialize fuel for each tank
    placedParts.forEach(p => {
        const def = getPartById(p.partId);
        if (def.fuelCapacity > 0) {
            p.currentFuel = def.fuelCapacity;
        } else {
            p.currentFuel = 0;
        }
    });

    if (typeof resetIgnition === 'function') resetIgnition();

    PHYSICS.rocket = placedParts;
    PHYSICS.isRunning = false;
    PHYSICS.isPaused = false;
    PHYSICS.time = 0;
    PHYSICS.throttle = 1.0;

    // Reset motion
    const planet = getCurrentPlanet();
    PHYSICS.altitude = 0;
    PHYSICS.x = 0;
    PHYSICS.y = planet.radius; // At surface
    PHYSICS.vx = 0;
    PHYSICS.vy = 0;
    PHYSICS.rotation = 0;
    PHYSICS.velocity = 0;
    PHYSICS.acceleration = 0;

    // Reset atmospheric values using current planet (Earth/Moon/Mars)
    // We already refactored getAirDensity etc to use planets.js
    PHYSICS.airDensity = getAirDensity(0);
    PHYSICS.airPressure = getPressure(0);
    PHYSICS.airTemperature = getTemperature(0);
    PHYSICS.speedOfSound = getSpeedOfSound(0);
    PHYSICS.machNumber = 0;

    // Reset forces
    PHYSICS.thrustForce = 0;
    PHYSICS.gravityForce = 0;
    PHYSICS.dragForce = 0;
    PHYSICS.netForce = 0;

    // Reset critical parameters
    PHYSICS.dynamicPressure = 0;
    PHYSICS.gForce = 0;
    PHYSICS.surfaceTemperature = getTemperature(0); // Start at ambient temp
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
    PHYSICS.activeFuel = 0;
    PHYSICS.activeMaxFuel = 0;

    // Stages
    PHYSICS.stages = detectStages(placedParts);
    PHYSICS.currentStage = 0;

    // Reset failure state
    PHYSICS.hasFailed = false;
    PHYSICS.failureReason = null;
    PHYSICS.failureMessage = null;
    PHYSICS.hasLiftedOff = false;
}

/**
 * Calculate forces and return acceleration vector [ax, ay]
 */
function getAcceleration2D(posX, posY, velX, velY, mass, thrustForce, rotation, parts) {
    const planet = getCurrentPlanet();
    const distSq = posX * posX + posY * posY;
    const dist = Math.sqrt(distSq);
    const altitude = dist - planet.radius;

    // 1. Gravity (Direction towards center (0,0))
    const gMagnitude = planet.mu / distSq;
    const gx = -(posX / dist) * gMagnitude;
    const gy = -(posY / dist) * gMagnitude;

    // 2. Thrust (Direction along rotation)
    const posAngle = Math.atan2(posY, posX);
    const globalThrustAngle = posAngle + rotation;

    const tx = Math.cos(globalThrustAngle) * (thrustForce / mass);
    const ty = Math.sin(globalThrustAngle) * (thrustForce / mass);

    // 3. Drag (Direction opposite to velocity)
    const vMagSq = velX * velX + velY * velY;
    const vMag = Math.sqrt(vMagSq);
    let dx = 0, dy = 0;

    if (vMag > 0.1 && altitude < (planet.atmosphereHeight || 100000)) {
        const dragMag = calculateDrag(vMag, altitude, parts);
        const dragAccel = dragMag / mass;
        dx = (velX / vMag) * dragAccel;
        dy = (velY / vMag) * dragAccel;
    }

    return { ax: gx + tx + dx, ay: gy + ty + dy, gx, gy, dx, dy };
}

/**
 * Perform RK4 integration for 2D vectors
 */
function integrateRK4(state, dt, mass, thrustForce, rotation, parts) {
    const { x, y, vx, vy } = state;

    // k1
    const a1 = getAcceleration2D(x, y, vx, vy, mass, thrustForce, rotation, parts);
    const v1x = vx, v1y = vy;

    // k2
    const x2 = x + v1x * 0.5 * dt;
    const y2 = y + v1y * 0.5 * dt;
    const vx2 = vx + a1.ax * 0.5 * dt;
    const vy2 = vy + a1.ay * 0.5 * dt;
    const a2 = getAcceleration2D(x2, y2, vx2, vy2, mass, thrustForce, rotation, parts);

    // k3
    const x3 = x + vx2 * 0.5 * dt;
    const y3 = y + vy2 * 0.5 * dt;
    const vx3 = vx + a2.ax * 0.5 * dt;
    const vy3 = vy + a2.ay * 0.5 * dt;
    const a3 = getAcceleration2D(x3, y3, vx3, vy3, mass, thrustForce, rotation, parts);

    // k4
    const x4 = x + vx3 * dt;
    const y4 = y + vy3 * dt;
    const vx4 = vx + a3.ax * dt;
    const vy4 = vy + a3.ay * dt;
    const a4 = getAcceleration2D(x4, y4, vx4, vy4, mass, thrustForce, rotation, parts);

    // Weighted Average
    const finalX = x + (dt / 6) * (v1x + 2 * vx2 + 2 * vx3 + vx4);
    const finalY = y + (dt / 6) * (v1y + 2 * vy2 + 2 * vy3 + vy4);
    const finalVX = vx + (dt / 6) * (a1.ax + 2 * a2.ax + 2 * a3.ax + a4.ax);
    const finalVY = vy + (dt / 6) * (a1.ay + 2 * a2.ay + 2 * a3.ay + a4.ay);

    const planet = getCurrentPlanet();
    const finalDist = Math.sqrt(finalX * finalX + finalY * finalY);

    return {
        x: finalX,
        y: finalY,
        vx: finalVX,
        vy: finalVY,
        altitude: finalDist - planet.radius,
        velocity: Math.sqrt(finalVX * finalVX + finalVY * finalVY),
        acceleration: Math.sqrt(a1.ax * a1.ax + a1.ay * a1.ay),
        dragForce: Math.sqrt(a1.dx * a1.dx + a1.dy * a1.dy) * mass,
        gravityForce: Math.sqrt(a1.gx * a1.gx + a1.gy * a1.gy) * mass
    };
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
    // CALCULATE FORCES & INTEGRATE
    // ============================================

    // Current mass (assumed constant for this micro-step)
    const mass = calculateTotalMass(parts, PHYSICS.fuel);

    // Thrust force
    PHYSICS.thrustForce = 0;

    // Update total fuel for UI
    PHYSICS.fuel = calculateCurrentFuel(parts);

    // Advanced: Update Throttle Lag
    if (typeof updateThrottleWithLag === 'function') {
        updateThrottleWithLag(PHYSICS.throttle, dt);
    }

    // Use actual throttle (lagged) if available, otherwise raw input
    const effectiveThrottle = (typeof getActualThrottle === 'function')
        ? getActualThrottle()
        : PHYSICS.throttle;

    if (PHYSICS.fuel > 0 && effectiveThrottle > 0) {
        // Calculate thrust and consume fuel
        PHYSICS.thrustForce = consumeFuelAndGetThrust(parts, dt, effectiveThrottle);
        // Fuel consumption (Total)
        if (PHYSICS.thrustForce > 0) {
            PHYSICS.fuel = calculateCurrentFuel(parts);

            // Update active fuel stats
            const activeStats = calculateActiveFuelStats(parts);
            PHYSICS.activeFuel = activeStats.current;
            PHYSICS.activeMaxFuel = activeStats.capacity;
        } else {
            // Still update active stats even if not thrusting (for UI while drifting)
            const activeStats = calculateActiveFuelStats(parts);
            PHYSICS.activeFuel = activeStats.current;
            PHYSICS.activeMaxFuel = activeStats.capacity;
        }
    } else {
        // If not thrusting, still update total fuel and active fuel stats
        PHYSICS.fuel = calculateCurrentFuel(parts);
        const activeStats = calculateActiveFuelStats(parts);
        PHYSICS.activeFuel = activeStats.current;
        PHYSICS.activeMaxFuel = activeStats.capacity;
    }

    // --- RK4 INTEGRATION (2D) ---
    const startState = {
        x: PHYSICS.x,
        y: PHYSICS.y,
        vx: PHYSICS.vx,
        vy: PHYSICS.vy
    };

    const result = integrateRK4(startState, dt, mass, PHYSICS.thrustForce, PHYSICS.rotation, parts);

    // Apply results
    PHYSICS.x = result.x;
    PHYSICS.y = result.y;
    PHYSICS.vx = result.vx;
    PHYSICS.vy = result.vy;
    PHYSICS.altitude = result.altitude;
    PHYSICS.velocity = result.velocity;
    PHYSICS.acceleration = result.acceleration;

    // Update forces for UI display
    PHYSICS.dragForce = result.dragForce;
    PHYSICS.gravityForce = result.gravityForce;

    // Standard 1D G-force approximation for display
    // flight G-force = (Thrust + Drag) / Weight
    // OR simpler: Total Acceleration - Gravity Component?
    // Actually, "G-Force" felt by crew is Contact Forces (Thrust + Drag) / Mass / g0
    const nonGravAccel = Math.sqrt(
        (result.acceleration * result.acceleration) + (planet.surfaceGravity * planet.surfaceGravity)
        // This is complex in 2D. Let's use Force Sum:
    );

    // Better way:
    // F_felt = F_thrust + F_drag
    // a_felt = F_felt / m
    // g_felt = a_felt / g0
    const thrustMag = PHYSICS.thrustForce;
    const dragMag = PHYSICS.dragForce;
    // Assume they are roughly collinear for simple display or vector sum them
    // Drag opposes motion, Thrust is along heading. 
    // For simple "G-meter", we just want magnitude of non-gravity forces.
    // In vector form: F_contact = F_tot - F_grav.
    // F_tot = m * a_tot. F_grav = m * g.

    // Let's use the scalar sum approximation for the UI as it's most robust
    const totalFeltForce = Math.sqrt(
        Math.pow(PHYSICS.thrustForce, 2) + Math.pow(PHYSICS.dragForce, 2)
        // This assumes orthogonality which isn't true, but decent proxy. 
        // Actually, let's just use the computed drag/thrust components from RK4 if possible, 
        // but we don't have them easily here.

        // Simpler approximation for game: 
        // G = currentAccel / G0 (classic) -> fails in orbit (shows 0g but implies 1g if stationary)
        // Space Engineers style: Gravity is NOT felt. 
        // So we want: |a_total - g_vector| / g0.
    );

    // Re-calculating proper felt Gs
    // acceleration (a_tot) = g + (thrust+drag)/m
    // felt_accel = a_tot - g = (thrust+drag)/m
    // We have PHYSICS.dragForce and PHYSICS.thrustForce scalars.
    // Use them directly.
    // We need to know if they oppose or align. 
    // Thrust is forward. Drag is backward.
    // Net felt force magnitude?
    // If Angle(v) == Angle(heading), they oppose.
    // For simple display, max Gs usually matter most during launch (aligned).
    // Let's us Vector Sum of Thrust and Drag divided by Mass.

    // We don't have the vectors stored from RK4, so let's approximate:
    // During launch, Thrust > Drag, they differ by 180 deg. 
    // FIXED: Calculate G-force via proper vector sum (accelerometer physics)
    // Thrust Vector (Aligned with rotation relative to planet surface)
    const posAngle = Math.atan2(PHYSICS.y, PHYSICS.x);
    const globalThrustAngle = posAngle + PHYSICS.rotation;

    const tX = PHYSICS.thrustForce * Math.cos(globalThrustAngle);
    const tY = PHYSICS.thrustForce * Math.sin(globalThrustAngle);

    // Drag Vector (Opposes velocity)
    const vMag = Math.sqrt(PHYSICS.vx * PHYSICS.vx + PHYSICS.vy * PHYSICS.vy);
    let dX = 0, dY = 0;
    if (vMag > 0.0001) {
        // PHYSICS.dragForce is the magnitude of drag
        dX = - (PHYSICS.vx / vMag) * PHYSICS.dragForce;
        dY = - (PHYSICS.vy / vMag) * PHYSICS.dragForce;
    }

    // Net Non-Gravitational Force Vector (F_proper)
    const fX = tX + dX;
    const fY = tY + dY;

    // G-Force = |F_proper| / mass / g0
    const fMag = Math.sqrt(fX * fX + fY * fY);
    PHYSICS.gForce = fMag / mass / PHYSICS.GRAVITY;

    // Dynamic pressure
    PHYSICS.dynamicPressure = calculateDynamicPressure(PHYSICS.velocity, PHYSICS.altitude);

    // Advanced: Update Orbital State
    if (typeof updateOrbitalState === 'function') {
        updateOrbitalState(PHYSICS.x, PHYSICS.y, PHYSICS.vx, PHYSICS.vy);
    }

    // Surface temperature
    updateSurfaceTemperature(dt);

    // Track maximum values
    PHYSICS.maxAltitude = Math.max(PHYSICS.maxAltitude, PHYSICS.altitude);
    PHYSICS.maxVelocity = Math.max(PHYSICS.maxVelocity, Math.abs(PHYSICS.velocity));
    PHYSICS.maxQ = Math.max(PHYSICS.maxQ, PHYSICS.dynamicPressure);
    PHYSICS.maxG = Math.max(PHYSICS.maxG, Math.abs(PHYSICS.gForce));
    PHYSICS.maxTemp = Math.max(PHYSICS.maxTemp, PHYSICS.surfaceTemperature);

    // Track liftoff
    if (PHYSICS.altitude > 1.0) {
        PHYSICS.hasLiftedOff = true;
    }

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
    // Calculate radial velocity (positive = moving away)
    const dist = Math.sqrt(PHYSICS.x * PHYSICS.x + PHYSICS.y * PHYSICS.y);
    const radialVel = (PHYSICS.x * PHYSICS.vx + PHYSICS.y * PHYSICS.vy) / dist;

    // Only check landing if we've actually lifted off and are now on/below ground
    if (PHYSICS.altitude <= 0 && PHYSICS.hasLiftedOff && radialVel < 0) {
        PHYSICS.altitude = 0;

        // Final velocity magnitude for impact check
        const totalVel = PHYSICS.velocity;

        // Check if it was a hard landing
        if (totalVel > PHYSICS.MAX_LANDING_VELOCITY) {
            const crash = {
                failed: true,
                reason: 'IMPACT',
                message: `CRASH: Impact velocity too high! (${totalVel.toFixed(1)} m/s > ${PHYSICS.MAX_LANDING_VELOCITY} m/s safe limit)`
            };
            PHYSICS.hasFailed = true;
            PHYSICS.failureReason = crash.reason;
            PHYSICS.failureMessage = crash.message;
        }

        PHYSICS.isRunning = false;
    } else if (PHYSICS.altitude < 0 && !PHYSICS.hasLiftedOff) {
        // Clamp to ground while on pad
        PHYSICS.altitude = 0;
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

    // Advanced: Reset ignition if throttle is cut to 0
    if (value === 0 && typeof resetIgnition === 'function') {
        resetIgnition();
    }
}

/**
 * Trigger staging
 * @returns {Object|boolean} Returns object with droppedParts if successful, false otherwise
 */
function triggerStage() {
    console.log(`[Staging] Trigger requested. Current Stage: ${PHYSICS.currentStage}, Total Stages: ${PHYSICS.stages.length}`);

    if (PHYSICS.currentStage < PHYSICS.stages.length - 1) {
        // Identify parts being dropped
        // Current active parts (before switch)
        const oldParts = PHYSICS.stages[PHYSICS.currentStage];

        PHYSICS.currentStage++;

        const newParts = PHYSICS.stages[PHYSICS.currentStage];

        console.log(`[Staging] Transitioning ${PHYSICS.currentStage - 1} -> ${PHYSICS.currentStage}`);
        console.log(`[Staging] Old Parts Count: ${oldParts ? oldParts.length : 'NULL'}`);
        console.log(`[Staging] New Parts Count: ${newParts ? newParts.length : 'NULL'}`);

        const remainingParts = newParts; // Each stage entry is complete set

        // Calculate dropped parts (Old - New)
        const newIds = new Set(newParts.map(p => p.id));
        const droppedParts = oldParts.filter(p => !newIds.has(p.id));

        console.log(`[Staging] Dropped IDs: ${droppedParts.map(p => p.id).join(', ')}`);
        console.log(`[Staging] Dropped Count: ${droppedParts.length}`);

        // Update maxFuel and cap current fuel
        const oldMaxFuel = PHYSICS.maxFuel;
        PHYSICS.maxFuel = calculateTotalFuel(remainingParts);

        // If we dropped fuel, we might need to cap the current fuel
        if (PHYSICS.fuel > PHYSICS.maxFuel) {
            console.log(`[Staging] Capping fuel: ${PHYSICS.fuel.toFixed(1)} -> ${PHYSICS.maxFuel.toFixed(1)}`);
            PHYSICS.fuel = PHYSICS.maxFuel;
        }

        // Apply Staging Impulse (Sepratrons / Decoupler Springs)
        // Add a small kick in the current forward direction
        const STAGING_IMPULSE = 5.0; // m/s

        // Advanced: Reset ignition for new stage
        if (typeof resetIgnition === 'function') {
            resetIgnition();
        }
        const posAngle = Math.atan2(PHYSICS.y, PHYSICS.x);
        const impulseAngle = posAngle + PHYSICS.rotation;

        PHYSICS.vx += Math.cos(impulseAngle) * STAGING_IMPULSE;
        PHYSICS.vy += Math.sin(impulseAngle) * STAGING_IMPULSE;
        PHYSICS.velocity = Math.sqrt(PHYSICS.vx * PHYSICS.vx + PHYSICS.vy * PHYSICS.vy);

        console.log(`[Physics] Staging Impulse applied in direction: ${impulseAngle.toFixed(2)} rad`);

        return { success: true, droppedParts: droppedParts };
    }

    console.warn("[Staging] Failed: No more stages.");
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
function getBaseTelemetry() {
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
        activeFuel: PHYSICS.activeFuel,
        activeMaxFuel: PHYSICS.activeMaxFuel,
        time: PHYSICS.time,
        currentStage: PHYSICS.currentStage,
        totalStages: (PHYSICS.stages || []).length,
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

// Default Telemetry Export (can be overridden by advanced.js)
window.getTelemetry = getBaseTelemetry;

/**
 * Get detailed failure explanation with improvement suggestions
 * @param {string} failureReason - The failure reason code
 * @returns {object} Detailed explanation with tips
 */
function getFailureExplanation(failureReason) {
    const explanations = {
        'MAX_Q': {
            title: 'Structural Failure - Max Q Exceeded',
            icon: '💨',
            whatHappened: 'Dynamic pressure (Q) exceeded the structural limits of your rocket. Q = ½ρv² represents the aerodynamic force on your rocket. At high speeds in dense atmosphere, this force tore the rocket apart.',
            physics: 'Max Q typically occurs 1-2 minutes after launch when the rocket is traveling fast but still in thick atmosphere. This is the most stressful moment for the rocket structure.',
            realWorld: 'Apollo and Space Shuttle missions carefully throttled down engines during Max Q to reduce stress. SpaceX Falcon 9 announces "Max Q" during every launch.',
            improvements: [
                'Add a nose cone to reduce drag coefficient by 50%',
                'Reduce initial throttle to 70-80% until past Max Q altitude (~12km)',
                'Add more structural parts to increase strength rating',
                'Use a fairing to streamline your payload'
            ]
        },
        'G_FORCE': {
            title: 'Structural Failure - G-Force Limit Exceeded',
            icon: '🏋️',
            whatHappened: 'Your rocket accelerated too quickly, exceeding structural and/or crew limits. The forces bent and broke the rocket frame.',
            physics: 'G-force = Acceleration / 9.80665. A thrust-to-weight ratio (TWR) of 3 means 3g acceleration at launch. Higher TWR = higher g-forces. Most rockets have TWR of 1.2-1.5 at launch.',
            realWorld: 'Astronauts experience about 3g during launch. Fighter pilots can handle up to 9g briefly. Most rocket structures are rated for 10-15g.',
            improvements: [
                'Add more fuel tanks to increase mass (lower TWR)',
                'Use a smaller/weaker engine',
                'Reduce throttle - you don\'t need maximum thrust after initial liftoff',
                'Target TWR of 1.3-2.0 for a safe ascent profile'
            ]
        },
        'THERMAL': {
            title: 'Thermal Failure - Hull Overheated',
            icon: '🔥',
            whatHappened: 'Aerodynamic heating raised your hull temperature above material limits. Air friction at hypersonic speeds generates extreme heat.',
            physics: 'Stagnation temperature: T_stag = T_ambient × (1 + 0.2 × Mach²). At Mach 5, temperatures can exceed 1000K. At Mach 10, over 2000K.',
            realWorld: 'This is why spacecraft need heat shields for reentry. The Space Shuttle used ceramic tiles rated to 1600°C. SpaceX Starship uses hexagonal heat tiles.',
            improvements: [
                'Add a heat-resistant nose cone',
                'Gain altitude before accelerating to hypersonic speeds',
                'The thinner atmosphere at high altitude = less heating',
                'Don\'t push to maximum velocity in thick atmosphere'
            ]
        },
        'IMPACT': {
            title: 'Crash Landing - Impact Too Hard',
            icon: '💥',
            whatHappened: 'Your rocket hit the ground too fast. Safe landing requires velocity under 10 m/s (about 36 km/h).',
            physics: 'Kinetic energy = ½mv². Doubling impact velocity = 4x the impact force. Even small velocity increases dramatically raise destructive force.',
            realWorld: 'SpaceX lands boosters at about 2-3 m/s. Parachutes slow capsules to about 5-8 m/s. Some early rockets crashed because they ran out of fuel before landing.',
            improvements: [
                'Save fuel for landing burns (about 10% reserve)',
                'Add parachutes or landing legs (advanced parts)',
                'Plan your ascent to coast to apogee, not powered descent',
                'Monitor fuel gauge - don\'t let it hit 0% at high altitude'
            ]
        }
    };

    return explanations[failureReason] || {
        title: 'Unknown Failure',
        icon: '❓',
        whatHappened: 'An unknown failure occurred during the mission.',
        physics: 'Unable to determine the specific physics involved.',
        realWorld: 'Space is hard - many things can go wrong!',
        improvements: ['Check all systems and try again']
    };
}

/**
 * Pre-launch analysis - Predict potential issues before launch
 * @param {Array} parts - Array of placed parts
 * @returns {object} Analysis results with warnings and suggestions
 */
function preLaunchAnalysis(parts) {
    const analysis = {
        canLaunch: true,
        overallRisk: 'LOW', // LOW, MEDIUM, HIGH, CRITICAL
        warnings: [],
        suggestions: [],
        predictions: {}
    };

    // Get rocket stats
    const twr = calculateTWR(parts);
    const deltaV = calculateDeltaV(parts);
    const totalMass = calculateTotalMass(parts, calculateTotalFuel(parts));
    const totalThrust = calculateTotalThrust(parts);
    const hasNoseCone = parts.some(p => p.partId === 'nose_cone');
    const hasFairing = parts.some(p => p.partId === 'fairing');
    const hasEngines = parts.some(p => {
        const def = getPartById(p.partId);
        return def && def.category === 'engines';
    });
    const hasFuel = calculateTotalFuel(parts) > 0;

    // Store predictions
    analysis.predictions = {
        twr: twr,
        deltaV: deltaV,
        mass: totalMass,
        thrust: totalThrust,
        hasNoseCone: hasNoseCone,
        predictedMaxG: twr, // At launch, G = TWR
        predictedMaxQ: estimateMaxQ(parts, twr, hasNoseCone)
    };

    // Critical checks - can't launch
    if (!hasEngines) {
        analysis.canLaunch = false;
        analysis.overallRisk = 'CRITICAL';
        analysis.warnings.push({
            severity: 'CRITICAL',
            icon: '🚫',
            title: 'No Engines',
            message: 'Your rocket has no engines! Add at least one engine to generate thrust.'
        });
    }

    if (!hasFuel) {
        analysis.canLaunch = false;
        analysis.overallRisk = 'CRITICAL';
        analysis.warnings.push({
            severity: 'CRITICAL',
            icon: '⛽',
            title: 'No Fuel',
            message: 'Your rocket has no fuel! Add fuel tanks to power your engines.'
        });
    }

    if (twr < 1 && hasEngines && hasFuel) {
        analysis.canLaunch = false;
        analysis.overallRisk = 'CRITICAL';
        analysis.warnings.push({
            severity: 'CRITICAL',
            icon: '⚖️',
            title: 'TWR Too Low',
            message: `TWR is ${twr.toFixed(2)} - rocket is too heavy to lift off! Need TWR > 1.0. Add more engines or remove mass.`
        });
    }

    // High risk checks
    if (twr > 5) {
        analysis.overallRisk = 'HIGH';
        analysis.warnings.push({
            severity: 'HIGH',
            icon: '🏋️',
            title: 'Extreme G-Forces Expected',
            message: `TWR of ${twr.toFixed(1)} will cause ${twr.toFixed(1)}g acceleration at launch - exceeding safe limits (10g). Reduce throttle immediately after liftoff or add mass.`,
            predictedValue: twr,
            limit: PHYSICS.MAX_G_LIMIT
        });
    } else if (twr > 3) {
        if (analysis.overallRisk !== 'HIGH') analysis.overallRisk = 'MEDIUM';
        analysis.warnings.push({
            severity: 'MEDIUM',
            icon: '⚠️',
            title: 'High G-Forces',
            message: `TWR of ${twr.toFixed(1)} will cause significant G-forces. Consider reducing throttle after initial ascent.`,
            predictedValue: twr,
            limit: PHYSICS.MAX_G_LIMIT
        });
    }

    // Max Q predictions
    const estimatedMaxQ = analysis.predictions.predictedMaxQ;
    if (estimatedMaxQ > PHYSICS.MAX_Q_LIMIT) {
        analysis.overallRisk = 'HIGH';
        analysis.warnings.push({
            severity: 'HIGH',
            icon: '💨',
            title: 'Max Q Will Exceed Limits',
            message: `Predicted Max Q of ${(estimatedMaxQ / 1000).toFixed(0)} kPa exceeds structural limit (35 kPa). Add nose cone or reduce throttle during ascent.`,
            predictedValue: estimatedMaxQ,
            limit: PHYSICS.MAX_Q_LIMIT
        });
    } else if (estimatedMaxQ > PHYSICS.MAX_Q_LIMIT * 0.7) {
        if (analysis.overallRisk === 'LOW') analysis.overallRisk = 'MEDIUM';
        analysis.warnings.push({
            severity: 'MEDIUM',
            icon: '💨',
            title: 'High Max Q Expected',
            message: `Predicted Max Q of ${(estimatedMaxQ / 1000).toFixed(0)} kPa is close to limits. Watch the Q indicator during ascent.`,
            predictedValue: estimatedMaxQ,
            limit: PHYSICS.MAX_Q_LIMIT
        });
    }

    // Suggestions for improvement
    if (!hasNoseCone) {
        analysis.suggestions.push({
            icon: '🔺',
            title: 'Add Nose Cone',
            message: 'A nose cone reduces aerodynamic drag by 50%, lowering Max Q and improving efficiency.',
            benefit: 'Reduces Max Q by ~50%'
        });
    }

    if (twr > 2 && twr < 5) {
        analysis.suggestions.push({
            icon: '🎚️',
            title: 'Use Throttle Control',
            message: 'Reduce throttle to 50-70% after clearing the launch pad to manage G-forces and Max Q.',
            benefit: 'Controls acceleration and stress'
        });
    }

    if (deltaV < 1000) {
        analysis.suggestions.push({
            icon: '⛽',
            title: 'More Delta-V Needed',
            message: `Delta-V of ${Math.round(deltaV)} m/s is low. Add more fuel or use more efficient engines for higher altitudes.`,
            benefit: 'Reach higher altitudes'
        });
    }

    if (twr > 1 && twr < 1.3) {
        analysis.suggestions.push({
            icon: '🚀',
            title: 'Low TWR',
            message: `TWR of ${twr.toFixed(2)} means slow liftoff. Consider more thrust for quicker acceleration through thick atmosphere.`,
            benefit: 'Faster ascent, less gravity loss'
        });
    }

    return analysis;
}

/**
 * Estimate maximum dynamic pressure based on rocket config
 */
function estimateMaxQ(parts, twr, hasNoseCone) {
    // Simplified Max Q estimation
    // Real Max Q depends on trajectory, but we can estimate based on TWR
    // Higher TWR = faster through dense atmosphere = higher Max Q

    const dragMultiplier = hasNoseCone ? 0.5 : 1.0;

    // Estimate velocity at ~10km (where Max Q typically occurs)
    // v ≈ sqrt(2 * (TWR-1) * g * altitude) simplified
    const estimatedVelocity = Math.sqrt(2 * (twr - 1) * PHYSICS.GRAVITY * 10000);

    // Air density at ~10km ≈ 0.4 kg/m³
    const densityAt10km = 0.4;

    // Q = 0.5 * ρ * v² * Cd
    const maxQ = 0.5 * densityAt10km * estimatedVelocity * estimatedVelocity * 0.5 * dragMultiplier;

    return Math.min(maxQ, 100000); // Cap at 100 kPa for estimation
}

/**
 * Get visual stress level for rendering
 * Returns values from 0-1 for heat, g-force, and pressure
 */
function getStressLevels() {
    return {
        heat: Math.min(1, (PHYSICS.surfaceTemperature - 288) / (PHYSICS.MAX_TEMP_LIMIT - 288)),
        // Allow G-force stress to go above 1.0 for extreme failure events
        gForce: Math.abs(PHYSICS.gForce) / PHYSICS.MAX_G_LIMIT,
        pressure: Math.min(1, PHYSICS.dynamicPressure / PHYSICS.MAX_Q_LIMIT)
    };
}
