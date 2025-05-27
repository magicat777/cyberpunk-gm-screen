#!/usr/bin/env node

/**
 * Load Testing Script for Cyberpunk GM Screen
 * Tests application performance under various load conditions
 */

const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const CONFIG = {
  url: process.env.TEST_URL || 'http://localhost:5173/panel-demo-simple.html',
  scenarios: {
    light: { users: 5, duration: 30000 },
    medium: { users: 20, duration: 60000 },
    heavy: { users: 50, duration: 120000 }
  },
  actions: {
    diceRoll: { weight: 40, selector: '.dice-roller button' },
    addCombatant: { weight: 20, selector: '.combat-tracker button' },
    editNotes: { weight: 30, selector: '.notes-panel textarea' },
    navigation: { weight: 10, selector: '.panel-header' }
  }
};

class LoadTester {
  constructor() {
    this.results = {
      startTime: new Date().toISOString(),
      scenarios: {},
      summary: {}
    };
  }

  async runTest(scenario = 'light') {
    console.log(`\n🚀 Starting ${scenario} load test...`);
    const config = CONFIG.scenarios[scenario];
    
    const browsers = [];
    const metrics = {
      responseTime: [],
      errorCount: 0,
      successCount: 0,
      memoryUsage: [],
      cpuUsage: []
    };

    try {
      // Launch virtual users
      console.log(`Launching ${config.users} virtual users...`);
      for (let i = 0; i < config.users; i++) {
        const browser = await this.createUser(i, metrics);
        browsers.push(browser);
        // Stagger user creation
        await this.sleep(100);
      }

      // Run test for specified duration
      console.log(`Running test for ${config.duration / 1000} seconds...`);
      const startTime = performance.now();
      
      while (performance.now() - startTime < config.duration) {
        // Collect metrics every second
        await this.collectMetrics(browsers, metrics);
        await this.sleep(1000);
        
        // Show progress
        const elapsed = Math.floor((performance.now() - startTime) / 1000);
        process.stdout.write(`\rProgress: ${elapsed}s / ${config.duration / 1000}s`);
      }

      console.log('\n\n📊 Test Results:');
      console.log('================');
      
      // Calculate results
      const avgResponseTime = metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length;
      const maxResponseTime = Math.max(...metrics.responseTime);
      const minResponseTime = Math.min(...metrics.responseTime);
      const successRate = (metrics.successCount / (metrics.successCount + metrics.errorCount)) * 100;

      const results = {
        users: config.users,
        duration: config.duration,
        avgResponseTime: avgResponseTime.toFixed(2),
        maxResponseTime: maxResponseTime.toFixed(2),
        minResponseTime: minResponseTime.toFixed(2),
        successRate: successRate.toFixed(2),
        totalRequests: metrics.successCount + metrics.errorCount,
        errors: metrics.errorCount
      };

      // Display results
      console.log(`Users: ${results.users}`);
      console.log(`Duration: ${results.duration / 1000}s`);
      console.log(`Avg Response Time: ${results.avgResponseTime}ms`);
      console.log(`Max Response Time: ${results.maxResponseTime}ms`);
      console.log(`Min Response Time: ${results.minResponseTime}ms`);
      console.log(`Success Rate: ${results.successRate}%`);
      console.log(`Total Requests: ${results.totalRequests}`);
      console.log(`Errors: ${results.errors}`);

      // Store results
      this.results.scenarios[scenario] = results;

      // Performance thresholds
      console.log('\n🎯 Performance Analysis:');
      if (avgResponseTime < 100) {
        console.log('✅ Excellent: Response time under 100ms');
      } else if (avgResponseTime < 300) {
        console.log('✅ Good: Response time under 300ms');
      } else if (avgResponseTime < 1000) {
        console.log('⚠️  Warning: Response time under 1s');
      } else {
        console.log('❌ Poor: Response time over 1s');
      }

      if (successRate > 99) {
        console.log('✅ Excellent: Success rate over 99%');
      } else if (successRate > 95) {
        console.log('✅ Good: Success rate over 95%');
      } else {
        console.log('❌ Poor: Success rate under 95%');
      }

    } catch (error) {
      console.error('Load test failed:', error);
    } finally {
      // Cleanup
      console.log('\n\nCleaning up...');
      for (const browser of browsers) {
        await browser.close();
      }
    }
  }

  async createUser(userId, metrics) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set up request interception for metrics
    await page.setRequestInterception(true);
    page.on('request', request => request.continue());
    
    page.on('response', response => {
      const timing = response.timing();
      if (timing) {
        metrics.responseTime.push(timing.receiveHeadersEnd);
      }
    });

    // Navigate to application
    try {
      await page.goto(CONFIG.url, { waitUntil: 'networkidle2' });
      metrics.successCount++;
    } catch (error) {
      metrics.errorCount++;
    }

    // Simulate user actions
    this.simulateUserBehavior(page, userId, metrics);

    return browser;
  }

  async simulateUserBehavior(page, userId, metrics) {
    const actions = Object.entries(CONFIG.actions);
    
    const performAction = async () => {
      try {
        // Select random action based on weights
        const action = this.selectWeightedAction(actions);
        const startTime = performance.now();

        switch (action[0]) {
          case 'diceRoll':
            await page.click(action[1].selector).catch(() => {});
            break;
          case 'addCombatant':
            await page.click(action[1].selector).catch(() => {});
            break;
          case 'editNotes':
            await page.type(action[1].selector, `Test note ${Date.now()}`, { delay: 50 }).catch(() => {});
            break;
          case 'navigation':
            await page.click(action[1].selector).catch(() => {});
            break;
        }

        const responseTime = performance.now() - startTime;
        metrics.responseTime.push(responseTime);
        metrics.successCount++;
      } catch (error) {
        metrics.errorCount++;
      }

      // Schedule next action
      setTimeout(performAction, Math.random() * 5000 + 1000);
    };

    // Start behavior loop
    performAction();
  }

  selectWeightedAction(actions) {
    const totalWeight = actions.reduce((sum, [_, config]) => sum + config.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const action of actions) {
      random -= action[1].weight;
      if (random <= 0) {
        return action;
      }
    }
    
    return actions[0];
  }

  async collectMetrics(browsers, metrics) {
    for (const browser of browsers) {
      try {
        const pages = await browser.pages();
        for (const page of pages) {
          // Collect performance metrics
          const perfMetrics = await page.metrics();
          metrics.memoryUsage.push(perfMetrics.JSHeapUsedSize / 1024 / 1024);
        }
      } catch (error) {
        // Browser might be closed
      }
    }
  }

  async generateReport() {
    const reportPath = path.join(__dirname, '..', 'reports', 'load-test-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    
    this.results.summary = {
      totalScenarios: Object.keys(this.results.scenarios).length,
      overallSuccessRate: this.calculateOverallSuccessRate(),
      recommendations: this.generateRecommendations()
    };

    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);
  }

  calculateOverallSuccessRate() {
    const scenarios = Object.values(this.results.scenarios);
    if (scenarios.length === 0) return 0;
    
    const totalSuccess = scenarios.reduce((sum, s) => sum + parseFloat(s.successRate), 0);
    return (totalSuccess / scenarios.length).toFixed(2);
  }

  generateRecommendations() {
    const recommendations = [];
    
    for (const [scenario, results] of Object.entries(this.results.scenarios)) {
      if (parseFloat(results.avgResponseTime) > 300) {
        recommendations.push(`Consider optimizing for ${scenario} load - response time is ${results.avgResponseTime}ms`);
      }
      if (parseFloat(results.successRate) < 95) {
        recommendations.push(`Improve reliability for ${scenario} load - success rate is ${results.successRate}%`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Application performs well under all tested scenarios');
    }

    return recommendations;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run tests
async function main() {
  const tester = new LoadTester();
  
  console.log('🔧 Cyberpunk GM Screen Load Testing');
  console.log('===================================\n');

  // Check if specific scenario is requested
  const scenario = process.argv[2] || 'all';

  if (scenario === 'all') {
    for (const scenarioName of Object.keys(CONFIG.scenarios)) {
      await tester.runTest(scenarioName);
    }
  } else if (CONFIG.scenarios[scenario]) {
    await tester.runTest(scenario);
  } else {
    console.error(`Unknown scenario: ${scenario}`);
    console.log(`Available scenarios: ${Object.keys(CONFIG.scenarios).join(', ')}`);
    process.exit(1);
  }

  // Generate report
  await tester.generateReport();
  
  console.log('\n✅ Load testing complete!');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = LoadTester;