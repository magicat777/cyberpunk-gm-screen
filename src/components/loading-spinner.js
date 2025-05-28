/**
 * Loading Spinner Web Component
 * Cyberpunk-styled loading indicator
 */

class LoadingSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  static get observedAttributes() {
    return ['size', 'color', 'text'];
  }
  
  connectedCallback() {
    this.render();
  }
  
  attributeChangedCallback() {
    this.render();
  }
  
  render() {
    const size = this.getAttribute('size') || 'medium';
    const color = this.getAttribute('color') || 'primary';
    const text = this.getAttribute('text') || '';
    
    const sizes = {
      small: { spinner: 20, font: 10 },
      medium: { spinner: 40, font: 12 },
      large: { spinner: 60, font: 14 }
    };
    
    const currentSize = sizes[size] || sizes.medium;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .spinner-container {
          position: relative;
          width: ${currentSize.spinner}px;
          height: ${currentSize.spinner}px;
        }
        
        .spinner {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid var(--bg-surface, rgba(0, 255, 255, 0.1));
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }
        
        .spinner::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid transparent;
          border-top-color: var(--${color}, #0ff);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .spinner::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: var(--${color}, #0ff);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px var(--${color}, #0ff);
          animation: glow 1.5s ease-in-out infinite;
        }
        
        .loading-text {
          font-size: ${currentSize.font}px;
          color: var(--text-secondary, #999);
          font-family: var(--font-secondary, monospace);
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: fade 1.5s ease-in-out infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            opacity: 0.5;
            box-shadow: 0 0 5px var(--${color}, #0ff);
          }
          50% { 
            opacity: 1;
            box-shadow: 0 0 20px var(--${color}, #0ff);
          }
        }
        
        @keyframes fade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      </style>
      
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
      ${text ? `<div class="loading-text">${text}</div>` : ''}
    `;
  }
}

customElements.define('loading-spinner', LoadingSpinner);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoadingSpinner;
}