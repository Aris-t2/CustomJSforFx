// 'Favicon in urlbars identity box' script for Firefox 89+ by Aris
//
// This script restores current pages favicon inside urlbar (aka location bar, address bar or awesome bar).
// [!] If a page does not offer a favicon, browser branches default icon is shown.
// [!] In a multi-window environment pages without favicons might show wrong icons.
// option: set icon for pages without favicon


var i_icon = 'chrome://browser/skin/identity-icon.svg';
var sheet = 'chrome://global/skin/icons/Portrait.png';
var brand = 'chrome://branding/content/icon16.png';
var globe = 'chrome://global/skin/icons/defaultFavicon.svg';

var icon_for_pages_without_favicon = brand; // i_icon, sheet, globe or brand (colorized Fx channel icon)

var favicon_click_opens_page_info_window = false;

var appversion = parseInt(Services.appinfo.version);

var FaviconInUrlbar = {
 init: function() {
   try {
	   
	var favimginurlbar = document.createXULElement("image");
	favimginurlbar.setAttribute("id","favimginurlbar");
	  
	if(favicon_click_opens_page_info_window)
	  favimginurlbar.setAttribute("onclick","gIdentityHandler.handleMoreInfoClick(event);");	  
	  
	favimginurlbar.style.width = "16px";
	favimginurlbar.style.height = "16px";
	favimginurlbar.style.marginLeft = "3px";
	favimginurlbar.style.marginRight = "3px";
	favimginurlbar.style.marginTop = "3px";
	favimginurlbar.style.marginBottom = "3px";
	
	document.getElementById('identity-box').insertBefore(favimginurlbar,document.getElementById('identity-box').firstChild);

	// update script every time tab attributes get modified (switch/open tabs/windows)
	document.addEventListener("TabAttrModified", updateIcon, false);
	document.addEventListener('TabSelect', updateIcon, false);
	document.addEventListener('TabOpen', updateIcon, false);
	document.addEventListener('TabClose', updateIcon, false);
	document.addEventListener('load', updateIcon, false);
	document.addEventListener("DOMContentLoaded", updateIcon, false);


	function updateIcon() {
		
	 setTimeout(function(){ // timeout fixes wrong icon detection in some cases
	  
	  // get current tabs favicon
	  var favicon_in_urlbar = gBrowser.selectedTab.image;
	  
	  // if current tab offers no icon, use selected icon (icon_for_pages_without_favicon)
	  if(!gBrowser.selectedTab.image || gBrowser.selectedTab.image == null)
		if(!icon_for_pages_without_favicon) favicon_in_urlbar = brand;
		  else favicon_in_urlbar = icon_for_pages_without_favicon;
		  
	  document.querySelector('#favimginurlbar').style.listStyleImage = "url("+favicon_in_urlbar+")";
	  
	 },100);

	}
	
	
	/* restore icon badge for websites with granted permissions */
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		\
		.grantedPermissions::before { \
		  content: "" !important; \
		  display: block !important; \
		  width: 6px !important; \
		  height: 6px !important; \
		  position: absolute !important; \
		  margin-inline-start: 14px !important; \
		  margin-top: 2px !important; \
		  background: Highlight !important; \
		  border-radius: 100px !important; \
		} \
		\
	'), null, null);

	// remove old style sheet
	if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) sss.unregisterSheet(uri,sss.AGENT_SHEET);
	
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

  } catch(e) {}
 }
};

// initiate script after DOM/browser content is loaded
document.addEventListener("DOMContentLoaded", FaviconInUrlbar.init(), false);
