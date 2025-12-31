#!/bin/bash
# Auto-generate images/manifest.json from directory contents

cd "$(dirname "$0")/.." || exit 1

MANIFEST="images/manifest.json"
IMAGE_EXTENSIONS="jpg|jpeg|png|gif|webp|mp4|webm|mov|ogg"

echo "{" > "$MANIFEST"

first_folder=true
for folder in images/*/; do
    # Skip logos folder
    folder_name=$(basename "$folder")
    if [[ "$folder_name" == "logos" ]]; then
        continue
    fi
    
    # Get list of media files
    files=$(find "$folder" -maxdepth 1 -type f | grep -iE "\.($IMAGE_EXTENSIONS)$" | sort)
    
    if [[ -z "$files" ]]; then
        continue
    fi
    
    # Add comma before entries (except first)
    if [[ "$first_folder" == true ]]; then
        first_folder=false
    else
        echo "," >> "$MANIFEST"
    fi
    
    # Write folder entry
    printf '    "%s": [\n' "$folder_name" >> "$MANIFEST"
    
    first_file=true
    while IFS= read -r file; do
        filename=$(basename "$file")
        if [[ "$first_file" == true ]]; then
            first_file=false
        else
            echo "," >> "$MANIFEST"
        fi
        printf '        "%s"' "$filename" >> "$MANIFEST"
    done <<< "$files"
    
    printf '\n    ]' >> "$MANIFEST"
done

echo "" >> "$MANIFEST"
echo "}" >> "$MANIFEST"

echo "✅ Generated $MANIFEST"
