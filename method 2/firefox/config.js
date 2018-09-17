// config.js
const Cu = Components.utils;

try {

  Cu.import("resource://gre/modules/Services.jsm");
  Cu.import("resource://gre/modules/osfile.jsm");

  if (!Services.appinfo.inSafeMode) {
		
	Services.scriptloader.loadSubScript(
	  OS.Path.toFileURI(OS.Path.join(OS.Constants.Path.profileDir,
		"./chrome/userChrome/userChromeJS.js")), this, "UTF-8");
		
  };

} catch(e) {};
