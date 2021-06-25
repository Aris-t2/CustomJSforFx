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

var CSS_LoaderAS = {
  init: async function() {
    var my_author_css_file = await IOUtils.readUTF8(OS.Path.join(OS.Constants.Path.profileDir, 'chrome', 'author_style_sheet.css'));

    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(my_author_css_file));

	// remove old style sheet
	if (sss.sheetRegistered(uri,sss.AUTHOR_SHEET)) sss.unregisterSheet(uri,sss.AUTHOR_SHEET);
	sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);  
  }
}

CSS_LoaderAS.init();
