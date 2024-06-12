// 'Open Password Manager' button for Firefox 91+ by Aris

(function() {

try {
  ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  var appversion = parseInt(Services.appinfo.version);
  
  CustomizableUI.createWidget({
	id: "pw_manager_button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: "Open Password Manager", // button title
	tooltiptext: "Open Password Manager", // tooltip title
	onClick: function(event) {

	  if(event.button=='0') {
		try {
		  LoginHelper.openPasswordManager(window, { filterString: gBrowser.currentURI.host, entryPoint: 'mainmenu' });
		} catch (e) {
		  LoginHelper.openPasswordManager(window, { entryPoint: 'mainmenu' });
		}
	  }
	  
	  if(event.button=='1') {
		try {
		  gBrowser.selectedTab = gBrowser.addTrustedTab('about:logins');
		} catch (e) {}
	  }
	  

	},
	
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  /* set icon */
  var button_icon = 'chrome://browser/skin/login.svg';
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #pw_manager_button .toolbarbutton-icon {\
		list-style-image: url("'+button_icon+'") !important; /* icon / path to icon */ \
		fill: red !important; /* icon color name/code */\
	  }\
	  #customization-content-container #pw_manager_button .toolbarbutton-icon, \
	  panelmultiview #pw_manager_button .toolbarbutton-icon {\
		width: 18px !important; \
		height: 18px !important; \
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();
