find ./src -type f -name '*.js' -not -name '*.jsx' -not -name '*.ejs' -exec bash -c 'grep -l "</" $0' {} \; -exec bash -c 'mv "$0" "${0%.js}.jsx"' {} \;
