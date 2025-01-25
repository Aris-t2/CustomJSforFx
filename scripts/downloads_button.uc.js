// Downloads button script for Firefox by Aris
//
// left-click on custom downloads button: opens downloads library
// middle-click on custom downloads button: opens 'about:downloads' in a new tab
// right-click on custom downloads button: no special function

(function() {

try {
  ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  var button_label = "Downloads";

  CustomizableUI.createWidget({
	id: "custom-downloads-button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
	  if(event.button=='0') {
		try {
		  BrowserCommands.downloadsUI();
		} catch (e) {}
	  } else if(event.button=='1') {
		try {
		  gBrowser.selectedTab = gBrowser.addTrustedTab('about:downloads');
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
	  #custom-downloads-button .toolbarbutton-icon {\
		list-style-image: url("chrome://browser/skin/back.svg"); /* icon / path to icon */ \
		transform: rotate(-90deg); /* icon mirroring */\
		fill: blue; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();