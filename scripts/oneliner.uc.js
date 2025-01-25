// 'One-liner' script for Firefox 60+ by Aris
// buttons back and forward are moved to tab toolbars start position
// location bar is placed after tabs
// main menu button is placed at tab toolbars end
// own buttons can be added between location bar and overflow button
// navigation toolbar is only visible in customizing mode (optional)
// space at tab toolbars start and end is hidden (optional)
// location bar width is forced to 40% of window width (optional)
// CAUTION: moving some of the items into palette will break your ui!

var {CustomizableUI} = ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

var Oneliner = {
  init: function() {

	document.getElementById('back-button').setAttribute('removable','true');
	document.getElementById('forward-button').setAttribute('removable','true');
	document.getElementById('PanelUI-button').setAttribute('removable','true');
	document.getElementById('nav-bar-overflow-button').setAttribute('removable','true');
	document.getElementById('urlbar-container').setAttribute('removable','true');
	
	CustomizableUI.addWidgetToArea("back-button", CustomizableUI.AREA_TABSTRIP);
	CustomizableUI.addWidgetToArea("forward-button", CustomizableUI.AREA_TABSTRIP);
	CustomizableUI.addWidgetToArea("urlbar-container", CustomizableUI.AREA_TABSTRIP);
	CustomizableUI.addWidgetToArea("nav-bar-overflow-button", CustomizableUI.AREA_TABSTRIP);
	CustomizableUI.addWidgetToArea("PanelUI-button", CustomizableUI.AREA_TABSTRIP);
	
	CustomizableUI.moveWidgetWithinArea("urlbar-container",0);
	CustomizableUI.moveWidgetWithinArea("alltabs-button",0);
	CustomizableUI.moveWidgetWithinArea("new-tab-button",0);
	CustomizableUI.moveWidgetWithinArea("tabbrowser-tabs",0);
	CustomizableUI.moveWidgetWithinArea("forward-button",0);
	CustomizableUI.moveWidgetWithinArea("back-button",0);
	CustomizableUI.moveWidgetWithinArea("nav-bar-overflow-button",499);
	CustomizableUI.moveWidgetWithinArea("PanelUI-button",500);
	
	document.getElementById("TabsToolbar").insertBefore(document.getElementById("nav-bar-overflow-button"),null);
	document.getElementById("TabsToolbar").insertBefore(document.getElementById("PanelUI-button"),null);
	
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  /* hide navigation toolbar */\
	  #main-window:not([customizing]) #nav-bar {\
		position: fixed !important; \
		display: block !important; \
		margin-top: -100px !important; \
	  }\
	  /* adjust popup position */\
	  #PopupAutoCompleteRichResult[autocompleteinput="urlbar"] { \
		margin-top: 65px !important; \
	  } \
	  /* hide empty space on tabs toolbars start */\
	  #main-window:not([customizing]) #TabsToolbar *[type="pre-tabs"] {\
		visibility: collapse; \
	  }\
	  /* hide empty space on tabs toolbars end */\
	  #main-window:not([customizing]) #TabsToolbar *[type="post-tabs"] {\
		visibility: collapse; \
	  }\
	  /* location bar width (40% of window width) */\
	  #main-window:not([customizing]) #urlbar-container {\
		min-width: 40vw !important; \
		width: 40vw !important; \
		max-width: 40vw !important; \
	  }\
	  /* display overflow button */\
	  toolbar:not([overflowing]) > .overflow-button, \
	  toolbar[customizing] > .overflow-button { \
		display: -moz-box !important; \
	  } \
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	
  }

}

setTimeout(function(){
  Oneliner.init();
},1000);