#!/usr/bin/env bash

echo "=== Running grype ==="

# Get the image from the command line
image="$1"

# Check if image is provided
if [ -z "$image" ]; then
  echo "Usage: $0 <image-name>"
  exit 1
fi

# Run grype scan and save as CSV
grype "$image" -o template -t csv.tmpl > "${image//[:\/]/_}.csv"

echo "Report generated: ${image//[:\/]/_}.csv"
