// Restart button script for Firefox 60+ by Aris
//
// left-click on restart button: normal restart
// middle-click on restart button: restart + clear caches
// right-click on restart button: no special function
//
// based on 'Quit' button code by 2002Andreas
// restart code from Classic Theme Restorer add-on
// invalidate caches from Session Saver add-on

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  var appversion = parseInt(Services.appinfo.version);
  
  var button_label = "Restart";
 
  CustomizableUI.createWidget({
	id: "uc-restart", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
	  
	  var cancelQuit   = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
	  var observerSvc  = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			
	  if(event.button=='1') { // middle-click - clear caches
		Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
	  }
	  
	  if(event.button=='0' || event.button=='1') { // left/middle-click - restart
		observerSvc.notifyObservers(cancelQuit, "quit-application-requested", "restart");
			
		if(cancelQuit.data) return false;
				
		Services.startup.quit(Services.startup.eRestart | Services.startup.eAttemptQuit);
	  }
	},
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  var icon = "chrome://global/skin/icons/reload.svg";
  
  if(appversion < 92) icon = "chrome://browser/skin/reload.svg";
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #uc-restart .toolbarbutton-icon {\
		list-style-image: url("'+icon+'"); /* icon / path to icon */ \
		transform: scaleX(-1); /* icon mirroring */\
		fill: red; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();