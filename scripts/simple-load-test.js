#!/usr/bin/env node

/**
 * Simple Load Testing Script for Cyberpunk GM Screen
 * Simulates load without requiring external dependencies
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');

class SimpleLoadTester {
  constructor(targetUrl) {
    this.targetUrl = targetUrl;
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      startTime: Date.now(),
      endTime: null
    };
  }

  async runTest(concurrentUsers = 10, duration = 30000) {
    console.log(`\n🚀 Starting load test...`);
    console.log(`URL: ${this.targetUrl}`);
    console.log(`Concurrent Users: ${concurrentUsers}`);
    console.log(`Duration: ${duration / 1000} seconds\n`);

    const users = [];
    
    // Start virtual users
    for (let i = 0; i < concurrentUsers; i++) {
      users.push(this.simulateUser(i, duration));
    }

    // Wait for all users to complete
    await Promise.all(users);
    
    this.results.endTime = Date.now();
    
    // Display results
    this.displayResults();
    
    // Save report
    await this.saveReport();
  }

  async simulateUser(userId, duration) {
    const endTime = Date.now() + duration;
    
    while (Date.now() < endTime) {
      await this.makeRequest();
      // Random delay between requests (1-3 seconds)
      await this.sleep(Math.random() * 2000 + 1000);
    }
  }

  makeRequest() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const parsedUrl = url.parse(this.targetUrl);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(this.targetUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          this.results.responseTimes.push(responseTime);
          this.results.totalRequests++;
          
          if (res.statusCode >= 200 && res.statusCode < 400) {
            this.results.successfulRequests++;
          } else {
            this.results.failedRequests++;
          }
          
          resolve();
        });
      });

      req.on('error', (error) => {
        this.results.totalRequests++;
        this.results.failedRequests++;
        resolve();
      });

      req.setTimeout(5000, () => {
        req.destroy();
        this.results.totalRequests++;
        this.results.failedRequests++;
        resolve();
      });
    });
  }

  displayResults() {
    const duration = (this.results.endTime - this.results.startTime) / 1000;
    const avgResponseTime = this.results.responseTimes.length > 0
      ? this.results.responseTimes.reduce((a, b) => a + b, 0) / this.results.responseTimes.length
      : 0;
    const minResponseTime = this.results.responseTimes.length > 0
      ? Math.min(...this.results.responseTimes)
      : 0;
    const maxResponseTime = this.results.responseTimes.length > 0
      ? Math.max(...this.results.responseTimes)
      : 0;
    const successRate = this.results.totalRequests > 0
      ? (this.results.successfulRequests / this.results.totalRequests) * 100
      : 0;
    const requestsPerSecond = this.results.totalRequests / duration;

    console.log('\n📊 Load Test Results');
    console.log('===================');
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    console.log(`Total Requests: ${this.results.totalRequests}`);
    console.log(`Successful Requests: ${this.results.successfulRequests}`);
    console.log(`Failed Requests: ${this.results.failedRequests}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    console.log(`Requests/Second: ${requestsPerSecond.toFixed(2)}`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Min Response Time: ${minResponseTime}ms`);
    console.log(`Max Response Time: ${maxResponseTime}ms`);

    console.log('\n🎯 Performance Analysis:');
    if (avgResponseTime < 100) {
      console.log('✅ Excellent: Average response time under 100ms');
    } else if (avgResponseTime < 500) {
      console.log('✅ Good: Average response time under 500ms');
    } else if (avgResponseTime < 1000) {
      console.log('⚠️  Warning: Average response time under 1s');
    } else {
      console.log('❌ Poor: Average response time over 1s');
    }

    if (successRate > 99) {
      console.log('✅ Excellent: Success rate over 99%');
    } else if (successRate > 95) {
      console.log('✅ Good: Success rate over 95%');
    } else {
      console.log('❌ Poor: Success rate under 95%');
    }
  }

  async saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.targetUrl,
      duration: (this.results.endTime - this.results.startTime) / 1000,
      results: this.results,
      analysis: {
        avgResponseTime: this.results.responseTimes.length > 0
          ? this.results.responseTimes.reduce((a, b) => a + b, 0) / this.results.responseTimes.length
          : 0,
        successRate: this.results.totalRequests > 0
          ? (this.results.successfulRequests / this.results.totalRequests) * 100
          : 0,
        requestsPerSecond: this.results.totalRequests / ((this.results.endTime - this.results.startTime) / 1000)
      }
    };

    const reportDir = path.join(__dirname, '..', 'reports');
    await fs.mkdir(reportDir, { recursive: true });
    
    const reportPath = path.join(reportDir, `load-test-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Report saved to: ${reportPath}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const targetUrl = args[0] || 'http://localhost:5173/panel-demo-simple.html';
  const concurrentUsers = parseInt(args[1]) || 10;
  const duration = parseInt(args[2]) || 30000;

  console.log('🔧 Simple Load Testing Tool');
  console.log('==========================');

  const tester = new SimpleLoadTester(targetUrl);
  
  try {
    await tester.runTest(concurrentUsers, duration);
  } catch (error) {
    console.error('❌ Error during load test:', error.message);
    process.exit(1);
  }
}

// Usage help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node simple-load-test.js [URL] [USERS] [DURATION_MS]');
  console.log('');
  console.log('Arguments:');
  console.log('  URL         Target URL to test (default: http://localhost:5173/panel-demo-simple.html)');
  console.log('  USERS       Number of concurrent users (default: 10)');
  console.log('  DURATION_MS Test duration in milliseconds (default: 30000)');
  console.log('');
  console.log('Example:');
  console.log('  node simple-load-test.js http://localhost:5173 20 60000');
  process.exit(0);
}

// Run the test
main().catch(console.error);