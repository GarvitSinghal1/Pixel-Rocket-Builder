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
            // Center Line x=5 (Size 1)
            { partId: 'small_nose_cone', x: 5, y: 5 },
            { partId: 'small_tank', x: 5, y: 6 },
            { partId: 'small_thruster', x: 5, y: 8 }
        ]
    },

    medium: {
        name: "Medium Rocket",
        description: "Balanced build - reaches ~50km",
        icon: "🛸",
        parts: [
            // Core Body x=5 (Size 2). Covers 5,6.
            { partId: 'nose_cone', x: 5, y: 2 },
            { partId: 'medium_tank', x: 5, y: 4 },
            { partId: 'standard_engine', x: 5, y: 7 },

            // Fins (Size 1)
            // Left of 5 is 4. Right of 6 is 7.
            { partId: 'small_fins', x: 4, y: 7 }, // Left
            { partId: 'small_fins', x: 7, y: 7 }  // Right
        ]
    },

    large: {
        name: "Heavy Lifter",
        description: "Multi-stage capable heavy rocket",
        icon: "🏋️",
        parts: [
            // Core Body x=5 (Size 2). Covers 5,6.
            { partId: 'nose_cone', x: 5, y: 0 },
            { partId: 'crew_capsule', x: 5, y: 2 },
            { partId: 'large_tank', x: 5, y: 4 },
            { partId: 'large_tank', x: 5, y: 8 },
            { partId: 'standard_engine', x: 5, y: 12 },

            // Boosters (Size 1)
            // Left (x=4)
            { partId: 'small_nose_cone', x: 4, y: 4 },
            { partId: 'small_tank', x: 4, y: 5 },
            { partId: 'small_thruster', x: 4, y: 7 },

            // Right (x=7)
            { partId: 'small_nose_cone', x: 7, y: 4 },
            { partId: 'small_tank', x: 7, y: 5 },
            { partId: 'small_thruster', x: 7, y: 7 },

            // Fins (Size 2)
            // Attached to boosters bottoms.
            // Booster bottom y=7 (thruster). Let's put fins at y=7.
            // Left Booster (x=4). Fin on left side -> x=2 (Size 2 covers 2,3).
            { partId: 'large_fins', x: 2, y: 7 },

            // Right Booster (x=7). Fin on right side -> x=8 (Size 2 covers 8,9).
            { partId: 'large_fins', x: 8, y: 7 }
        ]
    }
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

    // Calculate canvas geometry
    const canvasCenter = (typeof EDITOR !== 'undefined' && EDITOR.centerX) ? EDITOR.centerX : 400;
    const canvasBottom = (typeof EDITOR !== 'undefined' && EDITOR.height) ? EDITOR.height - 60 : 700;

    // 1. Calculate Bounding Box of the preset in grid units
    let minX = Infinity, maxX = -Infinity;
    let maxY = -Infinity;

    preset.parts.forEach(p => {
        const part = getPartById(p.partId);
        if (part) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x + part.width);
            maxY = Math.max(maxY, p.y + part.height);
        }
    });

    // Preset width in pixels (for centering)
    const presetWidthPixels = (maxX - minX) * TILE_SIZE;

    // 2. Load and center relative to bounding box
    preset.parts.forEach(partData => {
        const part = getPartById(partData.partId);
        if (part) {
            // Calculate relative X from the preset's left edge
            const relativeX = partData.x - minX;

            // Absolute X: 
            // Start at Canvas Center
            // Shift Left by half the total preset width (to center the group)
            // Add the part's relative position
            const absoluteX = canvasCenter - (presetWidthPixels / 2) + (relativeX * TILE_SIZE);

            // Calculate Y from bottom (maxY of preset aligns with canvasBottom)
            // Distance from bottom of preset = maxY - (partData.y + part.height)
            const distFromBottom = maxY - (partData.y + part.height);
            const absoluteY = canvasBottom - (distFromBottom * TILE_SIZE) - (part.height * TILE_SIZE);

            const placedPart = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                partId: partData.partId,
                x: absoluteX,
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

    // Redraw canvas with new parts
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
