const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const script = `#!/bin/sh
set -e
echo "Starting post-clone script..."
cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Installing node modules..."
npm ci
cd ios
echo "Installing pods..."
pod install
echo "Post-clone script complete!"
`;

function withXcodeCloudScript(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const dir = path.join(config.modRequest.platformProjectRoot, 'ci_scripts');
      fs.mkdirSync(dir, { recursive: true });
      const scriptPath = path.join(dir, 'ci_post_clone.sh');
      fs.writeFileSync(scriptPath, script, { mode: 0o755 });
      return config;
    },
  ]);
}

module.exports = withXcodeCloudScript;
