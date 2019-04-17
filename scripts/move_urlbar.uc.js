// 'MoveUrlbar' script for Firefox 60+ by Aris
// option: place urlbar on a different toolbar
// option: place back button on a different toolbar
// option: place back button on a different toolbar


var {CustomizableUI} = Components.utils.import("resource:///modules/CustomizableUI.jsm", {});

var navigation = CustomizableUI.AREA_NAVBAR;
var tabs = CustomizableUI.AREA_TABSTRIP;
var menu = CustomizableUI.AREA_MENUBAR;
var bookmarks = CustomizableUI.AREA_BOOKMARKS;

/* [target toolbar of item]
	menu = 'menubar'
	tabs = 'tabs toolbar'
	bookmarks = 'bookmarks toolbar'
	navigation='navigation toolbar'   */
var backbutton_on_toolbar = navigation;  
var forwardbutton_on_toolbar = navigation;
var urlbar_on_toolbar = navigation;

/* [target position of item]
	0 = 1st
	1 = 2nd
	2 = 3rd
	...
	x = xth    */
var backbutton_on_toolbar_position = 0;  
var forwardbutton_on_toolbar_position = 1;
var urlbar_on_toolbar_position = 2;


var MoveUrlbar = {
  init: function() {

	try {
	  document.getElementById('back-button').setAttribute('removable','true');
	  document.getElementById('forward-button').setAttribute('removable','true');
	  document.getElementById('urlbar-container').setAttribute('removable','true');
	} catch(e){}

	CustomizableUI.addWidgetToArea("back-button", backbutton_on_toolbar);
	CustomizableUI.moveWidgetWithinArea("back-button", backbutton_on_toolbar_position);
	CustomizableUI.addWidgetToArea("forward-button", forwardbutton_on_toolbar);
	CustomizableUI.moveWidgetWithinArea("forward-button", forwardbutton_on_toolbar_position);
	CustomizableUI.addWidgetToArea("urlbar-container", urlbar_on_toolbar);
	CustomizableUI.moveWidgetWithinArea("urlbar-container", urlbar_on_toolbar_position);
	
	try {
	  document.getElementById('back-button').setAttribute('removable','false');
	  document.getElementById('forward-button').setAttribute('removable','false');
	  document.getElementById('urlbar-container').setAttribute('removable','false');
	} catch(e){}

  }

}

document.addEventListener("DOMContentLoaded", MoveUrlbar.init(), false);
