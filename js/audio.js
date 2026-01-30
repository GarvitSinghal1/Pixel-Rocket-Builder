/**
 * PIXEL ROCKET BUILDER - Audio System
 * Procedural sound effects using Web Audio API
 */

const AUDIO = {
    ctx: null,
    masterGain: null,
    thrustOscillator: null,
    thrustGain: null,
    isPlaying: false,
    muted: false
};

/**
 * Initialize audio context
 */
function initAudio() {
    try {
        AUDIO.ctx = new (window.AudioContext || window.webkitAudioContext)();
        AUDIO.masterGain = AUDIO.ctx.createGain();
        AUDIO.masterGain.gain.value = 0.3;
        AUDIO.masterGain.connect(AUDIO.ctx.destination);
        console.log('🔊 Audio system initialized');
    } catch (e) {
        console.warn('Audio not supported:', e);
    }
}

/**
 * Resume audio context (required after user interaction)
 */
function resumeAudio() {
    if (AUDIO.ctx && AUDIO.ctx.state === 'suspended') {
        AUDIO.ctx.resume();
    }
}

/**
 * Play a click/UI sound
 */
function playClickSound() {
    if (!AUDIO.ctx || AUDIO.muted) return;
    resumeAudio();

    const osc = AUDIO.ctx.createOscillator();
    const gain = AUDIO.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, AUDIO.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, AUDIO.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, AUDIO.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, AUDIO.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(AUDIO.masterGain);

    osc.start();
    osc.stop(AUDIO.ctx.currentTime + 0.1);
}

/**
 * Play launch ignition sound
 */
function playIgnitionSound() {
    if (!AUDIO.ctx || AUDIO.muted) return;
    resumeAudio();

    // Low rumble
    const noise = createNoise(1.5);
    const filter = AUDIO.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, AUDIO.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, AUDIO.ctx.currentTime + 0.5);

    const gain = AUDIO.ctx.createGain();
    gain.gain.setValueAtTime(0, AUDIO.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, AUDIO.ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.2, AUDIO.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(AUDIO.masterGain);

    noise.start();
    noise.stop(AUDIO.ctx.currentTime + 1.5);
}

/**
 * Start continuous thrust sound
 */
function startThrustSound() {
    if (!AUDIO.ctx || AUDIO.muted || AUDIO.isPlaying) return;
    resumeAudio();

    // Create noise for thrust
    const bufferSize = AUDIO.ctx.sampleRate * 2;
    const buffer = AUDIO.ctx.createBuffer(1, bufferSize, AUDIO.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = AUDIO.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter for rumble
    const filter = AUDIO.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;

    // Gain control
    AUDIO.thrustGain = AUDIO.ctx.createGain();
    AUDIO.thrustGain.gain.value = 0.15;

    noise.connect(filter);
    filter.connect(AUDIO.thrustGain);
    AUDIO.thrustGain.connect(AUDIO.masterGain);

    noise.start();
    AUDIO.thrustOscillator = noise;
    AUDIO.isPlaying = true;
}

/**
 * Update thrust sound based on throttle
 */
function updateThrustSound(throttle) {
    if (!AUDIO.thrustGain) return;
    AUDIO.thrustGain.gain.value = 0.15 * throttle;
}

/**
 * Stop thrust sound
 */
function stopThrustSound() {
    if (AUDIO.thrustOscillator) {
        AUDIO.thrustOscillator.stop();
        AUDIO.thrustOscillator = null;
    }
    AUDIO.isPlaying = false;
}

/**
 * Play explosion/crash sound
 */
function playExplosionSound() {
    if (!AUDIO.ctx || AUDIO.muted) return;
    resumeAudio();

    const noise = createNoise(0.8);
    const filter = AUDIO.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, AUDIO.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, AUDIO.ctx.currentTime + 0.8);

    const gain = AUDIO.ctx.createGain();
    gain.gain.setValueAtTime(0.5, AUDIO.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, AUDIO.ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(AUDIO.masterGain);

    noise.start();
    noise.stop(AUDIO.ctx.currentTime + 0.8);
}

/**
 * Play success jingle
 */
function playSuccessSound() {
    if (!AUDIO.ctx || AUDIO.muted) return;
    resumeAudio();

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
        const osc = AUDIO.ctx.createOscillator();
        const gain = AUDIO.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = AUDIO.ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + 0.3);

        osc.connect(gain);
        gain.connect(AUDIO.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
    });
}

/**
 * Play stage separation sound
 */
function playStagingSound() {
    if (!AUDIO.ctx || AUDIO.muted) return;
    resumeAudio();

    // Quick burst
    const osc = AUDIO.ctx.createOscillator();
    const gain = AUDIO.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, AUDIO.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, AUDIO.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, AUDIO.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, AUDIO.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(AUDIO.masterGain);

    osc.start();
    osc.stop(AUDIO.ctx.currentTime + 0.2);
}

/**
 * Helper: Create noise source
 */
function createNoise(duration) {
    const bufferSize = AUDIO.ctx.sampleRate * duration;
    const buffer = AUDIO.ctx.createBuffer(1, bufferSize, AUDIO.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const source = AUDIO.ctx.createBufferSource();
    source.buffer = buffer;
    return source;
}

/**
 * Toggle mute
 */
function toggleMute() {
    AUDIO.muted = !AUDIO.muted;
    if (AUDIO.muted && AUDIO.thrustOscillator) {
        stopThrustSound();
    }
    return AUDIO.muted;
}
