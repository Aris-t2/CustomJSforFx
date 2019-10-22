// 'about:'-Button script for Firefox 60+ by Aris
//
// Need a different 'about' page button?
// - replace 'about:config' url with a different 'about:' url
// - replace button id
// - replace icon / icon url / icon color

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  var button_label = "About Button";

  CustomizableUI.createWidget({
	id: "about-button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
	  if(event.button=='0') {
		try {
		  gBrowser.selectedTab = gBrowser.addTrustedTab('about:config');
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
	  #about-button .toolbarbutton-icon {\
		list-style-image: url("chrome://mozapps/skin/places/defaultFavicon.svg"); /* icon / path to icon */ \
		fill: blue; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();