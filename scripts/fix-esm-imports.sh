#!/bin/bash

# Fix ES Module imports in generated files
# Add .js extension to all relative imports and exports

echo "Fixing ES Module imports in dist/generated..."

# Find all .js files in dist/generated and add .js extension to relative imports/exports
find dist/generated -name "*.js" -type f | while read -r file; do
  # Step 1: Fix directory imports first (./client -> ./client/index.js)
  sed -i.bak -E "s|from '(\.\.?/client)'|from '\1/index.js'|g" "$file"

  # Step 2: Add .js extension to other imports that don't have it
  # Match patterns like './xxx.gen' or '../core/xxx.gen' but not './xxx.js'
  sed -i.bak -E "s|from '(\.\.?/[^']+)' |from '\1.js' |g" "$file"
  sed -i.bak -E "s|from '(\.\.?/[^']+)';|from '\1.js';|g" "$file"

  # Step 3: Fix double .js.js if it occurs
  sed -i.bak -E "s|\.js\.js|.js|g" "$file"
done

# Remove backup files
find dist/generated -name "*.bak" -type f -delete

echo "Done!"
