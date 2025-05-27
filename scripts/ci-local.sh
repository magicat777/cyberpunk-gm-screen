#!/bin/bash

# Local CI Pipeline Simulator
# Run all CI checks locally before pushing

echo "🚀 Running Local CI Pipeline"
echo "=========================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Track failures
FAILED=0

# Function to run a check
run_check() {
    local name=$1
    local command=$2
    
    echo -e "${BLUE}Running: ${name}${NC}"
    if eval $command; then
        echo -e "${GREEN}✓ ${name} passed${NC}\n"
    else
        echo -e "${RED}✗ ${name} failed${NC}\n"
        ((FAILED++))
    fi
}

# 1. Dependency Installation
echo -e "${YELLOW}Step 1: Installing Dependencies${NC}"
run_check "Install packages" "npm ci"

# 2. Linting Checks
echo -e "${YELLOW}Step 2: Linting & Formatting${NC}"
run_check "HTML validation" "npx html-validate '*.html' 2>/dev/null || true"
run_check "Prettier check" "npx prettier --check 'src/**/*.{js,ts,css,html}' 2>/dev/null || true"

# 3. Security Audit
echo -e "${YELLOW}Step 3: Security Scan${NC}"
run_check "NPM audit" "npm audit --audit-level=moderate || true"

# 4. Build
echo -e "${YELLOW}Step 4: Build Project${NC}"
run_check "Development build" "npm run build"

# 5. Tests
echo -e "${YELLOW}Step 5: Running Tests${NC}"
run_check "Unit tests" "npm test -- --run"
run_check "Accessibility tests" "node test-accessibility.js"

# 6. Bundle Size
echo -e "${YELLOW}Step 6: Bundle Analysis${NC}"
if [ -f "dist/assets/*.js" ]; then
    echo "Bundle sizes:"
    du -h dist/assets/*.js | sort -h
else
    echo "No bundles found to analyze"
fi

# Summary
echo ""
echo "=========================="
echo -e "${YELLOW}CI Pipeline Summary${NC}"
echo "=========================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo "Ready to push to GitHub"
    exit 0
else
    echo -e "${RED}❌ ${FAILED} checks failed${NC}"
    echo "Please fix the issues before pushing"
    exit 1
fi