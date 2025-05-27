const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const PERFORMANCE_BUDGET = {
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  firstContentfulPaint: 1000, // ms
  largestContentfulPaint: 2000, // ms
  totalBlockingTime: 200, // ms
  cumulativeLayoutShift: 0.1
};

async function runLighthouseTest(url, name) {
  console.log(`\nRunning Lighthouse test for: ${name}`);
  console.log('URL:', url);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox']
  });
  
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices'],
    port: chrome.port,
    throttling: {
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 675
    }
  };
  
  try {
    const runnerResult = await lighthouse(url, options);
    const report = runnerResult.lhr;
    
    // Extract scores
    const scores = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100)
    };
    
    // Extract metrics
    const metrics = {
      firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
      totalBlockingTime: report.audits['total-blocking-time'].numericValue,
      cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue
    };
    
    // Display results
    console.log('\n📊 Scores:');
    console.log(`   Performance: ${scores.performance}/100 ${scores.performance >= PERFORMANCE_BUDGET.performance ? '✅' : '❌'}`);
    console.log(`   Accessibility: ${scores.accessibility}/100 ${scores.accessibility >= PERFORMANCE_BUDGET.accessibility ? '✅' : '❌'}`);
    console.log(`   Best Practices: ${scores.bestPractices}/100 ${scores.bestPractices >= PERFORMANCE_BUDGET.bestPractices ? '✅' : '❌'}`);
    
    console.log('\n⚡ Performance Metrics:');
    console.log(`   First Contentful Paint: ${Math.round(metrics.firstContentfulPaint)}ms ${metrics.firstContentfulPaint <= PERFORMANCE_BUDGET.firstContentfulPaint ? '✅' : '❌'}`);
    console.log(`   Largest Contentful Paint: ${Math.round(metrics.largestContentfulPaint)}ms ${metrics.largestContentfulPaint <= PERFORMANCE_BUDGET.largestContentfulPaint ? '✅' : '❌'}`);
    console.log(`   Total Blocking Time: ${Math.round(metrics.totalBlockingTime)}ms ${metrics.totalBlockingTime <= PERFORMANCE_BUDGET.totalBlockingTime ? '✅' : '❌'}`);
    console.log(`   Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)} ${metrics.cumulativeLayoutShift <= PERFORMANCE_BUDGET.cumulativeLayoutShift ? '✅' : '❌'}`);
    
    // Check if passes budget
    const passesPerformanceBudget = 
      scores.performance >= PERFORMANCE_BUDGET.performance &&
      scores.accessibility >= PERFORMANCE_BUDGET.accessibility &&
      scores.bestPractices >= PERFORMANCE_BUDGET.bestPractices &&
      metrics.firstContentfulPaint <= PERFORMANCE_BUDGET.firstContentfulPaint &&
      metrics.largestContentfulPaint <= PERFORMANCE_BUDGET.largestContentfulPaint &&
      metrics.totalBlockingTime <= PERFORMANCE_BUDGET.totalBlockingTime &&
      metrics.cumulativeLayoutShift <= PERFORMANCE_BUDGET.cumulativeLayoutShift;
    
    // Save detailed report
    const reportPath = `./tests/performance/reports/${name.replace(/\s+/g, '-').toLowerCase()}-report.json`;
    fs.mkdirSync('./tests/performance/reports', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    return {
      name,
      scores,
      metrics,
      passes: passesPerformanceBudget
    };
  } finally {
    await chrome.kill();
  }
}

async function runAllTests() {
  console.log('🚀 Starting Performance Test Suite');
  console.log('================================\n');
  console.log('Performance Budget:');
  console.log(JSON.stringify(PERFORMANCE_BUDGET, null, 2));
  
  const tests = [
    {
      url: `file://${__dirname}/../../panel-demo-simple.html`,
      name: 'Panel Demo Page'
    },
    {
      url: `file://${__dirname}/../../demo.html`,
      name: 'Design System Demo'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await runLighthouseTest(test.url, test.name);
      results.push(result);
    } catch (error) {
      console.error(`\n❌ Error testing ${test.name}:`, error.message);
      results.push({
        name: test.name,
        error: error.message,
        passes: false
      });
    }
  }
  
  // Summary
  console.log('\n\n📊 PERFORMANCE TEST SUMMARY');
  console.log('============================');
  
  const passed = results.filter(r => r.passes).length;
  const failed = results.length - passed;
  
  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  
  if (failed > 0) {
    console.log('\n❌ Performance budget not met!');
    process.exit(1);
  } else {
    console.log('\n✅ All performance budgets met!');
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(console.error);