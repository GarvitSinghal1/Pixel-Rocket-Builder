/**
 * PIXEL ROCKET BUILDER - Planetary System
 * Celestial bodies, gravity wells, and atmospheric models
 */

const PLANETS = {
    earth: {
        id: 'earth',
        name: 'Earth',
        radius: 6371000,           // m
        mass: 5.972e24,            // kg
        mu: 3.986e14,              // GM (m³/s²) - gravitational parameter
        surfaceGravity: 9.80665,   // m/s² (Standard Gravity)
        atmosphereHeight: 100000,  // m (Kármán line)
        scaleHeight: 8500,         // m - atmospheric scale height
        seaLevelPressure: 101325,  // Pa
        seaLevelDensity: 1.225,    // kg/m³
        seaLevelTemp: 288,         // K
        color: '#4477ff',
        groundColor: '#1a3322',
        atmosphereColor: 'rgba(100, 150, 255, 0.3)',
        hasAtmosphere: true,
        rotationPeriod: 86400,     // seconds (24 hours)
        isHomeWorld: true,
        molarMass: 0.0289644       // kg/mol (Air)
    },

    moon: {
        id: 'moon',
        name: 'Moon',
        radius: 1737000,           // m
        mass: 7.342e22,            // kg
        mu: 4.905e12,              // GM
        surfaceGravity: 1.62,      // m/s²
        atmosphereHeight: 0,       // No atmosphere
        scaleHeight: 0,
        seaLevelPressure: 0,
        seaLevelDensity: 0,
        seaLevelTemp: 250,         // K average
        color: '#aaaaaa',
        groundColor: '#555555',
        atmosphereColor: null,
        hasAtmosphere: false,
        // Orbit around Earth
        parentBody: 'earth',
        orbitRadius: 384400000,    // m from Earth center
        orbitPeriod: 2360592,      // seconds (~27.3 days)
        orbitEccentricity: 0.0549,
        soiRadius: 66100000        // m - Sphere of Influence
    },

    mars: {
        id: 'mars',
        name: 'Mars',
        radius: 3389500,           // m
        mass: 6.39e23,             // kg
        mu: 4.283e13,              // GM
        surfaceGravity: 3.72,      // m/s²
        atmosphereHeight: 125000,  // m
        scaleHeight: 11100,        // m - thinner atmosphere
        seaLevelPressure: 636,     // Pa (0.6% of Earth)
        seaLevelDensity: 0.020,    // kg/m³
        seaLevelTemp: 210,         // K average
        color: '#ff6644',
        groundColor: '#8b4513',
        atmosphereColor: 'rgba(255, 150, 100, 0.2)',
        hasAtmosphere: true,
        molarMass: 0.04334,        // kg/mol (CO2)
        // Orbit around Sun (simplified for game)
        parentBody: 'sun',
        orbitRadius: 227900000000, // m from Sun
        orbitPeriod: 59355072,     // seconds (~687 days)
        orbitEccentricity: 0.0934,
        soiRadius: 577000000       // m
    }
};

// Current planetary context
const PLANETARY = {
    currentBody: 'earth',
    timeOfDay: 0.5,  // 0 = midnight, 0.5 = noon, 1 = midnight
    dayNightCycle: true

};

/**
 * Get planet by ID
 */
function getPlanet(planetId) {
    return PLANETS[planetId] || PLANETS.earth;
}

/**
 * Get current planet
 */
function getCurrentPlanet() {
    return PLANETS[PLANETARY.currentBody];
}

/**
 * Set current planet
 */
function setCurrentPlanet(planetId) {
    if (PLANETS[planetId]) {
        PLANETARY.currentBody = planetId;
        return true;
    }
    return false;
}

/**
 * Calculate gravity at altitude for a planet
 */
function getGravityAtAltitude(altitude, planetId = null) {
    const planet = planetId ? getPlanet(planetId) : getCurrentPlanet();
    const r = planet.radius + altitude;
    return planet.mu / (r * r);
}

/**
 * Calculate atmospheric properties at altitude
 * Uses exponential atmosphere model with scale height
 */
const ATMOSPHERE_LAYERS = {
    earth: [
        { height: 0, temp: 288.15, lapse: -0.0065, press: 101325 },
        { height: 11000, temp: 216.65, lapse: 0, press: 22632.1 },
        { height: 20000, temp: 216.65, lapse: 0.001, press: 5474.89 },
        { height: 32000, temp: 228.65, lapse: 0.0028, press: 868.02 },
        { height: 47000, temp: 270.65, lapse: 0, press: 110.91 },
        { height: 51000, temp: 270.65, lapse: -0.0028, press: 66.94 },
        { height: 71000, temp: 214.65, lapse: -0.002, press: 3.96 }
    ],
    mars: [
        { height: 0, temp: 210.15, lapse: -0.0025, press: 636 },
        { height: 7000, temp: 192.65, lapse: -0.0009, press: 400 } // Slower cooling aloft
    ]
};

/**
 * Calculate atmospheric properties at altitude
 * Uses Hydrostatic Integration and Ideal Gas Law
 * Correctly couples T, P, and Density
 */
function getPlanetAtmosphere(altitude, planetId = null) {
    const planet = planetId ? getPlanet(planetId) : getCurrentPlanet();

    if (!planet.hasAtmosphere || altitude > planet.atmosphereHeight) {
        return {
            pressure: 0,
            density: 0,
            temperature: 0, // Space is cold
            speedOfSound: 0 // Vacuum has no speed of sound
        };
    }

    // Physical Constants
    // Physical Constants
    const g0 = planet.surfaceGravity;
    // 2019 SI Value for R
    const R = 8.314462618; // Universal Gas Constant (J/mol·K)
    const M = planet.molarMass || 0.0289644; // Molar Mass (default to Earth Air)
    const Rs = R / M;  // Specific Gas Constant (J/kg·K)

    let pressure, temperature, density;

    // Use Planet Specific Atmosphere layers if defined
    if (ATMOSPHERE_LAYERS[planet.id]) {
        // Find current layer
        const layers = ATMOSPHERE_LAYERS[planet.id];
        let layer = layers[0];
        for (let i = 0; i < layers.length; i++) {
            if (altitude >= layers[i].height) {
                layer = layers[i];
            } else {
                break;
            }
        }

        const h = altitude;
        const h_b = layer.height;
        const T_b = layer.temp;
        const P_b = layer.press;
        const L = layer.lapse;

        // Calculate Temperature (Linear Lapse Rate)
        // T = Tb + L * (h - hb)
        temperature = T_b + L * (h - h_b);

        // Hydrostatic Equation Integration
        if (Math.abs(L) < 1e-10) {
            // Isothermal Layer (L = 0)
            // P = Pb * exp( -g0 * M * (h - hb) / (R * Tb) )
            const exponent = (-g0 * M * (h - h_b)) / (R * T_b);
            pressure = P_b * Math.exp(exponent);
        } else {
            // Non-Isothermal Layer
            // P = Pb * (Tb / (Tb + L(h-hb))) ^ (g0 * M / (R * L))
            // P = Pb * (T / Tb) ^ (-g0 * M / (R * L))
            const exponent = (g0 * M) / (R * L);
            const base = (T_b) / (T_b + L * (h - h_b));
            pressure = P_b * Math.pow(base, exponent);
        }

    } else {
        // Fallback for Mars/Others (Single Layer Exponential)
        // Kept simple but derived consistently
        const scaleHeight = planet.scaleHeight || 8500;

        // Simple temp model
        temperature = planet.seaLevelTemp - 0.002 * altitude;
        if (temperature < 150) temperature = 150;

        // Exponential Pressure
        pressure = planet.seaLevelPressure * Math.exp(-altitude / scaleHeight);
    }

    // IDEAL GAS LAW: rho = P / (Rs * T)
    // This ensures density is physically consistent with Pressure and Temperature!
    if (temperature > 0) {
        density = pressure / (Rs * temperature);
    } else {
        density = 0;
    }

    // Speed of sound: c = sqrt(gamma * Rs * T)
    const gamma = 1.4;
    const speedOfSound = temperature > 0 ? Math.sqrt(gamma * Rs * temperature) : 0;

    return {
        pressure,
        density,
        temperature,
        speedOfSound
    };
}

/**
 * Calculate orbital velocity for circular orbit at altitude
 */
function getOrbitalVelocity(altitude, planetId = null) {
    const planet = planetId ? getPlanet(planetId) : getCurrentPlanet();
    const r = planet.radius + altitude;
    return Math.sqrt(planet.mu / r);
}

/**
 * Calculate escape velocity at altitude
 */
function getEscapeVelocity(altitude, planetId = null) {
    const planet = planetId ? getPlanet(planetId) : getCurrentPlanet();
    const r = planet.radius + altitude;
    return Math.sqrt(2 * planet.mu / r);
}

/**
 * Calculate Sphere of Influence radius
 * SOI = a × (m/M)^(2/5)
 */
function calculateSOI(bodyMass, parentMass, orbitRadius) {
    return orbitRadius * Math.pow(bodyMass / parentMass, 0.4);
}

/**
 * Check if position is within a body's SOI
 */
function isInSOI(position, bodyId) {
    const body = getPlanet(bodyId);
    if (!body.soiRadius) return false;

    // Calculate distance from body center
    const distance = Math.sqrt(position.x * position.x + position.y * position.y);
    return distance < body.soiRadius;
}

/**
 * Get day/night factor (0 = night, 1 = day)
 */
function getDayNightFactor() {
    if (!PLANETARY.dayNightCycle) return 1;
    // Sinusoidal day/night cycle
    return (Math.sin(PLANETARY.timeOfDay * Math.PI * 2 - Math.PI / 2) + 1) / 2;
}

/**
 * Update time of day
 */
function updateTimeOfDay(dt) {
    const planet = getCurrentPlanet();
    if (planet.rotationPeriod > 0) {
        PLANETARY.timeOfDay += dt / planet.rotationPeriod;
        if (PLANETARY.timeOfDay > 1) PLANETARY.timeOfDay -= 1;
    }
}

/**
 * Get gravity from multiple bodies (n-body simplified)
 */
function getTotalGravity(position, altitude) {
    let totalGravity = { x: 0, y: 0, magnitude: 0 };

    // Primary gravity from current body (straight down)
    const currentPlanet = getCurrentPlanet();
    const primaryG = getGravityAtAltitude(altitude);
    totalGravity.y = -primaryG;
    totalGravity.magnitude = primaryG;

    // For advanced mode, we could add perturbations from other bodies
    // This is simplified for gameplay

    return totalGravity;
}

/**
 * Get all planets as array
 */
function getAllPlanets() {
    return Object.values(PLANETS);
}

/**
 * Get planets that can be traveled to from current body
 */
function getReachablePlanets() {
    const current = getCurrentPlanet();
    return Object.values(PLANETS).filter(p => p.id !== current.id);
}

console.log('🌍 Planetary system loaded:', Object.keys(PLANETS).length, 'bodies');
