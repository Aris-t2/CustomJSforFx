// 'Work Offline' button for Firefox 60+ by Aris

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  Components.utils.import("resource://gre/modules/LoginHelper.jsm");
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  CustomizableUI.createWidget({
	id: "workoffline_button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: "Work Offline", // button title
	tooltiptext: "Work Offline", // tooltip title
	command: "cmd_toggleOfflineStatus",
	type: "checkbox",
	onClick: function(event) {
			
	  if(event.button=='0') {
		try {
		  BrowserOffline.toggleOfflineStatus();
		} catch (e) {}
	  } 
	  
	},
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  /* set icon */
  var button_icon = 'chrome://browser/skin/wifi.svg';
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #workoffline_button .toolbarbutton-icon {\
		list-style-image: url("'+button_icon+'"); /* icon / path to icon */ \
		fill: blue; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();