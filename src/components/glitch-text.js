/**
 * GlitchText Web Component
 * A cyberpunk-styled text component with glitch animation effects
 */

class GlitchText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default properties
    this._text = '';
    this._intensity = 'medium';
    this._speed = 'normal';
    this._color = 'primary';
    this._glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`0123456789ABCDEF';
    this._isGlitching = false;
    this._animationInterval = null;
    this._hoverGlitch = false;
    this._continuous = false;
    
    // Bind methods
    this.startGlitch = this.startGlitch.bind(this);
    this.stopGlitch = this.stopGlitch.bind(this);
    this.glitchFrame = this.glitchFrame.bind(this);
  }
  
  static get observedAttributes() {
    return ['text', 'intensity', 'speed', 'color', 'hover-glitch', 'continuous'];
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    // Start continuous glitch if enabled
    if (this._continuous) {
      this.startContinuousGlitch();
    }
  }
  
  disconnectedCallback() {
    this.cleanup();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'text':
        this._text = newValue || this.textContent || '';
        break;
      case 'intensity':
        this._intensity = newValue || 'medium';
        break;
      case 'speed':
        this._speed = newValue || 'normal';
        break;
      case 'color':
        this._color = newValue || 'primary';
        break;
      case 'hover-glitch':
        this._hoverGlitch = newValue !== null;
        break;
      case 'continuous':
        const wasContinuous = this._continuous;
        this._continuous = newValue !== null;
        
        // Handle continuous mode changes
        if (this._continuous && !wasContinuous) {
          this.startContinuousGlitch();
        } else if (!this._continuous && wasContinuous) {
          this.stopContinuousGlitch();
        }
        break;
    }
    
    if (this.shadowRoot && oldValue !== newValue) {
      this.render();
    }
  }
  
  render() {
    const styles = this.getStyles();
    const template = this.getTemplate();
    
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;
    
    // Cache elements
    this._mainText = this.shadowRoot.querySelector('.glitch-text-main');
    this._layer1 = this.shadowRoot.querySelector('.glitch-layer-1');
    this._layer2 = this.shadowRoot.querySelector('.glitch-layer-2');
    this._container = this.shadowRoot.querySelector('.glitch-container');
  }
  
  getStyles() {
    return `
      :host {
        display: inline-block;
        position: relative;
        --glitch-primary: var(--primary, #00ffff);
        --glitch-secondary: var(--secondary, #ff00ff);
        --glitch-accent: var(--accent, #ffff00);
        --glitch-danger: var(--danger, #ff0040);
        --glitch-success: var(--success, #00ff00);
      }
      
      .glitch-container {
        position: relative;
        display: inline-block;
        cursor: ${this._hoverGlitch ? 'pointer' : 'default'};
      }
      
      .glitch-text {
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        position: relative;
        display: inline-block;
        color: var(--glitch-color);
      }
      
      /* Color variants */
      :host([color="primary"]) { --glitch-color: var(--glitch-primary); }
      :host([color="secondary"]) { --glitch-color: var(--glitch-secondary); }
      :host([color="accent"]) { --glitch-color: var(--glitch-accent); }
      :host([color="danger"]) { --glitch-color: var(--glitch-danger); }
      :host([color="success"]) { --glitch-color: var(--glitch-success); }
      
      .glitch-text-main {
        position: relative;
        z-index: 3;
      }
      
      .glitch-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        mix-blend-mode: screen;
      }
      
      .glitch-layer-1 {
        color: var(--glitch-secondary);
        z-index: 2;
        animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
      }
      
      .glitch-layer-2 {
        color: var(--glitch-accent);
        z-index: 1;
        animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
      }
      
      /* Glitching state */
      :host([glitching]) .glitch-layer {
        opacity: 0.8;
      }
      
      :host([glitching]) .glitch-text-main {
        animation: glitch-skew 0.5s infinite linear alternate-reverse;
      }
      
      /* Intensity variants */
      :host([intensity="low"]) .glitch-layer {
        opacity: 0.4;
      }
      
      :host([intensity="high"]) .glitch-layer {
        opacity: 1;
      }
      
      :host([intensity="extreme"]) .glitch-layer {
        opacity: 1;
        mix-blend-mode: difference;
      }
      
      :host([intensity="extreme"]) .glitch-text-main {
        animation: glitch-skew 0.2s infinite linear alternate-reverse;
      }
      
      /* Speed variants */
      :host([speed="slow"]) .glitch-layer-1 {
        animation-duration: 0.6s;
      }
      
      :host([speed="slow"]) .glitch-layer-2 {
        animation-duration: 0.8s;
      }
      
      :host([speed="fast"]) .glitch-layer-1 {
        animation-duration: 0.1s;
      }
      
      :host([speed="fast"]) .glitch-layer-2 {
        animation-duration: 0.15s;
      }
      
      /* Animations */
      @keyframes glitch-anim-1 {
        0%, 100% {
          transform: translate(0);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
        20% {
          transform: translate(-2px, 2px);
          clip-path: polygon(0 15%, 100% 15%, 100% 30%, 0 30%);
        }
        40% {
          transform: translate(-2px, -2px);
          clip-path: polygon(0 45%, 100% 45%, 100% 60%, 0 60%);
        }
        60% {
          transform: translate(2px, 2px);
          clip-path: polygon(0 70%, 100% 70%, 100% 85%, 0 85%);
        }
        80% {
          transform: translate(2px, -2px);
          clip-path: polygon(0 0%, 100% 0%, 100% 15%, 0 15%);
        }
      }
      
      @keyframes glitch-anim-2 {
        0%, 100% {
          transform: translate(0);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
        20% {
          transform: translate(2px, -2px);
          clip-path: polygon(0 25%, 100% 25%, 100% 40%, 0 40%);
        }
        40% {
          transform: translate(2px, 2px);
          clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%);
        }
        60% {
          transform: translate(-2px, -2px);
          clip-path: polygon(0 80%, 100% 80%, 100% 95%, 0 95%);
        }
        80% {
          transform: translate(-2px, 2px);
          clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%);
        }
      }
      
      @keyframes glitch-skew {
        0%, 100% {
          transform: skew(0deg);
        }
        20% {
          transform: skew(1deg);
        }
        40% {
          transform: skew(-1deg);
        }
        60% {
          transform: skew(0.5deg);
        }
        80% {
          transform: skew(-0.5deg);
        }
      }
      
      /* Scanline effect */
      .scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--glitch-color) 50%,
          transparent 100%
        );
        opacity: 0;
        transform: translateY(-100%);
        pointer-events: none;
      }
      
      :host([glitching]) .scanline {
        opacity: 0.5;
        animation: scanline 2s linear infinite;
      }
      
      @keyframes scanline {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(calc(100% + 100px));
        }
      }
      
      /* Chromatic aberration effect */
      :host([intensity="extreme"]) .glitch-text-main {
        text-shadow: 
          0.02em 0 0 rgba(255, 0, 0, 0.5),
          -0.02em -0.02em 0 rgba(0, 255, 0, 0.5),
          0.025em 0.025em 0 rgba(0, 0, 255, 0.5);
      }
      
      /* Static noise overlay */
      .static-noise {
        position: absolute;
        top: -10%;
        left: -10%;
        width: 120%;
        height: 120%;
        opacity: 0;
        pointer-events: none;
        background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.1"/></svg>');
        mix-blend-mode: overlay;
      }
      
      :host([intensity="extreme"]) .static-noise {
        opacity: 0.1;
        animation: static-shift 0.1s steps(10) infinite;
      }
      
      @keyframes static-shift {
        0%, 100% {
          transform: translate(0, 0);
        }
        10% {
          transform: translate(-5%, -5%);
        }
        20% {
          transform: translate(-10%, 5%);
        }
        30% {
          transform: translate(5%, -10%);
        }
        40% {
          transform: translate(-5%, 10%);
        }
        50% {
          transform: translate(-10%, -5%);
        }
        60% {
          transform: translate(10%, 5%);
        }
        70% {
          transform: translate(5%, -5%);
        }
        80% {
          transform: translate(-5%, 10%);
        }
        90% {
          transform: translate(10%, -10%);
        }
      }
    `;
  }
  
  getTemplate() {
    const displayText = this._text || this.textContent || 'GLITCH';
    
    return `
      <div class="glitch-container">
        <span class="glitch-text glitch-text-main" data-text="${displayText}">
          ${displayText}
        </span>
        <span class="glitch-text glitch-layer glitch-layer-1" aria-hidden="true">
          ${displayText}
        </span>
        <span class="glitch-text glitch-layer glitch-layer-2" aria-hidden="true">
          ${displayText}
        </span>
        <div class="scanline"></div>
        <div class="static-noise"></div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (this._hoverGlitch && this._container) {
      this._container.addEventListener('mouseenter', this.startGlitch);
      this._container.addEventListener('mouseleave', this.stopGlitch);
    }
  }
  
  startGlitch() {
    if (this._isGlitching) return;
    
    this._isGlitching = true;
    this.setAttribute('glitching', '');
    
    // Get animation duration based on speed
    const duration = this.getGlitchDuration();
    
    // Start text scrambling
    this._animationInterval = setInterval(() => {
      this.glitchFrame();
    }, 50);
    
    // Stop after duration (unless continuous)
    if (!this._continuous) {
      setTimeout(() => {
        this.stopGlitch();
      }, duration);
    }
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('glitch-start', {
      bubbles: true,
      composed: true
    }));
  }
  
  stopGlitch() {
    if (!this._isGlitching) return;
    
    this._isGlitching = false;
    this.removeAttribute('glitching');
    
    // Clear animation interval
    if (this._animationInterval) {
      clearInterval(this._animationInterval);
      this._animationInterval = null;
    }
    
    // Restore original text
    this.restoreText();
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('glitch-stop', {
      bubbles: true,
      composed: true
    }));
  }
  
  glitchFrame() {
    const originalText = this._text || this.textContent || 'GLITCH';
    const glitchProbability = this.getGlitchProbability();
    
    // Scramble main text
    const scrambledText = originalText.split('').map((char, index) => {
      if (Math.random() < glitchProbability && char !== ' ') {
        return this._glitchChars[Math.floor(Math.random() * this._glitchChars.length)];
      }
      return char;
    }).join('');
    
    // Update main text
    if (this._mainText) {
      this._mainText.textContent = scrambledText;
    }
    
    // Occasionally shift layers for more chaos
    if (Math.random() < 0.1) {
      this.shiftLayers();
    }
  }
  
  restoreText() {
    const originalText = this._text || this.textContent || 'GLITCH';
    
    if (this._mainText) {
      this._mainText.textContent = originalText;
    }
    if (this._layer1) {
      this._layer1.textContent = originalText;
    }
    if (this._layer2) {
      this._layer2.textContent = originalText;
    }
  }
  
  shiftLayers() {
    const originalText = this._text || this.textContent || 'GLITCH';
    
    // Randomly shift parts of the layer text
    if (this._layer1 && Math.random() < 0.5) {
      const shift = Math.floor(Math.random() * 3) - 1;
      const shiftedText = originalText.substring(shift) + originalText.substring(0, shift);
      this._layer1.textContent = shiftedText;
    }
    
    if (this._layer2 && Math.random() < 0.5) {
      const shift = Math.floor(Math.random() * 3) - 1;
      const shiftedText = originalText.substring(shift) + originalText.substring(0, shift);
      this._layer2.textContent = shiftedText;
    }
  }
  
  getGlitchDuration() {
    const speeds = {
      slow: 3000,
      normal: 1500,
      fast: 800
    };
    return speeds[this._speed] || speeds.normal;
  }
  
  getGlitchProbability() {
    const intensities = {
      low: 0.1,
      medium: 0.3,
      high: 0.5,
      extreme: 0.8
    };
    return intensities[this._intensity] || intensities.medium;
  }
  
  startContinuousGlitch() {
    this.startGlitch();
    
    // Set up periodic glitches
    const baseInterval = this.getGlitchDuration() * 3; // Time between glitches
    const variance = baseInterval * 0.5; // Random variance
    
    const scheduleNextGlitch = () => {
      if (!this._continuous) return;
      
      const delay = baseInterval + (Math.random() * variance * 2 - variance);
      
      this._continuousTimeout = setTimeout(() => {
        if (this._continuous && !this._isGlitching) {
          this.startGlitch();
          
          // Schedule to stop
          setTimeout(() => {
            this.stopGlitch();
            scheduleNextGlitch();
          }, this.getGlitchDuration());
        }
      }, delay);
    };
    
    // Schedule first stop
    setTimeout(() => {
      this.stopGlitch();
      scheduleNextGlitch();
    }, this.getGlitchDuration());
  }
  
  stopContinuousGlitch() {
    if (this._continuousTimeout) {
      clearTimeout(this._continuousTimeout);
      this._continuousTimeout = null;
    }
    this.stopGlitch();
  }
  
  cleanup() {
    this.stopGlitch();
    this.stopContinuousGlitch();
    
    if (this._container) {
      this._container.removeEventListener('mouseenter', this.startGlitch);
      this._container.removeEventListener('mouseleave', this.stopGlitch);
    }
  }
  
  // Public API
  glitch(duration) {
    this.startGlitch();
    if (duration) {
      setTimeout(() => this.stopGlitch(), duration);
    }
  }
  
  setText(text) {
    this.setAttribute('text', text);
  }
  
  setIntensity(intensity) {
    this.setAttribute('intensity', intensity);
  }
  
  setSpeed(speed) {
    this.setAttribute('speed', speed);
  }
}

// Register the component
customElements.define('glitch-text', GlitchText);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlitchText;
}