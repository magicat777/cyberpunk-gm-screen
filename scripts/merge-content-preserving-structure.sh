#!/bin/bash
# Script to merge detailed content from test-workflow branch while preserving footer structure

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Merging Content while Preserving Structure ===${NC}"
echo

# Temporary directory for processing
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}Created temporary directory: ${TEMP_DIR}${NC}"

# Function to extract content section from an HTML file (between main tags)
extract_content() {
    local file=$1
    local output_file=$2
    if [ -f "$file" ]; then
        # Extract content between main tags
        sed -n '/<main/,/<\/main>/p' "$file" > "$output_file"
        echo -e "${GREEN}Extracted content from ${file}${NC}"
    else
        echo -e "${RED}Error: File ${file} not found${NC}"
        return 1
    fi
}

# Function to merge content into a template file
merge_content() {
    local template_file=$1
    local content_file=$2
    local output_file=$3
    
    if [ ! -f "$template_file" ] || [ ! -f "$content_file" ]; then
        echo -e "${RED}Error: Required files not found${NC}"
        return 1
    fi
    
    # Create a copy of the template
    cp "$template_file" "$output_file"
    
    # Replace content section
    sed -i '/<main/,/<\/main>/c\CONTENT_PLACEHOLDER' "$output_file"
    sed -i "/CONTENT_PLACEHOLDER/r $content_file" "$output_file"
    sed -i '/CONTENT_PLACEHOLDER/d' "$output_file"
    
    echo -e "${GREEN}Merged content into ${output_file}${NC}"
}

# Process each HTML file in pages directory
for file in about.html attributions.html feedback.html help.html license.html privacy.html shortcuts.html; do
    echo -e "${YELLOW}Processing ${file}...${NC}"
    
    # Files to process
    src_main_file="docs/pages/$file"                 # Current file in main branch
    src_detailed_file="src/frontend/pages/$file"     # Detailed content file in frontend
    temp_content_file="${TEMP_DIR}/${file}.content"  # Temporary file for content
    merged_file="${TEMP_DIR}/${file}.merged"         # Temporary file for merged result
    
    # Extract content from detailed file
    if extract_content "$src_detailed_file" "$temp_content_file"; then
        # Merge content into main file structure
        if merge_content "$src_main_file" "$temp_content_file" "$merged_file"; then
            # Copy merged file back to both locations
            cp "$merged_file" "$src_main_file"
            cp "$merged_file" "$src_detailed_file"
            echo -e "${GREEN}Updated both src/frontend/pages/$file and docs/pages/$file${NC}"
        fi
    fi
    
    echo
done

# Clean up temporary directory
rm -rf "$TEMP_DIR"
echo -e "${GREEN}Cleaned up temporary directory${NC}"
echo -e "${GREEN}Process complete!${NC}"