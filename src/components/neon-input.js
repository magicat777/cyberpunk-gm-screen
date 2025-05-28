/**
 * NeonInput Web Component
 * A cyberpunk-styled input field with scanning effects and validation
 */

class NeonInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default properties
    this._type = 'text';
    this._placeholder = '';
    this._value = '';
    this._disabled = false;
    this._readonly = false;
    this._required = false;
    this._pattern = null;
    this._error = false;
    this._success = false;
    this._scanning = true;
    this._variant = 'primary';
    
    // Internal state
    this._isValid = true;
    this._isDirty = false;
    this._isFocused = false;
  }
  
  static get observedAttributes() {
    return [
      'type', 'placeholder', 'value', 'disabled', 'readonly', 
      'required', 'pattern', 'error', 'success', 'no-scan',
      'variant', 'label', 'helper-text', 'error-text',
      'min', 'max', 'step', 'minlength', 'maxlength', 'show-counter'
    ];
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  disconnectedCallback() {
    const input = this.shadowRoot.querySelector('.neon-input');
    if (input) {
      input.removeEventListener('input', this.handleInput);
      input.removeEventListener('focus', this.handleFocus);
      input.removeEventListener('blur', this.handleBlur);
      input.removeEventListener('change', this.handleChange);
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'type':
        this._type = newValue || 'text';
        break;
      case 'placeholder':
        this._placeholder = newValue || '';
        break;
      case 'value':
        this._value = newValue || '';
        break;
      case 'disabled':
        this._disabled = newValue !== null;
        break;
      case 'readonly':
        this._readonly = newValue !== null;
        break;
      case 'required':
        this._required = newValue !== null;
        break;
      case 'pattern':
        this._pattern = newValue;
        break;
      case 'error':
        this._error = newValue !== null;
        break;
      case 'success':
        this._success = newValue !== null;
        break;
      case 'no-scan':
        this._scanning = newValue === null;
        break;
      case 'variant':
        this._variant = newValue || 'primary';
        break;
      case 'label':
        this._label = newValue;
        break;
      case 'helper-text':
        this._helperText = newValue;
        break;
      case 'error-text':
        this._errorText = newValue;
        break;
      case 'min':
        this._min = newValue;
        break;
      case 'max':
        this._max = newValue;
        break;
      case 'step':
        this._step = newValue;
        break;
      case 'minlength':
        this._minLength = newValue;
        break;
      case 'maxlength':
        this._maxLength = newValue;
        break;
      case 'show-counter':
        this._showCounter = newValue !== null;
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
    
    // Set initial value
    const input = this.shadowRoot.querySelector('.neon-input');
    if (input && this._value) {
      input.value = this._value;
    }
  }
  
  getStyles() {
    return `
      :host {
        display: block;
        margin: 12px 0;
        --input-primary: var(--primary, #00ffff);
        --input-secondary: var(--secondary, #ff00ff);
        --input-accent: var(--accent, #ffff00);
        --input-danger: var(--danger, #ff0040);
        --input-success: var(--success, #00ff00);
        --input-warning: var(--warning, #ff8800);
        --input-bg: var(--bg-primary, #0a0a0a);
        --input-surface: var(--bg-surface, rgba(255, 255, 255, 0.05));
        --input-text: var(--text-primary, #e0e0e0);
        --input-text-secondary: var(--text-secondary, #a0a0a0);
        --input-border: var(--border-color, rgba(0, 255, 255, 0.3));
      }
      
      .neon-input-wrapper {
        position: relative;
      }
      
      .neon-label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 600;
        color: var(--input-text);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: 'Orbitron', monospace;
      }
      
      .neon-input-container {
        position: relative;
        display: flex;
        align-items: center;
      }
      
      .neon-input {
        width: 100%;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid var(--input-border);
        border-radius: 0;
        color: var(--input-text);
        font-family: 'Share Tech Mono', monospace;
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        clip-path: polygon(
          0 0,
          calc(100% - 8px) 0,
          100% 8px,
          100% 100%,
          8px 100%,
          0 calc(100% - 8px)
        );
      }
      
      /* Variants */
      :host([variant="primary"]) { --input-color: var(--input-primary); }
      :host([variant="secondary"]) { --input-color: var(--input-secondary); }
      :host([variant="accent"]) { --input-color: var(--input-accent); }
      
      /* States */
      .neon-input:hover:not(:disabled) {
        border-color: var(--input-color);
        background: rgba(0, 0, 0, 0.8);
      }
      
      .neon-input:focus {
        border-color: var(--input-color);
        box-shadow: 
          0 0 10px var(--input-color),
          inset 0 0 10px rgba(255, 255, 255, 0.05);
        background: rgba(0, 0, 0, 0.9);
      }
      
      .neon-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: rgba(0, 0, 0, 0.3);
      }
      
      .neon-input::placeholder {
        color: var(--input-text-secondary);
        opacity: 0.6;
      }
      
      /* Error state */
      :host([error]) .neon-input {
        border-color: var(--input-danger);
        color: var(--input-danger);
      }
      
      :host([error]) .neon-input:focus {
        box-shadow: 
          0 0 10px var(--input-danger),
          inset 0 0 10px rgba(255, 0, 64, 0.1);
      }
      
      /* Success state */
      :host([success]) .neon-input {
        border-color: var(--input-success);
        color: var(--input-success);
      }
      
      :host([success]) .neon-input:focus {
        box-shadow: 
          0 0 10px var(--input-success),
          inset 0 0 10px rgba(0, 255, 0, 0.1);
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
          var(--input-color) 50%,
          transparent 100%
        );
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      
      .neon-input:focus ~ .scan-line {
        opacity: 1;
        animation: scan 2s linear infinite;
      }
      
      @keyframes scan {
        0% { transform: translateY(0); }
        100% { transform: translateY(44px); }
      }
      
      /* Glitch effect on error */
      :host([error]) .neon-input {
        animation: error-glitch 0.3s;
      }
      
      @keyframes error-glitch {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      /* Icon slots */
      .input-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        pointer-events: none;
        color: var(--input-text-secondary);
      }
      
      .input-icon.left {
        left: 12px;
      }
      
      .input-icon.right {
        right: 12px;
      }
      
      :host([icon-left]) .neon-input {
        padding-left: 44px;
      }
      
      :host([icon-right]) .neon-input {
        padding-right: 44px;
      }
      
      /* Helper and error text */
      .input-helper {
        margin-top: 6px;
        font-size: 12px;
        color: var(--input-text-secondary);
        font-family: 'Share Tech Mono', monospace;
        transition: color 0.3s;
      }
      
      :host([error]) .input-helper {
        color: var(--input-danger);
      }
      
      :host([success]) .input-helper {
        color: var(--input-success);
      }
      
      /* Number input arrows */
      .neon-input[type="number"]::-webkit-inner-spin-button,
      .neon-input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      
      .neon-input[type="number"] {
        -moz-appearance: textfield;
      }
      
      /* Number controls */
      .number-controls {
        position: absolute;
        right: 2px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      :host([type="number"]) .number-controls {
        display: flex;
      }
      
      :host(:not([type="number"])) .number-controls {
        display: none;
      }
      
      .number-btn {
        width: 20px;
        height: 16px;
        background: var(--input-surface);
        border: 1px solid var(--input-border);
        color: var(--input-text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        transition: all 0.2s;
        user-select: none;
      }
      
      .number-btn:hover {
        background: var(--input-color);
        color: var(--input-bg);
        border-color: var(--input-color);
      }
      
      .number-btn:active {
        transform: scale(0.95);
      }
      
      .number-btn.disabled {
        opacity: 0.3;
        cursor: not-allowed;
        pointer-events: none;
      }
      
      :host([type="number"]) .neon-input {
        padding-right: 28px;
      }
      
      .input-error {
        margin-top: 6px;
        font-size: 12px;
        color: var(--input-danger);
        font-family: 'Share Tech Mono', monospace;
        display: none;
      }
      
      :host([error]) .input-error {
        display: block;
      }
      
      :host([error]) .input-helper {
        display: none;
      }
      
      /* Character counter */
      .char-counter {
        position: absolute;
        bottom: -20px;
        right: 0;
        font-size: 11px;
        color: var(--input-text-secondary);
        font-family: 'Share Tech Mono', monospace;
      }
      
      .char-counter.warning {
        color: var(--input-warning);
      }
      
      .char-counter.error {
        color: var(--input-danger);
      }
      
      /* Focus glow */
      .focus-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
        background: radial-gradient(
          ellipse at center,
          var(--input-color) 0%,
          transparent 70%
        );
        opacity: 0;
        filter: blur(20px);
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: -1;
      }
      
      .neon-input:focus ~ .focus-glow {
        opacity: 0.3;
      }
      
      /* Type variations */
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      
      input[type="number"] {
        -moz-appearance: textfield;
      }
      
      /* Password visibility toggle */
      .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--input-text-secondary);
        cursor: pointer;
        padding: 4px;
        transition: color 0.3s;
      }
      
      .password-toggle:hover {
        color: var(--input-color);
      }
      
      /* Autocomplete styling */
      .neon-input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 30px var(--input-bg) inset;
        -webkit-text-fill-color: var(--input-color);
      }
    `;
  }
  
  getTemplate() {
    const showPasswordToggle = this._type === 'password';
    const hasLabel = this._label;
    const hasHelper = this._helperText && !this._error;
    const hasError = this._errorText && this._error;
    const showCharCounter = this._showCounter && (this._minLength || this._maxLength);
    
    return `
      <div class="neon-input-wrapper">
        ${hasLabel ? `<label class="neon-label">${this._label}</label>` : ''}
        
        <div class="neon-input-container">
          <slot name="icon-left" class="input-icon left"></slot>
          
          <input 
            class="neon-input"
            type="${this._type}"
            placeholder="${this._placeholder}"
            ${this._disabled ? 'disabled' : ''}
            ${this._readonly ? 'readonly' : ''}
            ${this._required ? 'required' : ''}
            ${this._pattern ? `pattern="${this._pattern}"` : ''}
            ${this._min !== undefined ? `min="${this._min}"` : ''}
            ${this._max !== undefined ? `max="${this._max}"` : ''}
            ${this._step !== undefined ? `step="${this._step}"` : ''}
            ${this._minLength !== undefined ? `minlength="${this._minLength}"` : ''}
            ${this._maxLength !== undefined ? `maxlength="${this._maxLength}"` : ''}
          >
          
          ${this._scanning ? '<div class="scan-line"></div>' : ''}
          <div class="focus-glow"></div>
          
          <slot name="icon-right" class="input-icon right"></slot>
          
          ${showPasswordToggle ? `
            <button class="password-toggle" type="button" aria-label="Toggle password visibility">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          ` : ''}
          
          ${this._type === 'number' ? `
            <div class="number-controls">
              <button class="number-btn up" type="button" aria-label="Increase value">▲</button>
              <button class="number-btn down" type="button" aria-label="Decrease value">▼</button>
            </div>
          ` : ''}
          
          ${showCharCounter ? `
            <div class="char-counter" id="charCounter">
              0${this._maxLength ? ` / ${this._maxLength}` : ''}
            </div>
          ` : ''}
        </div>
        
        ${hasHelper ? `<div class="input-helper">${this._helperText}</div>` : ''}
        ${hasError ? `<div class="input-error">${this._errorText}</div>` : ''}
      </div>
    `;
  }
  
  setupEventListeners() {
    const input = this.shadowRoot.querySelector('.neon-input');
    if (!input) return;
    
    // Input events
    this.handleInput = this.onInput.bind(this);
    this.handleFocus = this.onFocus.bind(this);
    this.handleBlur = this.onBlur.bind(this);
    this.handleChange = this.onChange.bind(this);
    
    input.addEventListener('input', this.handleInput);
    input.addEventListener('focus', this.handleFocus);
    input.addEventListener('blur', this.handleBlur);
    input.addEventListener('change', this.handleChange);
    
    // Password toggle
    const passwordToggle = this.shadowRoot.querySelector('.password-toggle');
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
    }
    
    // Number controls
    if (this._type === 'number') {
      const upBtn = this.shadowRoot.querySelector('.number-btn.up');
      const downBtn = this.shadowRoot.querySelector('.number-btn.down');
      
      if (upBtn) {
        upBtn.addEventListener('click', () => this.stepUp());
      }
      
      if (downBtn) {
        downBtn.addEventListener('click', () => this.stepDown());
      }
      
      // Keyboard support
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.stepUp();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.stepDown();
        }
      });
    }
  }
  
  onInput(e) {
    this._value = e.target.value;
    this._isDirty = true;
    
    // Update character counter
    this.updateCharCounter();
    
    // Validate
    this.validate();
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('neon-input', {
      bubbles: true,
      composed: true,
      detail: { value: this._value }
    }));
  }
  
  updateCharCounter() {
    const counter = this.shadowRoot.querySelector('.char-counter');
    if (!counter) return;
    
    const length = this._value ? this._value.length : 0;
    const maxLength = this._maxLength ? parseInt(this._maxLength) : null;
    const minLength = this._minLength ? parseInt(this._minLength) : null;
    
    // Update counter text
    if (maxLength) {
      counter.textContent = `${length} / ${maxLength}`;
      
      // Update counter color based on status
      counter.classList.remove('warning', 'error');
      if (length > maxLength) {
        counter.classList.add('error');
      } else if (length > maxLength * 0.8) {
        counter.classList.add('warning');
      }
    } else if (minLength) {
      counter.textContent = `${length} (min: ${minLength})`;
      
      // Update counter color based on status
      counter.classList.remove('warning', 'error');
      if (length < minLength && length > 0) {
        counter.classList.add('error');
      }
    } else {
      counter.textContent = length.toString();
    }
  }
  
  onFocus(e) {
    this._isFocused = true;
    
    // Play focus sound
    if (this.hasAttribute('sound')) {
      this.playFocusSound();
    }
    
    this.dispatchEvent(new CustomEvent('neon-focus', {
      bubbles: true,
      composed: true
    }));
  }
  
  onBlur(e) {
    this._isFocused = false;
    
    // Validate on blur if dirty
    if (this._isDirty) {
      this.validate();
    }
    
    this.dispatchEvent(new CustomEvent('neon-blur', {
      bubbles: true,
      composed: true
    }));
  }
  
  onChange(e) {
    this.dispatchEvent(new CustomEvent('neon-change', {
      bubbles: true,
      composed: true,
      detail: { value: this._value }
    }));
  }
  
  validate() {
    const input = this.shadowRoot.querySelector('.neon-input');
    if (!input) return true;
    
    let errorMessage = '';
    
    // Required validation
    if (this._required && !this._value) {
      this._isValid = false;
      errorMessage = 'This field is required';
    }
    // Min/Max length validation for text inputs
    else if ((this._type === 'text' || this._type === 'password' || this._type === 'email') && this._value) {
      const minLength = parseInt(this.getAttribute('minlength')) || 0;
      const maxLength = parseInt(this.getAttribute('maxlength')) || Infinity;
      
      if (this._value.length < minLength) {
        this._isValid = false;
        errorMessage = `Minimum ${minLength} characters required`;
      } else if (this._value.length > maxLength) {
        this._isValid = false;
        errorMessage = `Maximum ${maxLength} characters allowed`;
      } else {
        this._isValid = true;
      }
    }
    // Min/Max validation for number inputs
    else if (this._type === 'number' && this._value) {
      const value = parseFloat(this._value);
      const min = this._min !== undefined ? parseFloat(this._min) : -Infinity;
      const max = this._max !== undefined ? parseFloat(this._max) : Infinity;
      
      if (isNaN(value)) {
        this._isValid = false;
        errorMessage = 'Please enter a valid number';
      } else if (value < min) {
        this._isValid = false;
        errorMessage = `Minimum value is ${min}`;
      } else if (value > max) {
        this._isValid = false;
        errorMessage = `Maximum value is ${max}`;
      } else {
        this._isValid = true;
      }
    }
    // Email validation
    else if (this._type === 'email' && this._value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this._value)) {
        this._isValid = false;
        errorMessage = 'Please enter a valid email address';
      } else {
        this._isValid = true;
      }
    }
    // Pattern validation
    else if (this._pattern && this._value) {
      const regex = new RegExp(this._pattern);
      if (!regex.test(this._value)) {
        this._isValid = false;
        errorMessage = this.getAttribute('pattern-error') || 'Invalid format';
      } else {
        this._isValid = true;
      }
    }
    // HTML5 validation as fallback
    else {
      this._isValid = input.checkValidity();
      if (!this._isValid) {
        errorMessage = input.validationMessage;
      }
    }
    
    // Custom validation function
    if (this._isValid && this.hasAttribute('validator')) {
      const validator = this.getAttribute('validator');
      if (window[validator] && typeof window[validator] === 'function') {
        const result = window[validator](this._value);
        if (typeof result === 'boolean') {
          this._isValid = result;
          if (!result) {
            errorMessage = this.getAttribute('validator-error') || 'Validation failed';
          }
        } else if (typeof result === 'object' && result !== null) {
          this._isValid = result.valid;
          errorMessage = result.message || 'Validation failed';
        }
      }
    }
    
    // Update visual state and error message
    if (!this._isValid) {
      this.setAttribute('error', '');
      this.setAttribute('error-text', errorMessage);
      this.removeAttribute('success');
    } else if (this._isDirty && this._value) {
      this.removeAttribute('error');
      this.removeAttribute('error-text');
      this.setAttribute('success', '');
    } else {
      this.removeAttribute('error');
      this.removeAttribute('error-text');
      this.removeAttribute('success');
    }
    
    return this._isValid;
  }
  
  togglePasswordVisibility() {
    const input = this.shadowRoot.querySelector('.neon-input');
    const toggle = this.shadowRoot.querySelector('.password-toggle svg');
    
    if (input.type === 'password') {
      input.type = 'text';
      toggle.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
    } else {
      input.type = 'password';
      toggle.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
    }
  }
  
  playFocusSound() {
    if (!window.AudioContext) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
  
  // Public API
  get value() {
    return this._value;
  }
  
  set value(val) {
    this._value = val;
    const input = this.shadowRoot.querySelector('.neon-input');
    if (input) {
      input.value = val;
    }
  }
  
  focus() {
    const input = this.shadowRoot.querySelector('.neon-input');
    if (input) {
      input.focus();
    }
  }
  
  blur() {
    const input = this.shadowRoot.querySelector('.neon-input');
    if (input) {
      input.blur();
    }
  }
  
  clear() {
    this.value = '';
    this._isDirty = false;
    this.removeAttribute('error');
    this.removeAttribute('success');
  }
  
  checkValidity() {
    return this.validate();
  }
  
  // Number input methods
  stepUp() {
    const input = this.shadowRoot.querySelector('.neon-input');
    if (input && this._type === 'number') {
      const step = parseFloat(this.getAttribute('step')) || 1;
      const max = parseFloat(this.getAttribute('max')) || Infinity;
      const currentValue = parseFloat(input.value) || 0;
      const newValue = Math.min(currentValue + step, max);
      
      input.value = newValue;
      this._value = newValue.toString();
      
      // Trigger input event
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  stepDown() {
    const input = this.shadowRoot.querySelector('.neon-input');
    if (input && this._type === 'number') {
      const step = parseFloat(this.getAttribute('step')) || 1;
      const min = parseFloat(this.getAttribute('min')) || -Infinity;
      const currentValue = parseFloat(input.value) || 0;
      const newValue = Math.max(currentValue - step, min);
      
      input.value = newValue;
      this._value = newValue.toString();
      
      // Trigger input event
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  togglePasswordVisibility() {
    const input = this.shadowRoot.querySelector('.neon-input');
    const toggle = this.shadowRoot.querySelector('.password-toggle');
    
    if (input && toggle) {
      if (input.type === 'password') {
        input.type = 'text';
        toggle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        `;
      } else {
        input.type = 'password';
        toggle.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        `;
      }
    }
  }
}

// Register the component
customElements.define('neon-input', NeonInput);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NeonInput;
}