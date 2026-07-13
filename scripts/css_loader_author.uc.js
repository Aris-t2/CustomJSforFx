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


// replace comments with custom css code, this takes priority over 'author_style_sheet.css' file
const my_code = `
	  /* Paste any CSS code here. */
	  /* Make sure your code is not inside any "@-moz-document / url / url-prefix" queries or it might not work. */
	  `;

const CSS_Loader_AS = {
  async init() {
	const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);

	let uri;

	if (my_code.replace(/\/\*[\s\S]*?\*\//g, "").trim()) {
	  uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(my_code));
	} else {
	  const cssFile = PathUtils.join(PathUtils.profileDir, "chrome", "author_style_sheet.css");

	  if (!(await IOUtils.exists(cssFile))) {
		console.log("no inline CSS or author_style_sheet.css found");
		return;
	  }

	  uri = Services.io.newURI(PathUtils.toFileURI(cssFile));
	}

	// remove old style sheet
	if (sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) sss.unregisterSheet(uri, sss.AUTHOR_SHEET);
	sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);
  }
};

CSS_Loader_AS.init();
