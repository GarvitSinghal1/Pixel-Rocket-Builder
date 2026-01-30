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
        surfaceGravity: 9.81,      // m/s²
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
        isHomeWorld: true
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
function getPlanetAtmosphere(altitude, planetId = null) {
    const planet = planetId ? getPlanet(planetId) : getCurrentPlanet();

    if (!planet.hasAtmosphere || altitude > planet.atmosphereHeight) {
        return {
            pressure: 0,
            density: 0,
            temperature: planet.seaLevelTemp * 0.5, // Space is cold
            speedOfSound: 0
        };
    }

    // Exponential atmosphere model
    const scaleHeight = planet.scaleHeight;
    const altitudeFactor = Math.exp(-altitude / scaleHeight);

    const pressure = planet.seaLevelPressure * altitudeFactor;
    const density = planet.seaLevelDensity * altitudeFactor;

    // Temperature varies with altitude (simplified lapse rate)
    let temperature;
    if (altitude < 11000) {
        // Troposphere: -6.5°C per km
        temperature = planet.seaLevelTemp - 0.0065 * altitude;
    } else if (altitude < 25000) {
        // Tropopause: constant temp
        temperature = planet.seaLevelTemp - 71.5;
    } else if (altitude < 47000) {
        // Stratosphere: warming
        temperature = planet.seaLevelTemp - 71.5 + 0.003 * (altitude - 25000);
    } else {
        // Upper atmosphere: cooling again
        temperature = Math.max(180, planet.seaLevelTemp - 50 - 0.002 * (altitude - 47000));
    }

    // Speed of sound: c = sqrt(γRT/M) where γ=1.4, R=8.314, M≈0.029 for air
    const gamma = 1.4;
    const R = 287; // J/(kg·K) specific gas constant for air
    const speedOfSound = temperature > 0 ? Math.sqrt(gamma * R * temperature) : 0;

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
