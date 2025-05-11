#\!/bin/bash
# Continuation of the safe update workflow

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Continuing Safe Update Workflow ===${NC}"
echo

# 1. Check if files were modified in src/frontend
CHANGES=$(git status --porcelain  < /dev/null |  grep -E "src/frontend/" | wc -l)
if [ "$CHANGES" -eq 0 ]; then
    echo -e "${RED}⚠️ No changes detected in src/frontend!${NC}"
    echo -e "Please make your changes first, or use --force to continue anyway."
    if [ "$1" != "--force" ]; then
        exit 1
    fi
fi

# 2. Copy files to docs
echo -e "${YELLOW}Copying files from src/frontend to docs...${NC}"
# Get directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.." # Move to project root
./scripts/copy-assets-to-docs.sh

# 3. Show what changed
echo -e "${YELLOW}Files changed:${NC}"
git status --porcelain

# 4. Prompt for commit
echo
echo -e "${YELLOW}Ready to commit changes.${NC}"
read -p "Do you want to commit these changes? (y/n): " COMMIT_CONFIRM
if [[ $COMMIT_CONFIRM != [Yy]* ]]; then
    echo -e "${RED}Commit cancelled.${NC}"
    exit 1
fi

# 5. Commit both src and docs
echo -e "${YELLOW}Committing changes...${NC}"
git add src/frontend/ docs/
read -p "Enter commit message: " COMMIT_MSG
git commit -m "$COMMIT_MSG"

# 6. Push option
echo
read -p "Do you want to push these changes? (y/n): " PUSH_CONFIRM
if [[ $PUSH_CONFIRM == [Yy]* ]]; then
    echo -e "${YELLOW}Pushing changes...${NC}"
    git push -u origin $(git branch --show-current)
    echo -e "${GREEN}✅ Changes pushed successfully!${NC}"
else
    echo -e "${YELLOW}Changes committed but not pushed.${NC}"
    echo -e "To push later, run: ${GREEN}git push -u origin $(git branch --show-current)${NC}"
fi
