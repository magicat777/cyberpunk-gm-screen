/**
 * Super Simple Console Fix
 * Copy this entire file and paste it in your browser console while on the Cyberpunk GM Screen
 */

(function() {
  // Configuration - Edit these values
  const fontSize = 16; // Size in pixels
  const fontFamily = "Share Tech Mono";
  
  console.log(`Applying font fix: ${fontSize}px ${fontFamily}`);
  
  // 1. Apply to CSS variables
  document.documentElement.style.setProperty('--cp-base-font-size', `${fontSize}px`);
  document.documentElement.style.setProperty('--cp-font-family', fontFamily);
  
  // 2. Create a direct style element
  const style = document.createElement('style');
  style.textContent = `
    /* Global selectors */
    * {
      font-size: ${fontSize}px !important;
      font-family: ${fontFamily}, monospace !important;
    }
    
    /* Main panel content */
    .cp-panel__content,
    .cp-panel__content * {
      font-size: ${fontSize}px !important;
      font-family: ${fontFamily}, monospace !important;
    }
    
    /* Problem panels */
    [data-component="character-states"] .cp-panel__content,
    [data-component="character-states"] .cp-panel__content *,
    [data-component="standard-dv"] .cp-panel__content,
    [data-component="standard-dv"] .cp-panel__content * {
      font-size: ${fontSize}px !important;
      font-family: ${fontFamily}, monospace !important;
    }
    
    /* Tables */
    table, th, td, tr, thead, tbody {
      font-size: ${fontSize}px !important;
      font-family: ${fontFamily}, monospace !important;
    }
  `;
  
  // Remove any existing style
  const existingStyle = document.getElementById('emergency-font-fix');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add style ID and append to document
  style.id = 'emergency-font-fix';
  document.head.appendChild(style);
  
  // 3. Direct application to all elements
  const allElements = document.querySelectorAll('*');
  console.log(`Applying direct styles to ${allElements.length} elements...`);
  
  // Apply to 100 elements at a time to avoid freezing
  function applyBatch(elements, startIndex, batchSize) {
    const endIndex = Math.min(startIndex + batchSize, elements.length);
    console.log(`Applying batch ${startIndex} to ${endIndex}...`);
    
    for (let i = startIndex; i < endIndex; i++) {
      try {
        const el = elements[i];
        el.style.fontSize = `${fontSize}px`;
        el.style.fontFamily = `${fontFamily}, monospace`;
      } catch (err) {
        // Ignore errors
      }
    }
    
    // Process next batch if needed
    if (endIndex < elements.length) {
      setTimeout(() => {
        applyBatch(elements, endIndex, batchSize);
      }, 0);
    } else {
      console.log("Font application complete!");
      alert(`Font settings applied: ${fontSize}px ${fontFamily}`);
    }
  }
  
  // Start applying in batches
  applyBatch(allElements, 0, 100);
  
  // Create a simple control panel
  const control = document.createElement('div');
  control.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #00f0ff;
    padding: 10px;
    border: 1px solid #00f0ff;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    border-radius: 5px;
  `;
  
  control.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold;">Font Control</div>
    <div style="display: flex; gap: 5px; margin-bottom: 5px;">
      <button id="size-12" style="flex: 1; padding: 3px; background: #111; color: #fff; border: 1px solid #00f0ff; cursor: pointer;">12px</button>
      <button id="size-14" style="flex: 1; padding: 3px; background: #111; color: #fff; border: 1px solid #00f0ff; cursor: pointer;">14px</button>
      <button id="size-16" style="flex: 1; padding: 3px; background: #111; color: #fff; border: 1px solid #00f0ff; cursor: pointer;">16px</button>
      <button id="size-18" style="flex: 1; padding: 3px; background: #111; color: #fff; border: 1px solid #00f0ff; cursor: pointer;">18px</button>
    </div>
  `;
  
  // Remove any existing control
  const existingControl = document.getElementById('emergency-font-control');
  if (existingControl) {
    existingControl.remove();
  }
  
  // Add control ID and append to document
  control.id = 'emergency-font-control';
  document.body.appendChild(control);
  
  // Add button event listeners
  ['12', '14', '16', '18'].forEach(size => {
    document.getElementById(`size-${size}`).addEventListener('click', () => {
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          const fontSize = ${size};
          const fontFamily = "${fontFamily}";
          
          // Apply to CSS variables
          document.documentElement.style.setProperty('--cp-base-font-size', \`\${fontSize}px\`);
          
          // Update the style element
          const style = document.getElementById('emergency-font-fix');
          if (style) {
            style.textContent = style.textContent.replace(/font-size: \\d+px/g, \`font-size: \${fontSize}px\`);
          }
          
          alert(\`Font size changed to \${fontSize}px\`);
        })();
      `;
      document.head.appendChild(script);
      script.remove();
    });
  });
  
  return "Font fix applied successfully! You can now use the control panel in the top right to adjust font size.";
})();