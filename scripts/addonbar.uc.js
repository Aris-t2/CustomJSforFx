// Add-on Bar script for Firefox 60+ by Aris
//
// no 'close' button
// 'toggle' toolbar with 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS
// no 'Add-on Bar' entry in toolbar context menu
//
// flexible spaces on add-on bar behave like on old Firefox versions


Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var AddAddonbar = {
  init: function() {
	  
	var addonbar_label = "Add-on Bar";

	// style sheet
	Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService).loadAndRegisterSheet(
	  Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
		  \
		  #addonbar toolbarpaletteitem[place=toolbar][id^=wrapper-customizableui-special-spring],\
		  #addonbar toolbarspring {\
			-moz-box-flex: 1 !important;\
			min-width: 100% !important;\
			width: unset !important;\
			max-width: unset !important;\
		  }\
		  #main-window[customizing] #addonbar { \
			outline: 1px dashed !important; \
			outline-offset: -2px !important; \
		  } \
		  #addonbar { \
			border-top: 1px solid var(--sidebar-border-color,rgba(0,0,0,0.1)) !important; \
		  } \
		  \
	  '), null, null),
	  Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET
	);

	// toolbar
	try {
	  var tb_addonbar = document.createXULElement("toolbar");
	  if(appversion <= 62) tb_addonbar = document.createElement("toolbar");
	  tb_addonbar.setAttribute("id","addonbar");
	  tb_addonbar.setAttribute("collapsed", "false");
	  tb_addonbar.setAttribute("toolbarname", addonbar_label);
	  tb_addonbar.setAttribute("defaultset","spring,spring"); 
	  tb_addonbar.setAttribute("customizable","true");
	  tb_addonbar.setAttribute("mode","icons");
	  tb_addonbar.setAttribute("iconsize","small");
	  tb_addonbar.setAttribute("context","toolbar-context-menu");
	  tb_addonbar.setAttribute("lockiconsize","true");
	  tb_addonbar.setAttribute("class","toolbar-primary chromeclass-toolbar browser-toolbar customization-target");

	  document.getElementById("browser-bottombox").appendChild(tb_addonbar);
	  
	  //CustomizableUI.registerArea("addonbar", {type: CustomizableUI.TYPE_TOOLBAR, defaultPlacements: ["#customizableui-special-spring777", "#customizableui-special-spring778"], legacy: true});
	  CustomizableUI.registerArea("addonbar", {legacy: true});
	  
	  // thx to aborix for the fix
	  if(document.getElementById("main-window").getAttribute("chromehidden") != "") {
		let tabbar = document.getElementById('TabsToolbar');     
		let tab = gBrowser.selectedTab;
		tabbar.style.display = '-moz-box';
		let tab2 = gBrowser.duplicateTab(tab);
		gBrowser.moveTabTo(tab2, tab._tPos + 1);
		gBrowser.removeTab(tab);
		tabbar.style.display = '';
	  }
   
	  if(appversion >= 65) {
		CustomizableUI.registerToolbarNode(tb_addonbar);
		// broken tab workaround
		let tab = gBrowser.selectedTab;
		gBrowser.duplicateTab(tab);
		gBrowser.removeTab(tab);
	  }
	
	  // 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS to toggle add-on bar
	  var key = document.createElement('key');
	  key.id = 'key_toggleAddonBar';
	  key.setAttribute('key', '/');
	  key.setAttribute('modifiers', 'accel');
	  key.setAttribute('oncommand',
		'var newAddonBar = document.getElementById("addonbar"); setToolbarVisibility(newAddonBar, newAddonBar.collapsed);');
	  document.getElementById('mainKeyset').appendChild(key);
	  
	} catch(e) {}

  }

}

setTimeout(function(){
  AddAddonbar.init();
},500);