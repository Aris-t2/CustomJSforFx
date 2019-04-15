// Movable urlbar script for Firefox 60+ by Aris

var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var {CustomizableUI} = Components.utils.import("resource:///modules/CustomizableUI.jsm", {});

var navigation = CustomizableUI.AREA_NAVBAR;
var tabs = CustomizableUI.AREA_TABSTRIP;
var menu = CustomizableUI.AREA_MENUBAR;
var bookmarks = CustomizableUI.AREA_BOOKMARKS;


var urlbar_on_toolbar = navigation;  /* target toolbar of urlbar item*/
/*	menu = 'menubar'
	tabs = 'tabs toolbar'
	bookmarks = 'bookmarks toolbar'
	navigation='navigation toolbar'
*/

var urlbar_on_toolbar_position = 2;  /* target position of urlbar item*/
/*	0 = 1st
	1 = 2nd
	2 = 3rd
	...
	x = xth
*/

var MovableUrlbar = {
  init: function() {

	try {
	  document.getElementById('urlbar-container').setAttribute('removable','true');
	} catch(e){}

	CustomizableUI.addWidgetToArea("urlbar-container", urlbar_on_toolbar);
	CustomizableUI.moveWidgetWithinArea("urlbar-container", urlbar_on_toolbar_position);
	
	try {
	  document.getElementById('urlbar-container').setAttribute('removable','false');
	} catch(e){}

  }

}

document.addEventListener("DOMContentLoaded", MovableUrlbar.init(), false);
