#!/bin/bash
# Fix paths in HTML files for GitHub Pages
find docs -name "*.html" -exec sed -i 's/src="\/css/src="css/g' {} \;
find docs -name "*.html" -exec sed -i 's/href="\/css/href="css/g' {} \;
find docs -name "*.html" -exec sed -i 's/src="\/js/src="js/g' {} \;
find docs -name "*.html" -exec sed -i 's/href="\/js/href="js/g' {} \;
find docs -name "*.html" -exec sed -i 's/src="\/images/src="images/g' {} \;
find docs -name "*.html" -exec sed -i 's/href="\/images/href="images/g' {} \;
find docs -name "*.html" -exec sed -i 's/src="\/fonts/src="fonts/g' {} \;
find docs -name "*.html" -exec sed -i 's/href="\/fonts/href="fonts/g' {} \;