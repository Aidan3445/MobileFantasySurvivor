#!/bin/sh
set -e
echo "Starting post-clone script..."

# Install Node.js
brew install node

cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Installing node modules..."
npm ci
cd ios
echo "Installing pods..."
pod install
echo "Post-clone script complete!"
