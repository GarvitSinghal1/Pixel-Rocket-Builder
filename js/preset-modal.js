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
        card.innerHTML = `
            <div class="preset-icon">${preset.icon}</div>
            <div class="preset-name">${preset.name}</div>
            <div class="preset-description">${preset.description}</div>
        `;

        card.addEventListener('click', () => {
            loadPreset(preset.id);
            if (typeof renderEditor === 'function') renderEditor();
            modal.classList.remove('active');
            if (typeof playClickSound === 'function') playClickSound();
        });

        grid.appendChild(card);
    });

    modal.classList.add('active');
}
