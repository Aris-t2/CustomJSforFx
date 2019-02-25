// Restore 'Space & Separator' items script for Firefox 60+ by Aris
//
// Default browser scripts always remove spaces and separators from default palette, so
// because of that they are added to an own toolbar now.
//
// - spaces and separators can be moved to any toolbar
// - to remove spaces or separators move them into palette
// - configuration toolbar behaves like a default toolbar, items and buttons can be placed on it
// - configuration toolbar is not visible outside customizing mode
// - default "Flexible Space" item is hidden from palette and added to configuration toolbar
// [!] BUG: do not move spaces, flexible spaces or separator to configuration toolbar or it will cause glitches
// [!] BUG: do not move main 'space'-item to palette or it will be hidden until customizing mode gets reopened

// [!] BUG: WebExtensions with own windows
// - fix by aborix
// - fix for usage of multiple scripts by 黒仪大螃蟹


Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var AddSeparator = {
  init: function() {
	  
	if (document.getElementById('main-window').getAttribute('chromehidden')) {
	  return gBrowser.selectedBrowser.removeAttribute('blank');
	}
	  
	var tb_config_label = "Configuration Toolbar";
	var tb_spacer_label = "Space";
	var tb_sep_label = "Separator";
	var tb_spring_label = "Flexible Space";
	  
	try {
		
	  if(appversion <= 62) var tb_config = document.createElement("toolbar");
	  else var tb_config = document.createXULElement("toolbar");
	  tb_config.setAttribute("id","configuration_toolbar");
	  tb_config.setAttribute("customizable","true");
	  tb_config.setAttribute("class","toolbar-primary chromeclass-toolbar browser-toolbar customization-target");
	  tb_config.setAttribute("mode","icons");
	  tb_config.setAttribute("iconsize","small");
	  tb_config.setAttribute("toolboxid","navigator-toolbox");
	  tb_config.setAttribute("lockiconsize","true");
	  tb_config.setAttribute("ordinal","1005");
	  tb_config.setAttribute("defaultset","toolbarspacer,toolbarseparator");
	  
	  document.querySelector('#navigator-toolbox').appendChild(tb_config);
	  
	  CustomizableUI.registerArea("configuration_toolbar", {legacy: true});
	  if(appversion >= 65) CustomizableUI.registerToolbarNode(tb_config);
	  
	  if(appversion <= 62) var tb_label = document.createElement("label");
	  else var tb_label = document.createXULElement("label");
	  tb_label.setAttribute("label", tb_config_label+": ");
	  tb_label.setAttribute("value", tb_config_label+": ");
	  tb_label.setAttribute("id","tb_config_tb_label");
	  tb_label.setAttribute("removable","false");
	  
	  tb_config.appendChild(tb_label);
	  
	  
	  if(appversion <= 62) var tb_spacer = document.createElement("toolbarspacer");
	  else var tb_spacer = document.createXULElement("toolbarspacer");
	  tb_spacer.setAttribute("id","spacer");
	  tb_spacer.setAttribute("class","chromeclass-toolbar-additional");
	  tb_spacer.setAttribute("customizableui-areatype","toolbar");
	  tb_spacer.setAttribute("removable","false");
	  tb_spacer.setAttribute("label", tb_spacer_label);
	  
	  tb_config.appendChild(tb_spacer);
	
	  
	  if(appversion <= 62) var tb_sep = document.createElement("toolbarseparator");
	  else var tb_sep = document.createXULElement("toolbarseparator");
	  tb_sep.setAttribute("id","separator");
	  tb_sep.setAttribute("class","chromeclass-toolbar-additional");
	  tb_sep.setAttribute("customizableui-areatype","toolbar");
	  tb_sep.setAttribute("removable","false");
	  tb_sep.setAttribute("label", tb_sep_label);
 	  
	  tb_config.appendChild(tb_sep);
	  
	 
	  if(appversion <= 62) var tb_spring = document.createElement("toolbarspring");
	  else var tb_spring = document.createXULElement("toolbarspring");
	  tb_spring.setAttribute("id","spring");
	  tb_spring.setAttribute("class","chromeclass-toolbar-additional");
	  tb_spring.setAttribute("customizableui-areatype","toolbar");
	  tb_spring.setAttribute("removable","false");
	  tb_spring.setAttribute("label", tb_spring_label);
	  	  
	  tb_config.appendChild(tb_spring);
	    
	  // CSS
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
		#configuration_toolbar { \
	      -moz-appearance: none !important; \
		  background-color: var(--toolbar-bgcolor); \
		  background-image: var(--toolbar-bgimage); \
		  background-clip: padding-box; \
		  color: var(--toolbar-color, inherit); \
		} \
		#main-window:not([customizing]) #configuration_toolbar { \
		  visibility: collapse; \
		}\
		#main-window[customizing] #configuration_toolbar #tb_config_tb_label { \
		  font-weight: bold !important; \
		}\
		#main-window[customizing] #configuration_toolbar :-moz-any(#spacer,#separator,#spring) { \
		  -moz-margin-start: 20px; \
		}\
		#main-window[customizing] #configuration_toolbar :-moz-any(#wrapper-spacer,#wrapper-separator,#wrapper-spring) .toolbarpaletteitem-label { \
		  display: block !important; \
		  -moz-margin-end: 20px; \
		}\
		#main-window[customizing] #wrapper-spacer #spacer { \
		  margin: 2px 0 !important; \
		}\
		#main-window[customizing] #configuration_toolbar #wrapper-spring #spring { \
		  margin: -1px 0 !important; \
		  min-width: 80px !important; \
		}\
		#main-window[customizing] #configuration_toolbar > * { \
		  padding: 10px !important; \
		}\
		#main-window[customizing] #configuration_toolbar > :-moz-any(#wrapper-spacer,#wrapper-separator,#wrapper-spring) { \
		  border: 1px dotted !important; \
		  -moz-margin-start: 2px !important; \
		  -moz-margin-end: 2px !important; \
		}\
		#main-window[customizing] toolbarspacer { \
		  border: 1px solid !important; \
		}\
		toolbar[orient="vertical"] toolbarseparator { \
		  -moz-appearance: none !important; \
		  border-top: 1px solid rgba(15,17,38, 0.5) !important; \
		  border-bottom: 1px solid rgba(255,255,255, 0.3) !important; \
		  margin: 2px 2px !important; \
		  height: 1px !important; \
		  width: 18px !important; \
		}\
		toolbar[orient="vertical"] toolbarspacer { \
		  -moz-appearance: none !important; \
		  height: 18px !important; \
		  width: 18px !important; \
		}\
		#customization-palette toolbarpaletteitem[id^="wrapper-customizableui-special-spring"], \
		#customization-palette-container :-moz-any(#spring,#wrapper-spring) { \
		  display: none !important; \
		}\
	  \
	  '), null, null);

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	
	} catch(e){}
	

	// thx to aborix for the fix
	if(document.getElementById("main-window").getAttribute("chromehidden") != "") {
		if (window.__SSi == 'window0')
		  return;
		let tabbar = document.getElementById('TabsToolbar');     
		let tab = gBrowser.selectedTab;
		tabbar.style.display = '-moz-box';
		duplicateTabIn(tab, 'tab');
		gBrowser.moveTabTo(gBrowser.selectedTab, tab._tPos);
		gBrowser.removeTab(tab);
		tabbar.style.display = ''; 
	}

  }

}

setTimeout(function(){
  AddSeparator.init();
},500);
