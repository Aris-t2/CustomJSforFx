// 'Favicon in urlbars identity box' script for Firefox 60+ by Aris
//
// The script restores current pages favicon inside location bar.
// If a page does not offer an icon, branches default icon is used.


var FaviconInUrlbar = {
 init: function() {

  try {

	updateStyleSheet();

	// update script every time tab attributes get modified (switch/open tabs/windows)
	document.addEventListener("TabAttrModified", function update_title() {
	  updateStyleSheet();
	}, false);

	// main style sheet
	function updateStyleSheet() {
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	  
	  // get current tabs favicon
	  var favicon_in_urlbar = gBrowser.selectedTab.image;
	  
	  // if current tab offers no icon, use default branch icon
	  if(!gBrowser.selectedTab.image || gBrowser.selectedTab.image == null)
		favicon_in_urlbar = 'chrome://branding/content/identity-icons-brand.svg';
	
	  // add tab icon and make sure browsers CSS modifications are disabled 
	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		#identity-icon, #page-proxy-favicon { \
		  list-style-image: url('+favicon_in_urlbar+') !important; \
		  filter: unset !important; \
		  fill: unset !important; \
		  width: 16px !important; \
		  height: 16px !important; \
		  opacity: 1.0 !important; \
		  box-shadow: unset !important; \
		  border-radius: 0px !important; \
		} \
		\
	  '), null, null);

	  // remove old style sheet, before registering the new one
	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) { sss.unregisterSheet(uri,sss.AGENT_SHEET); }
	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	};

  } catch(e) {}


 }
};

// initiate script after DOM/browser content is loaded
document.addEventListener("DOMContentLoaded", FaviconInUrlbar.init(), false);
