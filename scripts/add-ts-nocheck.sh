#!/bin/bash

# Add @ts-nocheck to all generated TypeScript files

find src/generated -name "*.ts" -type f | while read -r file; do
  # Check if file already has @ts-nocheck
  if ! head -n 1 "$file" | grep -q "@ts-nocheck"; then
    # Add @ts-nocheck at the beginning
    echo "// @ts-nocheck" > "$file.tmp"
    cat "$file" >> "$file.tmp"
    mv "$file.tmp" "$file"
    echo "Added @ts-nocheck to $file"
  fi
done

echo "Done!"
