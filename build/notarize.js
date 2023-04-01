const { notarize } = require('electron-notarize');

console.log('Notarizing app');

exports.default = async function (context) {
  // Skip notarize if not macOS
  if (process.platform !== 'darwin') return;

  // Get some context vars
  let appName = context.packager.appInfo.productFilename;
  let appDir = context.appOutDir;

  // Run notarize
  return await notarize({
    appBundleId: 'com.geza.readit',
    appPath: `${appDir}/${appName}.app`,
    appleId: process.env.appleId,
    appleIdPassword: process.env.appleIdPassword,
  });
};
