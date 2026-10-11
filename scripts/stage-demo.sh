#!/bin/sh
# Stage only the public website files into dist/ (gitignored) for a static deploy.
# Excludes docs, screenshots, tests, git data and credentials by construction.
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp index.html styles.css dist/
cp -R js dist/js
find dist -type f | sort
