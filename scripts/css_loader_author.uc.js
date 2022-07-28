// 'CSS_Loader for Author Sheet' script for Firefox by Aris
// Thanks to Camp-Firefox.de users/devs/coders BrokenHeart, aborix, 2002Andreas

/* Create 'author_style_sheet.css' file inside 'chrome' folder.
Paste CSS code, that can not be loaded on user/agent level, into it.
e.g.
#tabbrowser-arrowscrollbox::part(scrollbutton-up), 
#tabbrowser-arrowscrollbox::part(scrollbutton-down) {
  display: none !important; 
}
*/

Components.utils.import("resource://gre/modules/Services.jsm");

// replace comments with custom css code
var my_code = `
	/* Paste any CSS code here. */
	/* Make sure your code is not inside any "@-moz-document / url / url-prefix" queries or it might not work. */
	`;

var CSS_Loader_AS = {
 init: function() {
	
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(my_code), null, null);

	// remove old style sheet
	if (sss.sheetRegistered(uri,sss.AUTHOR_SHEET)) sss.unregisterSheet(uri,sss.AUTHOR_SHEET);
	sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);

 }
};

CSS_Loader_AS.init();
