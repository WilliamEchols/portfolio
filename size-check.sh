#!/bin/bash

# size-check.sh - Calculate the total size of website files
# Usage: ./size-check.sh

# Set text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Files to include in calculation
FILES=("index.html" "blog/index.html" "fractals/index.html" "log2/index.html")

total_bytes=0

# Print header
echo -e "\n${GREEN}Website Size Checker${NC}"
echo -e "=====================\n"
echo -e "File sizes:"

# Calculate size of each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Get file size in bytes
    size=$(wc -c < "$file")
    total_bytes=$((total_bytes + size))
    
    # Format size for display
    if [ $size -ge 1024 ]; then
      size_kb=$(echo "scale=1; $size/1024" | bc)
      echo -e "  $file: ${size_kb} kB (${size} bytes)"
    else
      echo -e "  $file: ${size} bytes"
    fi
  else
    echo -e "  ${YELLOW}Warning:${NC} $file not found"
  fi
done

# Calculate total size in kilobytes
total_kb=$(echo "scale=1; $total_bytes/1024" | bc)

# Print total
echo -e "\nTotal size:"
echo -e "  ${total_bytes} bytes"
echo -e "  ${total_kb} kB"

# Check against 100kB limit
if (( $(echo "$total_kb < 100" | bc -l) )); then
  echo -e "\n${GREEN}✓ Under 100kB limit!${NC} ($(echo "scale=1; (100-$total_kb)" | bc) kB remaining)"
elif (( $(echo "$total_kb < 100.5" | bc -l) )); then
  echo -e "\n${YELLOW}⚠ Slightly over 100kB limit${NC} ($(echo "scale=1; ($total_kb-100)" | bc) kB over)"
else
  echo -e "\n${RED}✗ Over 100kB limit${NC} ($(echo "scale=1; ($total_kb-100)" | bc) kB over)"
fi

echo -e "\nRun this script again after making changes to check the updated size.\n" 
