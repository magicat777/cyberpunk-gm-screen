/**
 * HoloButton Web Component
 * A cyberpunk-styled holographic button with glitch effects
 */

class HoloButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default properties
    this._variant = 'primary';
    this._size = 'medium';
    this._disabled = false;
    this._loading = false;
    this._glitch = true;
    this._sound = true;
  }
  
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'no-glitch', 'no-sound'];
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  disconnectedCallback() {
    // Clean up event listeners
    const button = this.shadowRoot.querySelector('.holo-btn');
    if (button) {
      button.removeEventListener('click', this.handleClick);
      button.removeEventListener('mouseenter', this.handleMouseEnter);
      button.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'variant':
        this._variant = newValue || 'primary';
        break;
      case 'size':
        this._size = newValue || 'medium';
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        break;
      case 'loading':
        this._loading = newValue !== null;
        break;
      case 'no-glitch':
        this._glitch = newValue === null;
        break;
      case 'no-sound':
        this._sound = newValue === null;
        break;
    }
    
    if (this.shadowRoot) {
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
  }
  
  getStyles() {
    return `
      :host {
        display: inline-block;
        --btn-primary: var(--primary, #00ffff);
        --btn-secondary: var(--secondary, #ff00ff);
        --btn-accent: var(--accent, #ffff00);
        --btn-danger: var(--danger, #ff0040);
        --btn-success: var(--success, #00ff00);
        --btn-warning: var(--warning, #ff8800);
        --btn-bg: var(--bg-primary, #0a0a0a);
        --btn-text: var(--text-primary, #e0e0e0);
      }
      
      .holo-btn {
        position: relative;
        background: transparent;
        border: 2px solid var(--btn-color);
        color: var(--btn-color);
        font-family: 'Orbitron', monospace;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Variants */
      :host([variant="primary"]) .holo-btn { --btn-color: var(--btn-primary); }
      :host([variant="secondary"]) .holo-btn { --btn-color: var(--btn-secondary); }
      :host([variant="accent"]) .holo-btn { --btn-color: var(--btn-accent); }
      :host([variant="danger"]) .holo-btn { --btn-color: var(--btn-danger); }
      :host([variant="success"]) .holo-btn { --btn-color: var(--btn-success); }
      :host([variant="warning"]) .holo-btn { --btn-color: var(--btn-warning); }
      
      /* Sizes */
      :host([size="small"]) .holo-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
      
      :host([size="medium"]) .holo-btn,
      .holo-btn {
        padding: 10px 20px;
        font-size: 14px;
      }
      
      :host([size="large"]) .holo-btn {
        padding: 14px 28px;
        font-size: 16px;
      }
      
      /* States */
      .holo-btn:hover:not(:disabled) {
        background: var(--btn-color);
        color: var(--btn-bg);
        box-shadow: 
          0 0 20px var(--btn-color),
          inset 0 0 20px rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }
      
      .holo-btn:active:not(:disabled) {
        transform: translateY(0);
      }
      
      .holo-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        filter: grayscale(0.5);
      }
      
      :host([loading]) .holo-btn {
        color: transparent;
        pointer-events: none;
      }
      
      /* Effects */
      .holo-effect {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        transition: left 0.5s;
      }
      
      .holo-btn:hover .holo-effect {
        left: 100%;
      }
      
      .glitch-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--btn-color);
        opacity: 0;
        mix-blend-mode: screen;
        pointer-events: none;
      }
      
      .glitch-active {
        animation: glitch-effect 0.2s;
      }
      
      @keyframes glitch-effect {
        0% { opacity: 0; transform: translateX(0); }
        20% { opacity: 0.8; transform: translateX(-2px); }
        40% { opacity: 0.8; transform: translateX(2px); }
        60% { opacity: 0.8; transform: translateX(-1px); }
        80% { opacity: 0.8; transform: translateX(1px); }
        100% { opacity: 0; transform: translateX(0); }
      }
      
      /* Loading spinner */
      .loading-spinner {
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid var(--btn-color);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Ripple effect */
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-effect {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      /* Focus styles */
      .holo-btn:focus {
        outline: none;
        box-shadow: 
          0 0 0 3px var(--btn-bg),
          0 0 0 5px var(--btn-color);
      }
      
      /* Icon support */
      ::slotted(svg),
      ::slotted(img) {
        width: 1em;
        height: 1em;
      }
    `;
  }
  
  getTemplate() {
    const isDisabled = this._disabled || this._loading;
    
    return `
      <button class="holo-btn" ${isDisabled ? 'disabled' : ''}>
        <div class="holo-effect"></div>
        <div class="glitch-layer"></div>
        ${this._loading ? '<div class="loading-spinner"></div>' : ''}
        <slot></slot>
      </button>
    `;
  }
  
  setupEventListeners() {
    const button = this.shadowRoot.querySelector('.holo-btn');
    if (!button) return;
    
    // Click handler
    button.addEventListener('click', this.handleClick.bind(this));
    
    // Hover effects
    button.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    button.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }
  
  handleClick(e) {
    if (this._disabled || this._loading) {
      e.preventDefault();
      return;
    }
    
    // Glitch effect
    if (this._glitch) {
      this.triggerGlitch();
    }
    
    // Ripple effect
    this.createRipple(e);
    
    // Sound effect
    if (this._sound) {
      this.playSound();
    }
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('holo-click', {
      bubbles: true,
      composed: true,
      detail: { variant: this._variant }
    }));
  }
  
  handleMouseEnter() {
    if (this._sound && !this._disabled) {
      this.playHoverSound();
    }
  }
  
  handleMouseLeave() {
    // Clean up any active effects
  }
  
  triggerGlitch() {
    const glitchLayer = this.shadowRoot.querySelector('.glitch-layer');
    if (glitchLayer) {
      glitchLayer.classList.remove('glitch-active');
      void glitchLayer.offsetWidth; // Force reflow
      glitchLayer.classList.add('glitch-active');
      
      setTimeout(() => {
        glitchLayer.classList.remove('glitch-active');
      }, 200);
    }
  }
  
  createRipple(e) {
    const button = this.shadowRoot.querySelector('.holo-btn');
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  playSound() {
    if (!window.AudioContext) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
  
  playHoverSound() {
    if (!window.AudioContext) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }
  
  // Public methods
  setLoading(loading) {
    this._loading = loading;
    if (loading) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }
  
  setDisabled(disabled) {
    this._disabled = disabled;
    if (disabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
}

// Register the component
customElements.define('holo-button', HoloButton);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HoloButton;
}