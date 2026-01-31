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
            // Small nose cone at top
            { partId: 'small_nose_cone', x: 192, y: 64 },
            // Small tank
            { partId: 'small_tank', x: 192, y: 96 },
            // Small thruster at bottom
            { partId: 'small_thruster', x: 192, y: 160 }
        ]
    },

    medium: {
        name: "Medium Rocket",
        description: "Balanced build - reaches ~50km",
        icon: "🛸",
        parts: [
            // Standard nose cone
            { partId: 'nose_cone', x: 176, y: 32 },
            // Me dium tank
            { partId: 'medium_tank', x: 176, y: 96 },
            // Small fins for stability
            { partId: 'small_fins', x: 128, y: 192 },
            // Standard engine
            { partId: 'standard_engine', x: 176, y: 192 }
        ]
    },

    large: {
        name: "Large Rocket",
        description: "Heavy lifter - reaches space (100km+)",
        icon: "🌌",
        parts: [
            // Fairing at top
            { partId: 'nose_cone', x: 176, y: 16 },
            // Satellite payload
            { partId: 'satellite', x: 176, y: 80 },
            // Large tank
            { partId: 'large_tank', x: 176, y: 144 },
            // Large fins
            { partId: 'large_fins', x: 112, y: 272 },
            // Heavy lifter engine
            { partId: 'heavy_lifter', x: 144, y: 272 }
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

    // Load preset parts
    preset.parts.forEach(partData => {
        const part = getPartById(partData.partId);
        if (part) {
            const placedPart = {
                partId: partData.partId,
                x: partData.x,
                y: partData.y,
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
