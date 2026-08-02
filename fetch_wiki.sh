#!/bin/bash

# ==========================================
# Configuration
# ==========================================
# Load from .env file if it exists
if [ -f .env ]; then
  # shellcheck disable=SC1091
  source .env
fi

# API URL (should be set in .env or environment)
API_URL="${API_URL:-"https://dev.d20futurepath.com/wiki/api.php"}"

# Output Directories (with defaults)
TXT_OUTPUT_DIR="${TXT_OUTPUT_DIR:-"wiki_raw_text"}"
MD_OUTPUT_DIR="${MD_OUTPUT_DIR:-"wiki_markdown"}"

# Apache Basic Auth Credentials
AUTH_USER="${AUTH_USER:-""}"
AUTH_PASS="${AUTH_PASS:-""}"
# ==========================================

# Capture the first command-line argument (if any)
TARGET_PAGE="$1"

# Check for required tools
for tool in jq curl pandoc; do
    if ! command -v "$tool" &> /dev/null; then
        echo "Error: '$tool' is not installed. Please install it to run this script."
        exit 1
    fi
done

# Create both directories
mkdir -p "$TXT_OUTPUT_DIR"
mkdir -p "$MD_OUTPUT_DIR"
TEMP_TITLES_FILE=$(mktemp)

# ==========================================
# 1. Build the list of pages to process
# ==========================================

if [ -n "$TARGET_PAGE" ]; then
    # A specific page was requested
    echo "Targeting single page: $TARGET_PAGE"
    echo "$TARGET_PAGE" > "$TEMP_TITLES_FILE"
else
    # No argument provided, fetch all pages
    echo "No specific page requested. Fetching list of ALL pages from $API_URL ..."
    APCONTINUE=""

    while :; do
        QUERY_URL="${API_URL}?action=query&list=allpages&aplimit=max&format=json"
        
        if [ -n "$APCONTINUE" ]; then
            QUERY_URL="${QUERY_URL}&apcontinue=${APCONTINUE}"
        fi

        # Fetch the JSON response
        RESPONSE=$(curl -s -L -A "WikiFetcher/1.0" -u "$AUTH_USER:$AUTH_PASS" "$QUERY_URL")

        # Extract titles and append to our temporary file
        echo "$RESPONSE" | jq -r '.query.allpages[]?.title' >> "$TEMP_TITLES_FILE"

        # Check for continuation token
        APCONTINUE=$(echo "$RESPONSE" | jq -r '.continue.apcontinue // empty')

        # End of list
        if [ -z "$APCONTINUE" ]; then
            break
        fi
    done
fi

TOTAL_PAGES=$(wc -l < "$TEMP_TITLES_FILE")
echo "Found $TOTAL_PAGES page(s) to process. Starting download and conversion..."

# ==========================================
# 2. Iterate, Download, and Convert
# ==========================================
CURRENT=0

while IFS= read -r TITLE; do
    ((CURRENT++))
    
    # Skip empty lines
    [ -z "$TITLE" ] && continue

    # URL-encode the title
    ENCODED_TITLE=$(jq -rn --arg x "$TITLE" '$x|@uri')

    # Construct the URL
    CONTENT_URL="${API_URL}?action=query&prop=revisions&rvprop=content&rvslots=main&titles=${ENCODED_TITLE}&format=json"

    # Fetch the content
    WIKITEXT=$(curl -s -L -A "WikiFetcher/1.0" -u "$AUTH_USER:$AUTH_PASS" "$CONTENT_URL" | jq -r '.query.pages[] | .revisions[0].slots.main["*"] // empty')

    # Sanitize the filename to avoid creating subdirectories
    SAFE_BASENAME="${TITLE//\//_}"
    SAFE_UNDERSCORED_BASENAME="${SAFE_BASENAME// /_}"
    TXT_FILENAME="${SAFE_UNDERSCORED_BASENAME}.txt"
    MD_FILENAME="${SAFE_UNDERSCORED_BASENAME}.md"
    
    # Process the files
    if [ -n "$WIKITEXT" ]; then
        # 1. Save the raw Wikitext
        TXT_PATH="${TXT_OUTPUT_DIR}/${TXT_FILENAME}"
        echo "$WIKITEXT" > "$TXT_PATH"
        
        # 2. Convert to Markdown and save in the separate directory
        MD_PATH="${MD_OUTPUT_DIR}/${MD_FILENAME}"
        pandoc -f mediawiki -t markdown "$TXT_PATH" -o "$MD_PATH"

        echo "[$CURRENT/$TOTAL_PAGES] Processed: $TITLE"
    else
        echo "[$CURRENT/$TOTAL_PAGES] Warning: No content found for '$TITLE'. Check if the page exists."
    fi

    # Be polite to the server to avoid rate limits
    sleep 0.2

done < "$TEMP_TITLES_FILE"

# Clean up
rm "$TEMP_TITLES_FILE"
echo "---"
echo "Done!"
echo "Raw Wikitext files: ./$TXT_OUTPUT_DIR"
echo "Markdown files:     ./$MD_OUTPUT_DIR"
