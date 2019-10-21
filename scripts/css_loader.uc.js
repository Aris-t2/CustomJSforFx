// 'CSS_Loader' script for Firefox 60+ by Aris

Components.utils.import("resource://gre/modules/Services.jsm");

// replace comments with custom css code
var my_code = `
	/* Paste any CSS code here. */
	/* Make sure your code is not inside any "@-moz-document / url / url-prefix" queries or it might not work. */
	`;

var CSS_Loader = {
 init: function() {
	
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(my_code), null, null);

	// remove old style sheet
	if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) sss.unregisterSheet(uri,sss.AGENT_SHEET);
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

 }
};

CSS_Loader.init();
