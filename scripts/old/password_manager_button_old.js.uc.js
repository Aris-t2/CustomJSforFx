// 'Open Password Manager' button for Firefox 60+ by Aris
//
// option: 'leftclick_opens_old_pw_manager' (true) or the new one (false)
// option: 'middleclick_opens_old_pw_manager' (true) or the new one (false)
//
// default: left-click on password manager button opens new password manager in a tab and adds current (non-chrome) domain/host into input field
// default: middle-click on password manager button opens 'chrome://passwordmgr/content/passwordManager.xul/xhtml' in a popup

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  Components.utils.import("resource://gre/modules/LoginHelper.jsm");
  
  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  var leftclick_opens_old_pw_manager = false;
  var middleclick_opens_old_pw_manager = true;
  
  var appversion = parseInt(Services.appinfo.version);
  
  CustomizableUI.createWidget({
	id: "pw_manager_button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: "Open Password Manager", // button title
	tooltiptext: "Open Password Manager", // tooltip title
	onClick: function(event) {
		
	  
  
	  // open about:logins in a new tab and add current domain to it (excl. about pages)
	  function open_aboutlogins_in_tab() {
		try {
		  LoginHelper.openPasswordManager(window, { filterString: gBrowser.currentURI.host, entryPoint: 'mainmenu' });
		} catch (e) {
		  LoginHelper.openPasswordManager(window, { entryPoint: 'mainmenu' });
		}
	  }
	  
	  // open old password manager window
	  function open_old_pw_manager() {
		try { 
		  var old_pw_manager = 'chrome://passwordmgr/content/passwordManager.xhtml';
		  if(parseInt(Services.appinfo.version) < 73) old_pw_manager = 'chrome://passwordmgr/content/passwordManager.xul';
		
		  window.open(old_pw_manager ,'', 'chrome, resizable', "width=400,height=400");
		} catch (e) {}
	  }
  
	  
	  // left-click
	  if(event.button=='0') {
		
		if(leftclick_opens_old_pw_manager && appversion < 77) open_old_pw_manager();
		else open_aboutlogins_in_tab();

	  } 
	  // right-click
	  else if(event.button=='1') {
		
		if(middleclick_opens_old_pw_manager && appversion < 77) open_old_pw_manager();
		else open_aboutlogins_in_tab();

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
