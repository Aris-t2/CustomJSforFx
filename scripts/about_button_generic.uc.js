// 'about:'-Button script for Firefox 89+ by Aris
//
// Need a different 'about' page button?
// - replace 'about:about' url with a different 'about:' url
// - replace button id
// - replace icon / icon url / icon color

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  var button_label = "About Button (generic)";

  CustomizableUI.createWidget({
	id: "about-button-gen", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
		
	  var win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator)
		.getMostRecentWindow("navigator:browser");
		
      if(event.button=='0') {
		try {
		  win.gBrowser.selectedTab = win.gBrowser.addTrustedTab('about:about');
		} catch (e) {}
	  }   
	},
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #about-button-gen .toolbarbutton-icon {\
		list-style-image: url("chrome://global/skin/icons/defaultFavicon.svg"); /* icon / path to icon */ \
		fill: dimgray; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();