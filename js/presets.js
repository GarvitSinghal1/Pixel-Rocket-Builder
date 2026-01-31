/**
 * PIXEL ROCKET BUILDER - Rocket Presets
 * Pre-designed rocket templates for quick start and learning
 */

const ROCKET_PRESETS = {
    small: {
        name: "Small Rocket",
        description: "Beginner-friendly design - reaches ~10km",
        icon: "🚀",
        parts: [
            // Small nose cone at top (centered at grid position 6,2)
            { partId: 'small_nose_cone', x: 6, y: 2 },
            // Small tank below
            { partId: 'small_tank', x: 6, y: 3 },
            // Small thruster at bottom
            { partId: 'small_thruster', x: 6, y: 5 }
        ]
    },

    medium: {
        name: "Medium Rocket",
        description: "Balanced build - reaches ~50km",
        icon: "🛸",
        parts: [
            // Standard nose cone (centered, 2 wide)
            { partId: 'nose_cone', x: 5, y: 1 },
            // Medium tank (2 wide, 3 tall)
            { partId: 'medium_tank', x: 5, y: 3 },
            // Small fins for stability (3 wide)
            { partId: 'small_fins', x: 4, y: 6 },
            // Standard engine (2 wide)
            { partId: 'standard_engine', x: 5, y: 6 }
        ]
    },

    large: {
        name: "Large Rocket",
        description: "Heavy lifter - reaches space (100km+)",
        icon: "🌌",
        parts: [
            // Nose cone at top (x=5 is center of 32x20 grid roughly?)
            // Grid is dynamic but usually around 25-30 wide.
            // Let's align everything to x=6 center line
            { partId: 'nose_cone', x: 6, y: 0 },
            // Satellite payload
            { partId: 'satellite', x: 6, y: 2 },
            // Large tank
            { partId: 'large_tank', x: 6, y: 4 },
            // Second Large tank for more fuel
            { partId: 'large_tank', x: 6, y: 8 },
            // Heavy lifter engine (width 3, centered on width 2 tank? - needs careful placement)
            // Heavy Lifter is width 3. Large Tank is width 2.
            // Center of Large Tank at x=6 is 6 + 1 = 7.
            // Center of Heavy Lifter at x=5.5 is 5.5 + 1.5 = 7.
            // But grid snaps to integers.
            // Instead, let's use a 4-wide base using radial tanks or similar.

            // Revised Large Rocket: Central Core + Boosters
            // Medium Tank Core (Width 2)
            // Side Boosters (Width 1)

            // Better: Just use Standard Engines cluster or valid stack

            // Let's try centering on even numbers (width 2)
            { partId: 'large_fins', x: 4, y: 12 }, // Left fin
            { partId: 'large_fins', x: 8, y: 12 }, // Right fin (moved out)

            // Heavy lifter is tricky with width 3.
            // Let's use 2 Standard Engines instead?
            // Or use the Heavy Lifter but acknowledge it might offset visually
            // Actually, let's use a simpler stack that works perfectly

            { partId: 'heavy_lifter', x: 5, y: 12 } // x=5, width 3 => center 6.5. (Tank center 7). 0.5 offset.
            // This offset causes problems.

            // Solution: Use 3-wide tank structure? We don't have 3-wide tanks.
            // Use 1-wide tanks x 3?

            // Let's go with a known valid configuration:
            // 2 Medium Tanks stacked
            // 2 Standard Engines side-by-side (2+2 width? No standard is 2)

            // Let's use the 'standard_engine' which is width 2.
            // Replaces heavy_lifter with standard_engine for now to fix alignment
        ]
    }
};

// Redefine Large Rocket to be valid and symmetric
ROCKET_PRESETS.large = {
    name: "Heavy Lifter",
    description: "Multi-stage capable heavy rocket",
    icon: "🏋️",
    parts: [
        // Payload Section
        { partId: 'nose_cone', x: 6, y: 1 },
        { partId: 'satellite', x: 6, y: 3 },

        // Upper Stage
        { partId: 'medium_tank', x: 6, y: 5 },
        { partId: 'standard_engine', x: 6, y: 8 },

        // Side Boosters (connected to Upper Stage tank)
        // Left Booster
        { partId: 'small_nose_cone', x: 5, y: 5 },
        { partId: 'small_tank', x: 5, y: 6 },
        { partId: 'small_thruster', x: 5, y: 8 },

        // Right Booster
        { partId: 'small_nose_cone', x: 8, y: 5 },
        { partId: 'small_tank', x: 8, y: 6 },
        { partId: 'small_thruster', x: 8, y: 8 }

        // This is a bit complex for a preset validation risk
    ]
};

// Simplest Valid Large Rocket
ROCKET_PRESETS.large = {
    name: "Large Rocket",
    description: "Classic Heavy Lifter Design",
    icon: "🚀",
    parts: [
        // Top
        { partId: 'nose_cone', x: 6, y: 1 },
        { partId: 'crew_capsule', x: 6, y: 3 }, // Crew!

        // Body
        { partId: 'large_tank', x: 6, y: 5 },
        { partId: 'large_tank', x: 6, y: 9 },

        // Engine (Standard is width 2, matches tank)
        { partId: 'standard_engine', x: 6, y: 13 },

        // Fins (Side mounted)
        { partId: 'large_fins', x: 4, y: 11 }, // Left
        { partId: 'large_fins', x: 8, y: 11 }  // Right
    ]
};

/**
 * Load a rocket preset into the editor
 */
function loadPreset(presetId) {
    const preset = ROCKET_PRESETS[presetId];
    if (!preset) {
        console.error('Preset not found:', presetId);
        return false;
    }

    // Clear existing parts
    if (typeof EDITOR !== 'undefined') {
        EDITOR.placedParts = [];
    }

    // Calculate canvas center
    const canvasCenter = (typeof EDITOR !== 'undefined' && EDITOR.centerX) ? EDITOR.centerX : 400;
    const canvasBottom = (typeof EDITOR !== 'undefined' && EDITOR.height) ? EDITOR.height - 60 : 700;

    // Load preset parts - center them on the canvas
    preset.parts.forEach(partData => {
        const part = getPartById(partData.partId);
        if (part) {
            // Calculate centered X position
            const partWidthPixels = part.width * TILE_SIZE;
            const centeredX = canvasCenter - (partWidthPixels / 2);

            // Calculate Y from bottom up
            const yFromBottom = partData.y * TILE_SIZE;
            const absoluteY = canvasBottom - yFromBottom - (part.height * TILE_SIZE);

            const placedPart = {
                partId: partData.partId,
                x: centeredX,
                y: absoluteY,
                width: part.width,
                height: part.height
            };

            // Add if EDITOR is available
            if (typeof EDITOR !== 'undefined') {
                EDITOR.placedParts.push(placedPart);
            }
        }
    });

    // Redraw canvas if available
    if (typeof renderEditor === 'function') {
        renderEditor();
    }

    // Update stats
    if (typeof updateStats === 'function') {
        updateStats();
    }

    console.log(`Loaded preset: ${preset.name}`);
    return true;
}

/**
 * Get all available presets
 */
function getAllPresets() {
    return Object.entries(ROCKET_PRESETS).map(([id, preset]) => ({
        id,
        ...preset
    }));
}
