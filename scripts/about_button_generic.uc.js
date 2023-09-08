// 'about:'-Button script for Firefox 89+ by Aris
//
// Need a different 'about' page button?
// - replace 'about:about' url with a different 'about:' url
// - replace button id
// - replace icon / icon url / icon color

(function() {

try {
	
  Components.utils.import("resource:///modules/CustomizableUI.jsm");
  ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
  const sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  
  const button_label = "About Button (generic)";
  
  const open_in_a_window = false; // open in a window (true) or tab (false)

  CustomizableUI.createWidget({
	id: "about-button-gen", // button id
	defaultArea: CustomizableUI.AREA_NAVBAR,
	removable: true,
	label: button_label, // button title
	tooltiptext: button_label, // tooltip title
	onClick: function(event) {
		
	  const win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator)
		.getMostRecentWindow("navigator:browser");
		
      if(event.button=='0') {
		try {
		  
		  if(open_in_a_window)
		    window.open("about:about","","width=1024,height=768, chrome");
		  else
			win.gBrowser.selectedTab = win.gBrowser.addTrustedTab('about:about');
		  
		} catch (e) {}
	  }   
	},
	onCreated: function(button) {
	  return button;
	}
		
  });
  
  // style button icon
  const uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	  #about-button-gen .toolbarbutton-icon {\
		list-style-image: url("chrome://global/skin/icons/defaultFavicon.svg"); /* icon / path to icon */ \
		fill: dimgray; /* icon color name/code */\
	  }\
	\
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
	Components.utils.reportError(e);
};

})();