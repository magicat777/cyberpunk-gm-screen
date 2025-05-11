#!/usr/bin/env python3
import os
import shutil
import filecmp

print("Checking for differences between src/frontend/pages and docs/pages...")

# Define directories
src_dir = "src/frontend/pages"
docs_dir = "docs/pages"

# List of HTML files to check
files = ["about.html", "attributions.html", "feedback.html", "help.html", 
         "license.html", "privacy.html", "shortcuts.html"]

# Flag to track if any differences were found
differences_found = 0

# Check differences and sync if needed
for file in files:
    print(f"Checking {file}...")
    
    # Check if files exist
    src_file = os.path.join(src_dir, file)
    docs_file = os.path.join(docs_dir, file)
    
    if not os.path.exists(src_file):
        print(f"ERROR: {src_file} does not exist")
        continue
    
    if not os.path.exists(docs_file):
        print(f"ERROR: {docs_file} does not exist")
        continue
    
    # Check for differences
    if filecmp.cmp(src_file, docs_file):
        print(f"  ✓ Files are identical")
    else:
        print(f"  ✗ Differences found in {file}")
        differences_found = 1
        
        # Copy from src to docs to synchronize
        shutil.copy2(src_file, docs_file)
        print(f"  ✓ Synchronized: Source copied to docs")

if differences_found == 0:
    print("All files are synchronized between src/frontend/pages and docs/pages.")
else:
    print("Some files were different and have been synchronized from src/frontend to docs.")

print("Done!")