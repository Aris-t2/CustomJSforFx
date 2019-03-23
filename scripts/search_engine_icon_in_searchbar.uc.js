// 'Search engine icon in search bar' script for Firefox 60+ by Aris
//
// Feature: search button shows current search engines icon (like with old search)
// base on 'alternative_searchbar.uc.js'

setTimeout(function(){
  try {
	var searchbar = document.getElementById("searchbar");

	updateStyleSheet();

	// setIcon function taken from browsers internal 'searchbar.js' file and added modifications
	searchbar.setIcon = function(element, uri) {
	  element.setAttribute("src", uri);
	  updateStyleSheet();
	};

	// main style sheet
	function updateStyleSheet() {
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	
	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		.searchbar-search-button .searchbar-search-icon { \
		  list-style-image: url('+document.getElementById("searchbar").currentEngine.iconURI.spec+') !important; \
		} \
		\
	  '), null, null);

	  // remove old style sheet
	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) { sss.unregisterSheet(uri,sss.AGENT_SHEET); }
	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	};

  } catch(e) {}

},1000);
