#!/bin/sh
set -e
echo "Starting post-clone script..."
cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Installing node modules..."
npm ci
echo "Running expo prebuild..."
NODE_ENV=production npx expo prebuild --platform ios --clean
cd ios
echo "Installing pods..."
pod install
echo "Post-clone script complete!"
