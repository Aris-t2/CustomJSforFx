// config.js 

try {
  Cu.importGlobalProperties(['PathUtils']);

  if (!Services.appinfo.inSafeMode) {
    Services.scriptloader.loadSubScriptWithOptions(
      PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir,
      'chrome', 'userChrome', 'userChromeJS.js')),
      { target: this, charset: 'UTF-8', allowUnsafeURL: true }
    );
  }
} catch(e) {
	Components.utils.reportError(e);
};
