// 'Open Password Manager' button for Firefox 60+ by Aris
//
// left-click on password manager button: opens 'chrome://passwordmgr/content/passwordManager.xul' in a popup
// middle-click on password manager button: fill current (non-chrome) domain/host into input field
// right-click on password manager button: default context menu

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  Components.utils.import("resource://gre/modules/LoginHelper.jsm");
  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  CustomizableUI.createWidget({
	id: "pw_manager_button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: "Open Password Manager", // button title
	tooltiptext: "Open Password Manager", // tooltip title
	onClick: function(event) {
			
	  if(event.button=='0') {
		try {
		  window.open('chrome://passwordmgr/content/passwordManager.xul','', 'chrome');
		} catch (e) {}
	  } else if(event.button=='1') {
		try {
		  LoginHelper.openPasswordManager(window, { filterString: gBrowser.currentURI.host, entryPoint: 'mainmenu' });
		} catch (e) {
		  LoginHelper.openPasswordManager(window, { entryPoint: 'mainmenu' });
		}
	  }
	  
	},
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  /* set icon */
  var button_icon = 'chrome://browser/skin/login.svg';
  if (parseInt(Services.appinfo.version) < 68) button_icon = 'chrome://browser/skin/connection-secure.svg';
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #pw_manager_button .toolbarbutton-icon {\
		list-style-image: url("'+button_icon+'"); /* icon / path to icon */ \
		fill: red; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();