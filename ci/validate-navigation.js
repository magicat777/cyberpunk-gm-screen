/**
 * Navigation Validation Script for Cyberpunk GM Screen
 * 
 * This script validates HTML files for compliance with our 
 * navigation best practices. It should be run as part of the
 * CI/CD pipeline before deployment.
 * 
 * Usage: node validate-navigation.js [directory]
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Configuration
const config = {
  // Main directory to scan, defaults to docs
  scanDir: process.argv[2] || 'docs',
  
  // Validation rules
  rules: {
    maxNavDepth: 3,
    minContrastRatio: 4.5,
    minTapTargetSize: 44, // pixels
    requiredNavSections: ['Home', 'Tools', 'Reference', 'Documentation'],
    requiredAriaRoles: ['navigation', 'menuitem'],
    forbiddenAttributes: ['onclick'],
    activeStateRequired: true,
    breadcrumbsRequired: true,
    keyboardAccessRequired: true
  },
  
  // Files to ignore
  ignoreFiles: [
    'sitemap.xml',
    'favicon.ico',
    'test-',
    'minimal-',
    'fixed-',
    'bare-minimum',
    'ui-debug',
    'ui-test',
    'standalone-',
    'deployment/',
    'performance-comparison',
    'delegation-drag',
    'improved-drag',
    'test-frames/',
    'super-minimal',
    'template-'
  ],
  
  // Log thresholds
  errorThreshold: 0,  // Any errors fail the build
  warningThreshold: 5 // Allow up to 5 warnings
};

// Validation statistics
const stats = {
  filesScanned: 0,
  errors: 0,
  warnings: 0,
  passedFiles: 0,
  errorList: [],
  warningList: []
};

/**
 * Log an error with file info
 */
function logError(file, message) {
  const error = `ERROR in ${file}: ${message}`;
  stats.errors++;
  stats.errorList.push(error);
  console.error(error);
}

/**
 * Log a warning with file info
 */
function logWarning(file, message) {
  const warning = `WARNING in ${file}: ${message}`;
  stats.warnings++;
  stats.warningList.push(warning);
  console.warn(warning);
}

/**
 * Validate a single HTML file
 */
function validateFile(filePath) {
  const relPath = path.relative(config.scanDir, filePath);
  
  // Skip non-HTML files
  if (!filePath.toLowerCase().endsWith('.html')) {
    return;
  }
  
  // Skip ignored files
  if (config.ignoreFiles.some(pattern => filePath.includes(pattern))) {
    return;
  }
  
  stats.filesScanned++;
  console.log(`Scanning ${relPath}...`);
  
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    let fileErrors = 0;
    
    // VALIDATION 1: Navigation element exists
    const navElements = $('nav, [role="navigation"]');
    if (navElements.length === 0) {
      logError(relPath, 'No navigation element found. Use <nav> or role="navigation"');
      fileErrors++;
    }
    
    // VALIDATION 2: Check navigation depth
    navElements.each((i, nav) => {
      const nestingLevels = countNestingLevels($(nav));
      if (nestingLevels > config.rules.maxNavDepth) {
        logError(relPath, `Navigation depth (${nestingLevels}) exceeds maximum (${config.rules.maxNavDepth})`);
        fileErrors++;
      }
    });
    
    // VALIDATION 3: Required navigation sections
    const navText = navElements.text().toLowerCase();
    for (const section of config.rules.requiredNavSections) {
      if (!navText.includes(section.toLowerCase())) {
        logWarning(relPath, `Missing required navigation section: ${section}`);
      }
    }
    
    // VALIDATION 4: Active state for current page
    if (config.rules.activeStateRequired) {
      const hasActiveElement = $('[aria-current="page"], .active, .current').length > 0;
      if (!hasActiveElement) {
        logWarning(relPath, 'No active/current page indicator found');
      }
    }
    
    // VALIDATION 5: Check for breadcrumbs
    if (config.rules.breadcrumbsRequired) {
      const hasBreadcrumbs = $('[aria-label="breadcrumb"], .breadcrumb, .breadcrumbs').length > 0;
      if (!hasBreadcrumbs) {
        logWarning(relPath, 'No breadcrumb navigation found');
      }
    }
    
    // VALIDATION 6: Check for forbidden attributes (like inline JS)
    for (const attr of config.rules.forbiddenAttributes) {
      const elementsWithAttr = $(`[${attr}]`);
      if (elementsWithAttr.length > 0) {
        logWarning(relPath, `Found ${elementsWithAttr.length} elements with forbidden attribute: ${attr}`);
      }
    }
    
    // VALIDATION 7: Check keyboard accessibility
    if (config.rules.keyboardAccessRequired) {
      const interactiveElements = $('a, button, [role="button"], [tabindex]');
      let keyboardAccessible = true;
      
      interactiveElements.each((i, el) => {
        const tabindex = $(el).attr('tabindex');
        if (tabindex === '-1') {
          logWarning(relPath, `Element is not keyboard accessible: ${getElementDescription($(el))}`);
          keyboardAccessible = false;
        }
      });
      
      if (!keyboardAccessible) {
        fileErrors++;
      }
    }
    
    // Check if file passed all validations
    if (fileErrors === 0) {
      stats.passedFiles++;
      console.log(`✅ ${relPath} passed validation`);
    }
    
  } catch (error) {
    logError(relPath, `Error processing file: ${error.message}`);
  }
}

/**
 * Count the maximum nesting levels in a navigation element
 */
function countNestingLevels($element, currentLevel = 1) {
  let maxLevel = currentLevel;
  
  // Look for common navigation patterns: ul>li, ol>li, div>a, nav>div
  const children = $element.children('ul, ol, div, nav');
  
  children.each((i, child) => {
    const childLevel = countNestingLevels($(child), currentLevel + 1);
    maxLevel = Math.max(maxLevel, childLevel);
  });
  
  return maxLevel;
}

/**
 * Get a description of an element for error messages
 */
function getElementDescription($el) {
  const tag = $el.prop('tagName').toLowerCase();
  const id = $el.attr('id') ? `#${$el.attr('id')}` : '';
  const classes = $el.attr('class') ? `.${$el.attr('class').replace(/\s+/g, '.')}` : '';
  const text = $el.text().trim().substring(0, 20);
  
  return `<${tag}${id}${classes}>${text}${text.length >= 20 ? '...' : ''}</${tag}>`;
}

/**
 * Recursively scan a directory for HTML files
 */
function scanDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      validateFile(fullPath);
    }
  }
}

/**
 * Main function
 */
function main() {
  console.log(`🔍 Starting navigation validation in ${config.scanDir}`);
  
  try {
    scanDirectory(config.scanDir);
    
    // Output results
    console.log('\n--- Navigation Validation Results ---');
    console.log(`Total files scanned: ${stats.filesScanned}`);
    console.log(`Files passed: ${stats.passedFiles}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Warnings: ${stats.warnings}`);
    
    // Determine overall pass/fail
    const passed = stats.errors <= config.errorThreshold && 
                  stats.warnings <= config.warningThreshold;
    
    if (passed) {
      console.log('\n✅ VALIDATION PASSED');
      process.exit(0);
    } else {
      console.log('\n❌ VALIDATION FAILED');
      
      if (stats.errors > 0) {
        console.log('\nErrors:');
        stats.errorList.forEach(error => console.log(`- ${error}`));
      }
      
      if (stats.warnings > config.warningThreshold) {
        console.log('\nWarnings:');
        stats.warningList.forEach(warning => console.log(`- ${warning}`));
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`Error scanning directory: ${error.message}`);
    process.exit(1);
  }
}

// Run the validation
main();