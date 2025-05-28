/**
 * CyberCard Web Component
 * A cyberpunk-styled card container with hover effects and multiple variants
 */

class CyberCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default properties
    this._variant = 'default';
    this._elevation = 'medium';
    this._glow = false;
    this._interactive = false;
    this._loading = false;
    this._error = false;
    this._success = false;
  }
  
  static get observedAttributes() {
    return [
      'variant', 'elevation', 'glow', 'interactive', 'loading', 
      'error', 'success', 'title', 'subtitle'
    ];
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'variant':
        this._variant = newValue || 'default';
        break;
      case 'elevation':
        this._elevation = newValue || 'medium';
        break;
      case 'glow':
        this._glow = newValue !== null;
        break;
      case 'interactive':
        this._interactive = newValue !== null;
        break;
      case 'loading':
        this._loading = newValue !== null;
        break;
      case 'error':
        this._error = newValue !== null;
        break;
      case 'success':
        this._success = newValue !== null;
        break;
      case 'title':
        this._title = newValue;
        break;
      case 'subtitle':
        this._subtitle = newValue;
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
  }
  
  getStyles() {
    return `
      :host {
        display: block;
        --card-primary: var(--primary, #00ffff);
        --card-secondary: var(--secondary, #ff00ff);
        --card-accent: var(--accent, #ffff00);
        --card-danger: var(--danger, #ff0040);
        --card-success: var(--success, #00ff00);
        --card-warning: var(--warning, #ff8800);
        --card-bg: var(--bg-surface, rgba(255, 255, 255, 0.05));
        --card-border: var(--border-color, rgba(0, 255, 255, 0.3));
        --card-text: var(--text-primary, #e0e0e0);
        --card-text-secondary: var(--text-secondary, #a0a0a0);
      }
      
      .cyber-card {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        font-family: var(--font-secondary, 'Share Tech Mono', monospace);
      }
      
      /* Elevation variants */
      :host([elevation="low"]) .cyber-card {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      :host([elevation="medium"]) .cyber-card {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
      }
      
      :host([elevation="high"]) .cyber-card {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
      }
      
      /* Interactive states */
      :host([interactive]) .cyber-card {
        cursor: pointer;
      }
      
      :host([interactive]) .cyber-card:hover {
        transform: translateY(-2px);
        border-color: var(--card-color);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
      
      :host([interactive]) .cyber-card:active {
        transform: translateY(0);
      }
      
      /* Glow effect */
      :host([glow]) .cyber-card {
        box-shadow: 
          0 0 20px var(--card-color),
          0 4px 8px rgba(0, 0, 0, 0.4);
      }
      
      :host([glow][interactive]) .cyber-card:hover {
        box-shadow: 
          0 0 30px var(--card-color),
          0 8px 20px rgba(0, 0, 0, 0.6);
      }
      
      /* Variant colors */
      :host([variant="primary"]) { --card-color: var(--card-primary); }
      :host([variant="secondary"]) { --card-color: var(--card-secondary); }
      :host([variant="accent"]) { --card-color: var(--card-accent); }
      :host([variant="danger"]) { --card-color: var(--card-danger); }
      :host([variant="success"]) { --card-color: var(--card-success); }
      :host([variant="warning"]) { --card-color: var(--card-warning); }
      :host([variant="default"]) { --card-color: var(--card-border); }
      
      /* State variants */
      :host([error]) {
        --card-color: var(--card-danger);
        --card-border: var(--card-danger);
      }
      
      :host([success]) {
        --card-color: var(--card-success);
        --card-border: var(--card-success);
      }
      
      :host([loading]) {
        opacity: 0.7;
        pointer-events: none;
      }
      
      /* Corner cuts for cyberpunk aesthetic */
      .cyber-card::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        background: linear-gradient(-45deg, transparent 50%, var(--card-bg) 50%);
        border-top: 1px solid var(--card-border);
        border-right: 1px solid var(--card-border);
      }
      
      .cyber-card::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, transparent 50%, var(--card-bg) 50%);
        border-bottom: 1px solid var(--card-border);
        border-left: 1px solid var(--card-border);
      }
      
      /* Header */
      .card-header {
        padding: 16px 20px;
        border-bottom: 1px solid var(--card-border);
        background: rgba(0, 0, 0, 0.3);
        position: relative;
      }
      
      .card-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--card-color) 20%,
          var(--card-color) 80%,
          transparent 100%
        );
      }
      
      .card-title {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: bold;
        color: var(--card-color);
        font-family: var(--font-display, 'Orbitron', sans-serif);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .card-subtitle {
        margin: 0;
        font-size: 14px;
        color: var(--card-text-secondary);
        font-family: var(--font-mono, 'Share Tech Mono', monospace);
      }
      
      /* Content */
      .card-content {
        padding: 20px;
        color: var(--card-text);
        line-height: 1.5;
      }
      
      /* Footer */
      .card-footer {
        padding: 16px 20px;
        border-top: 1px solid var(--card-border);
        background: rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      /* Loading overlay */
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }
      
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--card-border);
        border-top: 3px solid var(--card-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Scan line effect */
      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--card-color) 50%,
          transparent 100%
        );
        opacity: 0;
        transform: translateY(-100%);
        pointer-events: none;
      }
      
      :host([interactive]) .cyber-card:hover .scan-line {
        opacity: 0.8;
        animation: scan 2s linear infinite;
      }
      
      @keyframes scan {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(calc(100vh + 100px));
        }
      }
      
      /* Status indicators */
      .status-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--card-color);
        box-shadow: 0 0 10px var(--card-color);
      }
      
      :host([error]) .status-indicator {
        animation: pulse-error 1s ease-in-out infinite;
      }
      
      :host([success]) .status-indicator {
        animation: pulse-success 1s ease-in-out infinite;
      }
      
      @keyframes pulse-error {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      @keyframes pulse-success {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Data grid styling for tables */
      :host([variant="data"]) .card-content {
        padding: 0;
      }
      
      :host([variant="data"]) .cyber-card {
        border-radius: 0;
      }
      
      /* Compact variant */
      :host([variant="compact"]) .card-header {
        padding: 12px 16px;
      }
      
      :host([variant="compact"]) .card-content {
        padding: 16px;
      }
      
      :host([variant="compact"]) .card-title {
        font-size: 16px;
      }
      
      /* Slot styling */
      ::slotted([slot="actions"]) {
        display: flex;
        gap: 8px;
      }
      
      ::slotted([slot="icon"]) {
        margin-right: 8px;
        color: var(--card-color);
      }
    `;
  }
  
  getTemplate() {
    const hasHeader = this._title || this._subtitle || this.querySelector('[slot="header"]');
    const hasFooter = this.querySelector('[slot="footer"]') || this.querySelector('[slot="actions"]');
    
    return `
      <div class="cyber-card">
        ${hasHeader ? `
          <div class="card-header">
            <slot name="icon"></slot>
            ${this._title ? `<h3 class="card-title">${this._title}</h3>` : ''}
            ${this._subtitle ? `<p class="card-subtitle">${this._subtitle}</p>` : ''}
            <slot name="header"></slot>
          </div>
        ` : ''}
        
        <div class="card-content">
          <slot></slot>
        </div>
        
        ${hasFooter ? `
          <div class="card-footer">
            <slot name="footer"></slot>
            <slot name="actions"></slot>
          </div>
        ` : ''}
        
        ${this._loading ? `
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        ` : ''}
        
        ${(this._error || this._success) ? '<div class="status-indicator"></div>' : ''}
        
        <div class="scan-line"></div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (this._interactive) {
      this.addEventListener('click', this.handleClick.bind(this));
      this.addEventListener('keydown', this.handleKeydown.bind(this));
      this.setAttribute('tabindex', '0');
    }
  }
  
  handleClick(e) {
    this.dispatchEvent(new CustomEvent('cyber-card-click', {
      bubbles: true,
      composed: true,
      detail: { originalEvent: e }
    }));
  }
  
  handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleClick(e);
    }
  }
  
  // Public API
  setLoading(loading) {
    if (loading) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }
  
  setError(error, message) {
    if (error) {
      this.setAttribute('error', '');
      if (message) {
        this.setAttribute('title', message);
      }
    } else {
      this.removeAttribute('error');
    }
  }
  
  setSuccess(success, message) {
    if (success) {
      this.setAttribute('success', '');
      if (message) {
        this.setAttribute('title', message);
      }
    } else {
      this.removeAttribute('success');
    }
  }
}

// Register the component
customElements.define('cyber-card', CyberCard);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CyberCard;
}