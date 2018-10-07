// Undo Close Tab button script for Firefox 60+ by Aris
//

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
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
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #uc_undo_closetab_button .toolbarbutton-icon {\
		list-style-image: url("chrome://browser/skin/undo.svg"); /* icon / path to icon */ \
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