// 'Additional top toolbars' script for Firefox 60+ by Aris
// - "number_of_additional_top_toolbars": set the amount of additional top toolbar
// - "tb_label": set a toolbar name
// - use toolbar[id^="additional_top_toolbar"] {...} to affect all toolbars at once in CSS

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)
//
// workaround on Fx 71 to save/restore toolbar visibility
// creating an observer array always fails, so observers are created manually atm.

Components.utils.import("resource:///modules/CustomizableUI.jsm");
ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
var appversion = parseInt(Services.appinfo.version);

var AdditionalTopToolbars = {
  init: function() {

	/* blank tab workaround */
	try {
	  if(gBrowser.selectedBrowser.getAttribute('blank')) gBrowser.selectedBrowser.removeAttribute('blank');
	} catch(e) {}
	  
	var number_of_additional_top_toolbars = 1; // max 5 to save toolbar state on Fx 71+ (add additional code at the bottom for more)
	var tb_label = "Top Toolbar";

	try {
	 if(document.getElementById('additional_top_toolbar1') == null) {
		
	  if(number_of_additional_top_toolbars>0 && number_of_additional_top_toolbars<6) {
	
	    var i=1;

	    while(i<=number_of_additional_top_toolbars) {
		
		  if(appversion <= 62) var toptoolbar = document.createElement("toolbar");
		  else var toptoolbar = document.createXULElement("toolbar");
		
		  toptoolbar.setAttribute("id", "additional_top_toolbar"+i+"");
		  toptoolbar.setAttribute("toolbarname", tb_label+" ("+i+")");
		  toptoolbar.setAttribute("toolbarname", tb_label+" ("+i+")");
		  toptoolbar.setAttribute("customizable","true");
		  toptoolbar.setAttribute("class","toolbar-primary chromeclass-toolbar browser-toolbar customization-target");
		  toptoolbar.setAttribute("mode","icons");
		  toptoolbar.setAttribute("iconsize","small");
		  toptoolbar.setAttribute("toolboxid","navigator-toolbox");
		  toptoolbar.setAttribute("context","toolbar-context-menu");
		  toptoolbar.setAttribute("lockiconsize","true");
		  toptoolbar.setAttribute("defaultset","spring");
		
		  document.querySelector('#navigator-toolbox').appendChild(toptoolbar);
		  
		  CustomizableUI.registerArea("additional_top_toolbar"+i+"", {legacy: true});
		  if(appversion >= 65) CustomizableUI.registerToolbarNode(toptoolbar);
		  
		  // top toolbars 'collapsed' on startup
		  //setToolbarVisibility(toptoolbar, false);
		  
		  try {
			Services.prefs.getDefaultBranch("browser.additional_top_toolbar"+i+".").setBoolPref("enabled",true);
			setToolbarVisibility(document.getElementById("additional_top_toolbar"+i+""), Services.prefs.getBranch("browser.additional_top_toolbar"+i+".").getBoolPref("enabled"));
		  } catch(e) {}	  
		  
		  i++;
		
	    }
	  }
	  
	  // CSS
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
		toolbar[id^="additional_top_toolbar"] { \
		  -moz-appearance: none !important; \
		  background-color: var(--toolbar-bgcolor); \
		  background-image: var(--toolbar-bgimage); \
		  background-clip: padding-box; \
		  color: var(--toolbar-color, inherit); \
		} \
		#main-window[customizing] toolbar[id^="additional_top_toolbar"] { \
		  outline: 1px dashed !important; \
		  outline-offset: -2px !important; \
		} \
	  \
	  '), null, null);

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	
	 }
	 
	 
	 if(number_of_additional_top_toolbars>=1) {
		var observer1 = new MutationObserver(function(mutations) {
		  mutations.forEach(function(mutation) {
			Services.prefs.getBranch("browser.additional_top_toolbar1.").setBoolPref("enabled",!document.querySelector("#additional_top_toolbar1").collapsed);
		  });    
		});			 
		observer1.observe(document.querySelector("#additional_top_toolbar1"), { attributes: true, childList: true, characterData: true });
	  }
	  if(number_of_additional_top_toolbars>=2) {
		var observer2 = new MutationObserver(function(mutations) {
		  mutations.forEach(function(mutation) {
			Services.prefs.getBranch("browser.additional_top_toolbar2.").setBoolPref("enabled",!document.querySelector("#additional_top_toolbar2").collapsed);
		  });    
		});			 
		observer2.observe(document.querySelector("#additional_top_toolbar2"), { attributes: true, childList: true, characterData: true });
	  }
	  if(number_of_additional_top_toolbars>=3) {
		var observer3 = new MutationObserver(function(mutations) {
		  mutations.forEach(function(mutation) {
			Services.prefs.getBranch("browser.additional_top_toolbar3.").setBoolPref("enabled",!document.querySelector("#additional_top_toolbar3").collapsed);
		  });    
		});			 
		observer3.observe(document.querySelector("#additional_top_toolbar3"), { attributes: true, childList: true, characterData: true });
	  }
	  if(number_of_additional_top_toolbars>=4) {
		var observer4 = new MutationObserver(function(mutations) {
		  mutations.forEach(function(mutation) {
			Services.prefs.getBranch("browser.additional_top_toolbar4.").setBoolPref("enabled",!document.querySelector("#additional_top_toolbar4").collapsed);
		  });    
		});			 
		observer4.observe(document.querySelector("#additional_top_toolbar4"), { attributes: true, childList: true, characterData: true });
	  }
	  if(number_of_additional_top_toolbars>=5) {
		var observer5 = new MutationObserver(function(mutations) {
		  mutations.forEach(function(mutation) {
			Services.prefs.getBranch("browser.additional_top_toolbar5.").setBoolPref("enabled",!document.querySelector("#additional_top_toolbar5").collapsed);
		  });    
		});			 
		observer5.observe(document.querySelector("#additional_top_toolbar5"), { attributes: true, childList: true, characterData: true });
	  }

	} catch(e){}	

  }

}

/* initialization delay workaround */
document.addEventListener("DOMContentLoaded", AdditionalTopToolbars.init(), false);

// not needed anymore, but just in case someone prefers initialization that way
/*
setTimeout(function(){
  AdditionalTopToolbars.init();
},500);
*/
