// 'Search_engine icon in search bar' script for Firefox 123+ by Aris
// based on alternative_searchbar.uc.js

var init_delay_ms = 0;
var appversion = parseInt(Services.appinfo.version);

var SearchIconInSearchbar = {
 init: async function() {
   await Services.search.wrappedJSObject.init();

   if (location != 'chrome://browser/content/browser.xhtml')
    return;

   window.removeEventListener("load", SearchIconInSearchbar.init, false);

   try {
	   
	var searchbar = document.getElementById("searchbar");
	
	// Workaround for the deprecated setIcon function
	var oldUpdateDisplay = searchbar.updateDisplay;
	searchbar.updateDisplay = function() {
	  oldUpdateDisplay.call(this);
	  updateStyleSheet();
	};
	
	// style sheet
	async function updateStyleSheet() {
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	  
	  var icon_url = null;
	  
	  try {
		if(appversion >= 123) {
			icon_url = await document.getElementById("searchbar").currentEngine.getIconURL();
		} else {
			icon_url = searchbar.currentEngine.iconURI.spec;
		}
	  } catch{}

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
		.searchbar-search-button .searchbar-search-icon {
		  list-style-image: url(`+icon_url+`) !important;
		}
	  `), null, null);

	  // remove old style sheet
	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) {
		sss.unregisterSheet(uri,sss.AGENT_SHEET);
	  }

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	};

   } catch(e) {} 

 }
}

/* if search is not hidden on current window, wait for searchbar loading and then initialize 'search icon' (with delay) */
if(!document.firstElementChild.hasAttribute("chromehidden") || !document.firstElementChild.getAttribute("chromehidden").includes("toolbar")) {
	if (document.readyState === "complete") {
		setTimeout(SearchIconInSearchbar.init, init_delay_ms);
	}
	else {
		window.addEventListener("load", SearchIconInSearchbar.init, false);
	}
}
