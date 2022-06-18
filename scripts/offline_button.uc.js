// 'Offline'-Button script for Firefox by Aris

// Toggle 'Offline' / 'Online' modes
// - default Firefox behavior is enabling online-mode on restart
// - this script prevents this behavior
// - make sure you are no using the menuitem 'File > Work offline'

(function() {

try {
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  var button_label = "Work Offline";
  
  	try {
	  Services.prefs.getDefaultBranch("browser.workoffline.").setBoolPref("enabled",false);
	  
	  if(Services.prefs.getBranch("browser.workoffline.").getBoolPref("enabled")) {
		BrowserOffline.toggleOfflineStatus();
	  }

	} catch(e) {}

  CustomizableUI.createWidget({
	id: "offline-button", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
		
      if(event.button=='0') {
		try {

		  BrowserOffline.toggleOfflineStatus();
		  
		  if(Services.prefs.getBranch("browser.workoffline.").getBoolPref("enabled") == false) {
			Services.prefs.getBranch("browser.workoffline.").setBoolPref("enabled",true);
			document.querySelector('#offline-button').setAttribute("checked","true");
		  }
		  else {
			Services.prefs.getBranch("browser.workoffline.").setBoolPref("enabled",false);
			document.querySelector('#offline-button').removeAttribute("checked");
		  }

		} catch (e) {}
	  } 
	  
	},
	onCreated: function(button) {
	  
	  if(Services.prefs.getBranch("browser.workoffline.").getBoolPref("enabled"))
	    button.setAttribute("checked","true");
	  else if(Services.prefs.getBranch("browser.workoffline.").getBoolPref("enabled") == false)
		button.removeAttribute("checked");
	
	  return button;
	}
		
  });
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #offline-button .toolbarbutton-icon {\
		list-style-image: url("chrome://devtools/skin/images/tool-network.svg"); /* icon / path to icon */ \
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();