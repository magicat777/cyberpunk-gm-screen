#!/bin/bash

# Enhanced Test Runner for Cyberpunk GM Screen
# This script runs the complete test suite including enhanced component tests

set -e

echo "🚀 Starting Enhanced Test Suite for Cyberpunk GM Screen"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required dependencies are installed
print_status "Checking dependencies..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Check if Playwright is installed
if ! npx playwright --version &> /dev/null; then
    print_warning "Playwright not found. Installing Playwright browsers..."
    npx playwright install
fi

# Function to run tests with error handling
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_status "Running $test_name..."
    
    if eval "$test_command"; then
        print_success "$test_name completed successfully"
        return 0
    else
        print_error "$test_name failed"
        return 1
    fi
}

# Initialize test results
TESTS_PASSED=0
TESTS_FAILED=0

# 1. Type checking
print_status "Running TypeScript type checking..."
if npm run type-check; then
    print_success "Type checking passed"
    ((TESTS_PASSED++))
else
    print_error "Type checking failed"
    ((TESTS_FAILED++))
fi

# 2. Linting
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
    ((TESTS_PASSED++))
else
    print_error "Linting failed"
    ((TESTS_FAILED++))
fi

# 3. Style linting
print_status "Running Stylelint..."
if npm run stylelint; then
    print_success "Style linting passed"
    ((TESTS_PASSED++))
else
    print_error "Style linting failed"
    ((TESTS_FAILED++))
fi

# 4. Unit tests (if they exist)
if [ -f "vitest.config.ts" ]; then
    print_status "Running unit tests..."
    if npm run test; then
        print_success "Unit tests passed"
        ((TESTS_PASSED++))
    else
        print_error "Unit tests failed"
        ((TESTS_FAILED++))
    fi
fi

# 5. Build test
print_status "Testing build process..."
if npm run build; then
    print_success "Build test passed"
    ((TESTS_PASSED++))
else
    print_error "Build test failed"
    ((TESTS_FAILED++))
fi

# 6. Enhanced E2E Tests
print_status "Running Enhanced E2E Tests..."

# Check if the development server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_warning "Development server not running. Starting it..."
    
    # Start the dev server in background
    npm run dev > /dev/null 2>&1 &
    DEV_SERVER_PID=$!
    
    # Wait for server to start
    print_status "Waiting for development server to start..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_success "Development server is running"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            print_error "Development server failed to start within 60 seconds"
            kill $DEV_SERVER_PID 2>/dev/null || true
            exit 1
        fi
    done
else
    print_success "Development server is already running"
    DEV_SERVER_PID=""
fi

# Run enhanced E2E tests
print_status "Executing Playwright tests for enhanced components..."
if npx playwright test tests/e2e-enhanced.spec.js --reporter=html; then
    print_success "Enhanced E2E tests passed"
    ((TESTS_PASSED++))
else
    print_error "Enhanced E2E tests failed"
    ((TESTS_FAILED++))
fi

# Run accessibility tests
print_status "Running accessibility tests..."
if npm run test:accessibility; then
    print_success "Accessibility tests passed"
    ((TESTS_PASSED++))
else
    print_error "Accessibility tests failed"
    ((TESTS_FAILED++))
fi

# Cleanup: Stop dev server if we started it
if [ ! -z "$DEV_SERVER_PID" ]; then
    print_status "Stopping development server..."
    kill $DEV_SERVER_PID 2>/dev/null || true
    print_success "Development server stopped"
fi

# 7. Performance audit (optional, requires lighthouse)
if command -v lighthouse &> /dev/null; then
    print_status "Running performance audit..."
    if npm run lighthouse; then
        print_success "Performance audit completed"
        ((TESTS_PASSED++))
    else
        print_warning "Performance audit failed (non-critical)"
    fi
fi

# Print summary
echo ""
echo "======================================================"
echo "🎯 Enhanced Test Suite Summary"
echo "======================================================"
print_success "Tests passed: $TESTS_PASSED"
if [ $TESTS_FAILED -gt 0 ]; then
    print_error "Tests failed: $TESTS_FAILED"
else
    print_success "Tests failed: $TESTS_FAILED"
fi

echo ""
print_status "Enhanced components tested:"
echo "  ✅ NeonInput with validation"
echo "  ✅ GlitchText with animations"
echo "  ✅ Enhanced NPC Generator"
echo "  ✅ Enhanced Rules Reference"
echo "  ✅ Enhanced Location Generator"
echo "  ✅ Enhanced Lore Database"
echo "  ✅ CyberCard components"
echo "  ✅ DataTable components"
echo "  ✅ Sound System integration"
echo "  ✅ Panel system enhancements"

echo ""
if [ $TESTS_FAILED -eq 0 ]; then
    print_success "🎉 All enhanced tests passed! Your Cyberpunk GM Screen is ready for action."
    echo ""
    print_status "Test reports available at:"
    echo "  📊 Playwright report: playwright-report/index.html"
    echo "  🔍 Lighthouse report: lighthouse-report.html"
    echo ""
    exit 0
else
    print_error "❌ Some tests failed. Please check the output above for details."
    echo ""
    print_status "Test reports available at:"
    echo "  📊 Playwright report: playwright-report/index.html"
    echo "  🔍 Lighthouse report: lighthouse-report.html"
    echo ""
    exit 1
fi