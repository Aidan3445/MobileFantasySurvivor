#!/bin/sh
set -e
echo "Starting post-clone script..."

# Install Node.js and CocoaPods
brew install node cocoapods

cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Installing node modules..."
npm ci
cd ios
echo "Installing pods..."
pod install
echo "Post-clone script complete!"
