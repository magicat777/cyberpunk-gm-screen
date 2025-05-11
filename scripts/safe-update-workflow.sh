#\!/bin/bash
# Script to ensure proper workflow from src to docs to GitHub

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Cyberpunk GM Screen Safe Update Workflow ===${NC}"
echo

# 1. Check for uncommitted changes first
echo -e "${YELLOW}Checking for uncommitted changes...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}⚠️ You have uncommitted changes!${NC}"
    echo -e "Please commit or stash your changes before running this script."
    exit 1
fi

# 2. Prompt for what to update
echo -e "${YELLOW}What are you updating?${NC}"
read -p "Enter a brief description: " UPDATE_DESC
if [ -z "$UPDATE_DESC" ]; then
    echo -e "${RED}No description provided. Aborting.${NC}"
    exit 1
fi

# 3. Create a branch
BRANCH_NAME="update/$(echo $UPDATE_DESC | tr '[:upper:]' '[:lower:]' | tr ' ' '-')"
echo -e "${YELLOW}Creating branch: ${BRANCH_NAME}${NC}"
git checkout -b $BRANCH_NAME

# 4. Remind about editing in src/frontend
echo
echo -e "${GREEN}✅ Ready to make changes!${NC}"
echo -e "${YELLOW}IMPORTANT:${NC} Make all your edits in ${GREEN}src/frontend/${NC} directory"
echo -e "When you're done, run: ${GREEN}./scripts/safe-update-continue.sh${NC}"

# Create the continuation script
cat > /home/magic/projects/cyberpunk-gm-screen/scripts/safe-update-continue.sh << 'EOF'
#!/bin/bash
# Continuation of the safe update workflow

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Continuing Safe Update Workflow ===${NC}"
echo

# 1. Check if files were modified in src/frontend
CHANGES=$(git status --porcelain | grep -E "src/frontend/" | wc -l)
if [ "$CHANGES" -eq 0 ]; then
    echo -e "${RED}⚠️ No changes detected in src/frontend!${NC}"
    echo -e "Please make your changes first, or use --force to continue anyway."
    if [ "$1" != "--force" ]; then
        exit 1
    fi
fi

# 2. Copy files to docs
echo -e "${YELLOW}Copying files from src/frontend to docs...${NC}"
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
EOF

chmod +x /home/magic/projects/cyberpunk-gm-screen/scripts/safe-update-continue.sh
echo
echo -e "${GREEN}Workflow initialized successfully!${NC}"