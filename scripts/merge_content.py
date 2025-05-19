#!/usr/bin/env python3
import os
import re
import shutil
import tempfile

# Colors for output
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
RED = '\033[0;31m'
NC = '\033[0m'  # No Color

print(f"{YELLOW}=== Merging Content while Preserving Structure ==={NC}")
print()

# Create temporary directory
temp_dir = tempfile.mkdtemp()
print(f"{YELLOW}Created temporary directory: {temp_dir}{NC}")

def extract_content(file_path):
    """Extract content between <main> and </main> tags from an HTML file."""
    if not os.path.exists(file_path):
        print(f"{RED}Error: File {file_path} not found{NC}")
        return None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract content between main tags
    pattern = r'<main.*?>(.*?)</main>'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(0)  # Return the content including main tags
    else:
        print(f"{RED}Error: Could not find main content in {file_path}{NC}")
        return None

def merge_content(template_file, content, output_file):
    """Merge content into the template file."""
    if not os.path.exists(template_file):
        print(f"{RED}Error: Template file {template_file} not found{NC}")
        return False
    
    with open(template_file, 'r', encoding='utf-8') as f:
        template = f.read()
    
    # Replace content between main tags
    pattern = r'<main.*?>.*?</main>'
    merged = re.sub(pattern, content, template, flags=re.DOTALL)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(merged)
    
    print(f"{GREEN}Merged content into {output_file}{NC}")
    return True

# Process each HTML file in pages directory
files = ['about.html', 'attributions.html', 'feedback.html', 
         'help.html', 'license.html', 'privacy.html', 'shortcuts.html']

for file in files:
    print(f"{YELLOW}Processing {file}...{NC}")
    
    # Files to process
    src_main_file = f"docs/pages/{file}"                # Current file in main branch
    src_detailed_file = f"src/frontend/pages/{file}"    # Detailed content file in frontend
    merged_file = os.path.join(temp_dir, f"{file}.merged")  # Temporary file for merged result
    
    # Extract content from detailed file
    content = extract_content(src_detailed_file)
    if content:
        # Merge content into main file structure
        if merge_content(src_main_file, content, merged_file):
            # Copy merged file back to both locations
            shutil.copy(merged_file, src_main_file)
            shutil.copy(merged_file, src_detailed_file)
            print(f"{GREEN}Updated both src/frontend/pages/{file} and docs/pages/{file}{NC}")
    
    print()

# Clean up temporary directory
shutil.rmtree(temp_dir)
print(f"{GREEN}Cleaned up temporary directory{NC}")
print(f"{GREEN}Process complete!{NC}")