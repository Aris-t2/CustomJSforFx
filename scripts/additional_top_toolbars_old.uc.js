// 'Additional top toolbars' script for Firefox 60+ by Aris
// - "number_of_additional_top_toolbars": set the amount of additional top toolbar
// - "tb_label": set a toolbar name
// - use toolbar[id^="additional_top_toolbar"] {...} to affect all toolbars at once in CSS

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)


Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var AdditionalTopToolbars = {
  init: function() {

	/* blank tab workaround */
	try {
	  if(gBrowser.selectedBrowser.getAttribute('blank')) gBrowser.selectedBrowser.removeAttribute('blank');
	} catch(e) {}
	  
	var number_of_additional_top_toolbars = 1;
	var tb_label = "Top Toolbar";

	try {
	 if(document.getElementById('additional_top_toolbar1') == null) {
		
	  if(number_of_additional_top_toolbars>0) {
	
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
	} catch(e){}	

  }

}

/* initialization delay workaround */
document.addEventListener("DOMContentLoaded", AdditionalTopToolbars.init(), false);
/*
setTimeout(function(){
  AdditionalTopToolbars.init();
},500);
*/