/**
 * Generate a visual preview of the rocket on a canvas
 */
function generateRocketPreview(preset) {
    const canvas = document.createElement('canvas');
    // Using a fixed high resolution for crisp rendering
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Calculate bounds to center the rocket
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    preset.parts.forEach(p => {
        const def = getPartById(p.partId);
        if (def) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x + def.width);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y + def.height);
        }
    });

    if (minX === Infinity) return canvas; // Empty preset handle

    const width = maxX - minX;
    const height = maxY - minY;

    // Scale to fit canvas with margin
    // Max width/height in pixels
    const MAX_W = canvas.width * 0.7; // 70% fill
    const MAX_H = canvas.height * 0.85;

    const scaleX = MAX_W / (width * TILE_SIZE);
    const scaleY = MAX_H / (height * TILE_SIZE);
    const scale = Math.min(scaleX, scaleY); // Keep aspect ratio

    // Center content
    const drawW = width * TILE_SIZE * scale;
    const drawH = height * TILE_SIZE * scale;
    const startX = (canvas.width - drawW) / 2;
    const startY = (canvas.height - drawH) / 2;

    // Calculate Center X in grid units for flipping logic
    const centerGridX = minX + width / 2;

    // Draw parts
    preset.parts.forEach(p => {
        const def = getPartById(p.partId);
        if (def) {
            const relX = (p.x - minX) * TILE_SIZE * scale;
            const relY = (p.y - minY) * TILE_SIZE * scale;

            // Determine Flip
            // If the part is on the LEFT side of the center, and it's a fin, flip it?
            // Usually fins default to pointing Right? Or default is Left?
            // Let's assume default is "Right Fin". So Left Fin needs flip.
            // If x + w/2 < centerGridX -> Left side.

            let flipX = false;
            // Specific parts handling
            if (p.partId.includes('fin')) {
                const partCenterX = p.x + def.width / 2;
                if (partCenterX < centerGridX) {
                    flipX = true;
                }
            }

            // Draw
            drawPart(ctx, def, startX + relX, startY + relY, scale, flipX);
        }
    });

    return canvas;
}

/**
 * Show preset selection modal
 */
function showPresetModal() {
    const modal = document.getElementById('preset-modal');
    const grid = document.getElementById('preset-grid');

    // Clear existing
    grid.innerHTML = '';

    // Add preset cards
    const presets = getAllPresets();

    presets.forEach(preset => {
        const card = document.createElement('div');
        card.className = 'preset-card';
        // Add difficulty class
        const diffClass = (preset.difficulty || 'medium').toLowerCase();

        // Generate Preview
        const previewCanvas = generateRocketPreview(preset);
        previewCanvas.className = 'preset-preview';

        // Styles are handled in CSS, but structure needs to be clean
        // New Structure:
        // [Preview]
        // [Title]
        // [Meta Row: Difficulty | Part Count]
        // [Description]

        const title = document.createElement('div');
        title.className = 'preset-name';
        title.textContent = preset.name;

        const metaRow = document.createElement('div');
        metaRow.className = 'preset-meta-row';
        metaRow.innerHTML = `
            <span class="preset-difficulty ${diffClass}">${preset.difficulty || 'Medium'}</span>
            <span class="preset-parts-count">${preset.parts.length} Parts</span>
        `;

        const desc = document.createElement('div');
        desc.className = 'preset-description';
        desc.textContent = preset.description;

        card.appendChild(previewCanvas);
        card.appendChild(title);
        card.appendChild(metaRow);
        card.appendChild(desc);

        card.addEventListener('click', () => {
            console.log('Loading preset:', preset.id);

            if (typeof loadPreset === 'function') {
                try {
                    loadPreset(preset.id);
                    if (typeof playClickSound === 'function') playClickSound();
                } catch (e) {
                    console.error("Error loading preset:", e);
                    alert("Failed to load preset: " + e.message);
                }
                // Always close modal
                modal.classList.remove('active');
            } else {
                console.error('loadPreset function missing!');
                alert('Error: Could not load preset (system function missing).');
            }
        });

        grid.appendChild(card);
    });

    modal.classList.add('active');
}
