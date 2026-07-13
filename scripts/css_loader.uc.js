// 'CSS_Loader' script for Firefox 152+ by Aris

// replace comments with custom css code
const my_code = `
	/* Paste any CSS code here. */
	/* Make sure your code is not inside any "@-moz-document / url / url-prefix" queries or it might not work. */
	`;

const CSS_Loader = {
 init() {
	const sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	const uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(my_code), null, null);

	// remove old style sheet
	if (sss.sheetRegistered(uri, sss.AGENT_SHEET)) sss.unregisterSheet(uri, sss.AGENT_SHEET);
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

 }
};

CSS_Loader.init();
