#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/dist/themeforest"
PACKAGE_DIR="$BUILD_DIR/nexus-saas-admin-v1.0"
MAIN_FILES_DIR="$PACKAGE_DIR/Main Files"
PROJECT_DIR="$MAIN_FILES_DIR/nexus-saas-admin"
DOCS_DIR="$MAIN_FILES_DIR/documentation"

rm -rf "$PACKAGE_DIR"
mkdir -p "$PROJECT_DIR" "$DOCS_DIR"

shopt -s dotglob nullglob
for item in "$ROOT_DIR"/* "$ROOT_DIR"/.*; do
  base_name="$(basename "$item")"

  case "$base_name" in
    .|..|.git|.next|dist|node_modules|themeforest-assets)
      continue
      ;;
  esac

  cp -R "$item" "$PROJECT_DIR/"
done
shopt -u dotglob nullglob

cp "$ROOT_DIR/documentation/index.html" "$DOCS_DIR/index.html"
cp "$ROOT_DIR/changelog.txt" "$PACKAGE_DIR/changelog.txt"

(
  cd "$BUILD_DIR"
  zip -rq "nexus-saas-admin-v1.0.zip" "nexus-saas-admin-v1.0"
)

echo "ThemeForest package ready:"
echo "$BUILD_DIR/nexus-saas-admin-v1.0.zip"
