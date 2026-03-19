#!/bin/sh
set -e
echo "Starting post-clone script..."

brew install node@24 cocoapods # NODE 24 to match the version used in the project

cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Installing node modules..."
npm ci || (echo "Retrying npm ci..." && npm ci)cd ios
echo "Setting up CocoaPods CDN..."
pod repo add-cdn trunk https://cdn.cocoapods.org/
echo "Installing pods..."
pod install
echo "Post-clone script complete!"
