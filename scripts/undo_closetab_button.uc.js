// Undo Close Tab button script for Firefox by Aris
//

(function() {

try {
  ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  var appversion = parseInt(Services.appinfo.version);
  
  var button_label = "Undo Close Tab";
 
  CustomizableUI.createWidget({
	id: "uc_undo_closetab_button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
	  
	  if(event.button=='0') {
		undoCloseTab();
	  }
	},
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  var reloadicon = "chrome://global/skin/icons/reload.svg";
 
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #uc_undo_closetab_button .toolbarbutton-icon {\
		list-style-image: url("chrome://browser/skin/reload.svg"); /* icon / path to icon */ \
		transform: scaleX(-1); /* icon mirroring */\
		fill: blue; /* icon color name/code */\
	  }\
	  :-moz-any(#customization-palette,#widget-overflow-fixed-list) #uc_undo_closetab_button .toolbarbutton-icon {\
		width: 16px !important; \
		height: 16px !important; \
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();