// 'Favicon in urlbars identity box' script for Firefox 92+ by Aris
//
// This script restores current pages favicon inside urlbar (aka location bar, address bar or awesome bar).
// [!] If a page does not offer a favicon, browser branches default icon is shown.
// [!] In a multi-window environment pages without favicons might show wrong icons.
// option: set icon for pages without favicon

var i_icon = 'chrome://global/skin/icons/info.svg';
var sheet = 'chrome://global/skin/icons/Portrait.png';
var brand = 'chrome://branding/content/icon32.png';
var globe = 'chrome://global/skin/icons/defaultFavicon.svg';

var icon_for_pages_without_favicon = brand; // i_icon, sheet, globe or brand (colorized Fx channel icon)

var favicon_click_opens_page_info_window = false;

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
	
	//document.getElementById('identity-box').insertBefore(favimginurlbar,document.getElementById('identity-box').firstChild);
	document.getElementById('identity-box').appendChild(favimginurlbar);

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

  } catch(e) {}
 }
};

// initiate script after DOM/browser content is loaded
document.addEventListener("DOMContentLoaded", FaviconInUrlbar.init(), false);
