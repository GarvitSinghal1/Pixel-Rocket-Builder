/**
 * PREDEFINED ROCKET CONFIGURATIONS
 * A gallery of ready-to-launch rockets showcasing different parts and strategies.
 */

const ROCKET_PRESETS = {
    starter: {
        id: 'starter',
        name: "Eco Hopper",
        description: "Simple, efficient rocket. Great for beginners.",
        difficulty: "Easy",
        parts: [
            // Stack: Nose(1) -> Tank(2) -> Thruster(1)
            // Y: 18 -> 19-20 -> 21
            { partId: 'small_nose_cone', x: 7, y: 18 },
            { partId: 'small_tank', x: 7, y: 19 },
            { partId: 'small_thruster', x: 7, y: 21 },
            { partId: 'small_fins', x: 6, y: 20 },
            { partId: 'small_fins', x: 8, y: 20 }
        ]
    },
    orbiter_mk1: {
        id: 'orbiter_mk1',
        name: "Orbiter Mk.I",
        description: "Reliable 2-stage craft with satellite payload.",
        difficulty: "Medium",
        parts: [
            // Stage 2: Nose(2x2) -> Satellite(2x2) -> Decoupler(2x1) -> Medium Tank(2x3) -> Engine(2x2)
            // X Center: 6.5 (Grid 6,7)
            { partId: 'nose_cone', x: 6, y: 10 },
            { partId: 'satellite', x: 6, y: 12 },
            { partId: 'decoupler', x: 6, y: 14 },
            { partId: 'medium_tank', x: 6, y: 15 },
            { partId: 'standard_engine', x: 6, y: 18 },
            { partId: 'large_fins', x: 4, y: 17 },
            { partId: 'large_fins', x: 8, y: 17 }
        ]
    },
    heavy_lifter: {
        id: 'heavy_lifter',
        name: "Atlas Heavy",
        description: "Heavy-lift vehicle for deep space missions.",
        difficulty: "Hard",
        parts: [
            // Core: Fairing(3x3) -> Hab(3x3) -> HugeTank(3x5) -> HugeTank(3x5) -> Mammoth(3x3)
            // X Center: 7 (Grid 6,7,8)
            { partId: 'fairing', x: 6, y: 2 },
            { partId: 'habitation_module', x: 6, y: 5 },
            { partId: 'huge_tank', x: 6, y: 8 },
            { partId: 'huge_tank', x: 6, y: 13 },
            { partId: 'mammoth_engine', x: 6, y: 18 },

            // Boosters: Side (x=5,9), attached to lower tank (Need to align Y)
            // Booster is 1x3. Attach to y=14
            { partId: 'booster', x: 5, y: 14 },
            { partId: 'booster', x: 9, y: 14 },
            { partId: 'small_nose_cone', x: 5, y: 13 },
            { partId: 'small_nose_cone', x: 9, y: 13 }
        ]
    },
    ion_probe: {
        id: 'ion_probe',
        name: "Ion Explorer",
        description: "Efficient ion probe with launch booster.",
        difficulty: "Hard",
        parts: [
            // Centered 2-wide Design
            // Payload: Nose(2x2) -> MedTank(2x3) -> Ions(x2)
            { partId: 'nose_cone', x: 6, y: 12 },
            { partId: 'medium_tank', x: 6, y: 14 },
            { partId: 'ion_drive', x: 6, y: 17 }, // Left Ion
            { partId: 'ion_drive', x: 7, y: 17 }, // Right Ion
            { partId: 'solar_panel', x: 5, y: 15 }, // Left Solar
            { partId: 'solar_panel', x: 8, y: 15 }, // Right Solar

            // Booster: Decoupler(2x1) -> MedTank(2x3) -> StdEngine(2x2)
            { partId: 'decoupler', x: 6, y: 18 },
            { partId: 'medium_tank', x: 6, y: 19 },
            { partId: 'standard_engine', x: 6, y: 22 }
        ]
    },
    ssto_dart: {
        id: 'ssto_dart',
        name: "Aerospike Dart",
        description: "Single-Stage-To-Orbit experimental craft using aerospikes.",
        difficulty: "Expert",
        parts: [
            // Stack: Nose(2x2) -> LargeTank(2x4) -> LargeTank(2x4) -> Aerospike(2x2)
            { partId: 'nose_cone', x: 6, y: 11 },
            { partId: 'large_tank', x: 6, y: 13 },
            { partId: 'large_tank', x: 6, y: 17 },
            { partId: 'aerospike', x: 6, y: 21 },
            { partId: 'large_fins', x: 4, y: 20 },
            { partId: 'large_fins', x: 8, y: 20 }
        ]
    },
    space_station: {
        id: 'space_station',
        name: "Habitation Hub",
        description: "Orbital outpost module.",
        difficulty: "n/a",
        parts: [
            { partId: 'docking_port', x: 7, y: 10 },
            { partId: 'habitation_module', x: 6, y: 11 },
            { partId: 'solar_panel', x: 5, y: 12 },
            { partId: 'solar_panel', x: 9, y: 12 },
            { partId: 'docking_port', x: 7, y: 14 }
        ]
    },
    cargo_hauler: {
        id: 'cargo_hauler',
        name: "Freight Train",
        description: "Medium-lift cargo vehicle.",
        difficulty: "Medium",
        parts: [
            { partId: 'nose_cone', x: 6, y: 9 },
            { partId: 'cargo_bay', x: 6, y: 11 },
            { partId: 'large_tank', x: 6, y: 13 },
            { partId: 'large_tank', x: 6, y: 17 },
            { partId: 'standard_engine', x: 6, y: 21 },
            // SRBs for kick
            { partId: 'booster', x: 5, y: 18 },
            { partId: 'booster', x: 8, y: 18 }, // x=8 means right side of tank (6,7).. 8 is ok
            { partId: 'small_nose_cone', x: 5, y: 17 },
            { partId: 'small_nose_cone', x: 8, y: 17 }
        ]
    },
    lander_mk1: {
        id: 'lander_mk1',
        name: "Lunar Lander",
        description: "Wide stance for stable landings.",
        difficulty: "Hard",
        parts: [
            { partId: 'nose_cone', x: 6, y: 14 },
            // Crew Capsule center is 6,7. 7 is valid overlap.
            { partId: 'crew_capsule', x: 6, y: 16 },
            { partId: 'medium_tank', x: 6, y: 18 },
            { partId: 'aerospike', x: 6, y: 21 },
            { partId: 'strut', x: 5, y: 20 },
            { partId: 'strut', x: 8, y: 20 }
        ]
    },
    speed_demon: {
        id: 'speed_demon',
        name: "Speed Demon",
        description: "High TWR interceptor.",
        difficulty: "Easy",
        parts: [
            // Stack: Nose(2x2) -> MediumTank(2x3) -> Aerospike(2x2)
            // X Center: 6 (Grid 6,7)
            { partId: 'nose_cone', x: 6, y: 17 },
            { partId: 'medium_tank', x: 6, y: 19 },
            { partId: 'aerospike', x: 6, y: 22 },

            // Boosters (1x3) attached to tank side
            { partId: 'booster', x: 5, y: 19 },
            { partId: 'booster', x: 8, y: 19 }
        ]
    }
};

/**
 * Get all presets as an array
 */
function getAllPresets() {
    return Object.values(ROCKET_PRESETS);
}

/**
 * Load a preset into the editor
 */
function loadPreset(presetId) {
    const preset = ROCKET_PRESETS[presetId];
    if (!preset) return;

    // Clear current editor
    EDITOR.placedParts = [];
    EDITOR.selection = [];

    // Calculate preset bounds to center it effectively
    let minX = Infinity, maxGridX = -Infinity;
    let maxGridY = -Infinity; // Find bottom-most point

    preset.parts.forEach(p => {
        const def = getPartById(p.partId);
        if (def) {
            // Preset coords are grid units
            minX = Math.min(minX, p.x);
            maxGridX = Math.max(maxGridX, p.x + def.width);
            maxGridY = Math.max(maxGridY, p.y + def.height);
        }
    });

    const presetWidthTiles = maxGridX - minX;
    // Calculate the "center" x-coordinate of the preset in grid units
    const presetCenterX = minX + presetWidthTiles / 2;

    // Add new parts
    preset.parts.forEach(partDef => {
        const part = getPartById(partDef.partId);
        if (part) {
            // Convert grid coordinates to pixel coordinates
            const pxX = (partDef.x * TILE_SIZE);
            const pxY = (partDef.y * TILE_SIZE);

            // Layout offsets
            const offsetX = EDITOR.centerX - (presetCenterX * TILE_SIZE);
            const offsetY = EDITOR.padY - (maxGridY * TILE_SIZE);

            EDITOR.placedParts.push({
                // Generate a UNIQUE ID so physics graph works
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                partId: partDef.partId,
                x: pxX + offsetX,
                y: pxY + offsetY,
                rotation: partDef.rotation || 0
            });
        }
    });

    // Reset physics state
    PHYSICS.reset();

    // Notify user
    console.log(`Loaded preset: ${preset.name}`);

    // Redraw
    if (typeof renderEditor === 'function') {
        renderEditor();
    } else {
        console.error("renderEditor not found");
    }

    // Update UI
    if (typeof updateStats === 'function') updateStats();
}
