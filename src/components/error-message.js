/**
 * Error Message Web Component
 * Cyberpunk-styled error display with retry functionality
 */

class ErrorMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  static get observedAttributes() {
    return ['title', 'message', 'type', 'show-retry'];
  }
  
  connectedCallback() {
    this.render();
  }
  
  attributeChangedCallback() {
    this.render();
  }
  
  render() {
    const title = this.getAttribute('title') || 'Error';
    const message = this.getAttribute('message') || 'Something went wrong';
    const type = this.getAttribute('type') || 'error'; // error, warning, info
    const showRetry = this.getAttribute('show-retry') !== 'false';
    
    const icons = {
      error: '⚠️',
      warning: '⚡',
      info: 'ℹ️'
    };
    
    const colors = {
      error: 'danger',
      warning: 'warning',
      info: 'primary'
    };
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .error-container {
          background: var(--bg-surface, #1a1a1a);
          border: 1px solid var(--${colors[type]}, #ff0033);
          border-radius: 4px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }
        
        .error-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--${colors[type]}, #ff0033);
        }
        
        .error-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--${colors[type]}, #ff0033),
            transparent
          );
          animation: scan 2s linear infinite;
        }
        
        .error-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .error-icon {
          font-size: 24px;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .error-title {
          font-size: 16px;
          font-weight: bold;
          color: var(--${colors[type]}, #ff0033);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }
        
        .error-message {
          color: var(--text-primary, #fff);
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 15px 0;
        }
        
        .error-actions {
          display: flex;
          gap: 10px;
        }
        
        .retry-button {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--${colors[type]}, #ff0033);
          color: var(--${colors[type]}, #ff0033);
          cursor: pointer;
          font-family: var(--font-secondary, monospace);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .retry-button:hover {
          background: var(--${colors[type]}, #ff0033);
          color: var(--bg-primary, #000);
          transform: translateY(-1px);
        }
        
        .retry-button:active {
          transform: translateY(0);
        }
        
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          background: transparent;
          border: 1px solid var(--border-color, #333);
          color: var(--text-secondary, #999);
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .close-button:hover {
          border-color: var(--${colors[type]}, #ff0033);
          color: var(--${colors[type]}, #ff0033);
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        /* Glitch effect for errors */
        .error-container.error-type {
          animation: slideIn 0.3s ease-out, glitch 3s ease-in-out infinite;
        }
        
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          92% { transform: translateX(0); }
          92.5% { transform: translateX(-2px); }
          93% { transform: translateX(2px); }
          93.5% { transform: translateX(0); }
        }
      </style>
      
      <div class="error-container ${type}-type">
        <button class="close-button" aria-label="Close">×</button>
        <div class="error-header">
          <span class="error-icon">${icons[type]}</span>
          <h3 class="error-title">${title}</h3>
        </div>
        <p class="error-message">${message}</p>
        ${showRetry ? `
          <div class="error-actions">
            <button class="retry-button">Retry</button>
          </div>
        ` : ''}
      </div>
    `;
    
    // Add event listeners
    const closeBtn = this.shadowRoot.querySelector('.close-button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('close'));
        this.remove();
      });
    }
    
    const retryBtn = this.shadowRoot.querySelector('.retry-button');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('retry'));
      });
    }
  }
}

customElements.define('error-message', ErrorMessage);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorMessage;
}