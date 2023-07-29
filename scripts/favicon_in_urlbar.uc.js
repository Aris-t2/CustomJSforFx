// 'Favicon in urlbars identity box' script for Firefox 115+ by Aris
//
// This script restores current pages favicon inside urlbar (aka location bar, address bar or awesome bar).
// [!] If a page does not offer a favicon, browser default branch icon is shown.
// [!] In a multi-window environment pages without favicons might show wrong icons.
// option: set icon for pages without favicon

(function() {

  try {

	const i_icon = 'chrome://global/skin/icons/info.svg';
	const sheet = 'chrome://global/skin/icons/Portrait.png';
	const brand = 'chrome://branding/content/icon32.png';
	const globe = 'chrome://global/skin/icons/defaultFavicon.svg';

	const icon_for_pages_without_favicon = brand; // i_icon, sheet, globe or brand (colorized Fx channel icon)

	const favicon_click_opens_page_info_window = false; // opens page info window on click, if set to true


	const favimginurlbar = document.createXULElement("image");
	favimginurlbar.setAttribute("id","favimginurlbar");
	favimginurlbar.setAttribute("align","center");
	favimginurlbar.style.width = "18px";
	favimginurlbar.style.height = "18px";
	favimginurlbar.style.marginLeft = "3px";
	favimginurlbar.style.marginRight = "3px";
	favimginurlbar.style.marginTop = "auto";
	favimginurlbar.style.marginBottom = "auto";


	if(favicon_click_opens_page_info_window)
	  favimginurlbar.setAttribute("onclick","gIdentityHandler.handleMoreInfoClick(event);");


	document.getElementById('identity-box').appendChild(favimginurlbar);

	// update script every time a tab attribute gets modified
	document.addEventListener("TabAttrModified", updateIcon, false);
	document.addEventListener('TabSelect', updateIcon, false);
	document.addEventListener('TabClose', updateIcon, false);


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
  
})();
