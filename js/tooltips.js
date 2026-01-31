/**
 * PIXEL ROCKET BUILDER - Tooltips
 * Shows helpful information when hovering over parts
 */

let currentTooltip = null;

/**
 * Show tooltip for a part
 */
function showTooltip(part, x, y) {
    hideTooltip();

    if (!part.tooltip) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'part-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-name">${part.name}</div>
        <div class="tooltip-desc">${part.tooltip}</div>
    `;

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = Math.min(x + 15, window.innerWidth - rect.width - 10) + 'px';
    tooltip.style.top = Math.min(y + 15, window.innerHeight - rect.height - 10) + 'px';

    currentTooltip = tooltip;
}

/**
 * Hide current tooltip
 */
function hideTooltip() {
    if (currentTooltip) {
        currentTooltip.remove();
        currentTooltip = null;
    }
}

/**
 * Setup tooltip listeners for a DOM element
 */
function setupTooltipFor(element, part) {
    element.addEventListener('mouseenter', (e) => {
        showTooltip(part, e.clientX, e.clientY);
    });

    element.addEventListener('mouseleave', hideTooltip);

    element.addEventListener('mousemove', (e) => {
        if (currentTooltip) {
            const rect = currentTooltip.getBoundingClientRect();
            currentTooltip.style.left = Math.min(e.clientX + 15, window.innerWidth - rect.width - 10) + 'px';
            currentTooltip.style.top = Math.min(e.clientY + 15, window.innerHeight - rect.height - 10) + 'px';
        }
    });
}
