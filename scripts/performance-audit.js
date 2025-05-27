#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

async function runLighthouse(url, opts = {}, config = null) {
  const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
  opts.port = chrome.port;

  try {
    const results = await lighthouse(url, opts, config);
    return results.lhr;
  } finally {
    await chrome.kill();
  }
}

async function auditPerformance() {
  const urls = [
    'http://localhost:8888/app.html',
    'http://localhost:8888/app-modern-updated.html',
  ];

  const opts = {
    chromeFlags: ['--headless'],
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  };

  const results = {};

  for (const url of urls) {
    console.log(`Auditing ${url}...`);
    
    try {
      const report = await runLighthouse(url, opts);
      
      const pageName = path.basename(url);
      results[pageName] = {
        scores: {
          performance: report.categories.performance.score * 100,
          accessibility: report.categories.accessibility.score * 100,
          bestPractices: report.categories['best-practices'].score * 100,
          seo: report.categories.seo.score * 100,
        },
        metrics: {
          firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
          speedIndex: report.audits['speed-index'].numericValue,
          largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
          timeToInteractive: report.audits['interactive'].numericValue,
          totalBlockingTime: report.audits['total-blocking-time'].numericValue,
          cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue,
        },
        issues: {
          accessibility: report.audits['color-contrast']?.details?.items?.length || 0,
          touchTargets: report.audits['tap-targets']?.details?.items?.length || 0,
        },
      };
    } catch (error) {
      console.error(`Error auditing ${url}:`, error.message);
      results[pageName] = { error: error.message };
    }
  }

  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(__dirname, '..', 'reports', `performance-audit-${timestamp}.json`);
  
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  
  console.log('\nPerformance Audit Results:');
  console.log('=========================');
  
  for (const [page, data] of Object.entries(results)) {
    if (data.error) {
      console.log(`\n${page}: ERROR - ${data.error}`);
      continue;
    }
    
    console.log(`\n${page}:`);
    console.log('  Scores:');
    console.log(`    Performance: ${data.scores.performance.toFixed(0)}/100`);
    console.log(`    Accessibility: ${data.scores.accessibility.toFixed(0)}/100`);
    console.log(`    Best Practices: ${data.scores.bestPractices.toFixed(0)}/100`);
    console.log(`    SEO: ${data.scores.seo.toFixed(0)}/100`);
    console.log('  Key Metrics:');
    console.log(`    First Contentful Paint: ${(data.metrics.firstContentfulPaint / 1000).toFixed(2)}s`);
    console.log(`    Time to Interactive: ${(data.metrics.timeToInteractive / 1000).toFixed(2)}s`);
    console.log(`    Total Blocking Time: ${data.metrics.totalBlockingTime.toFixed(0)}ms`);
    console.log(`    Cumulative Layout Shift: ${data.metrics.cumulativeLayoutShift.toFixed(3)}`);
  }
  
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

// Check if server is running
const http = require('http');
http.get('http://localhost:8888', (res) => {
  if (res.statusCode === 200 || res.statusCode === 304) {
    auditPerformance().catch(console.error);
  }
}).on('error', () => {
  console.error('Error: Local server is not running on port 8888');
  console.log('Please run: python -m http.server 8888 --directory src/');
  process.exit(1);
});