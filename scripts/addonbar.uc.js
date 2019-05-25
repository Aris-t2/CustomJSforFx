// Add-on Bar script for Firefox 60+ by Aris
//
// no 'close' button
// 'toggle' toolbar with 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS
// no 'Add-on Bar' entry in toolbar context menu
//
// option: smaller buttons / reduced toolbar button height
//
// flexible spaces on add-on bar behave like on old Firefox versions

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)


Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var compact_buttons = false; // reduced toolbar height and smaller buttons

var AddAddonbar = {
  init: function() {
	  
	/* blank tab workaround */
	try {
	  if(gBrowser.selectedBrowser.getAttribute('blank')) gBrowser.selectedBrowser.removeAttribute('blank');
	} catch(e) {}

	var addonbar_label = "Add-on Bar";
	var compact_buttons_code = "";
	
	if(compact_buttons)
	  compact_buttons_code = "\
		#addonbar toolbarbutton .toolbarbutton-icon { \
		  padding: 0 !important; \
		  width: 16px !important; \
		  height: 16px !important; \
		} \
		#addonbar .toolbarbutton-badge-stack { \
		  padding: 0 !important; \
		  margin: 0 !important; \
		  width: 16px !important; \
		  min-width: 16px !important; \
		  height: 16px !important; \
		  min-height: 16px !important; \
		} \
		#addonbar toolbarbutton .toolbarbutton-badge { \
		  margin-top: 0px !important; \
		  font-size: 8px !important; \
		} \
	  ";

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
		  '+compact_buttons_code+'\
	  '), null, null),
	  Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET
	);

	// toolbar
	try {
	  if(document.getElementById('addonbar') == null) {
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
		
		CustomizableUI.registerArea("addonbar", {legacy: true});
	  
		if(appversion >= 65) { CustomizableUI.registerToolbarNode(tb_addonbar); }
		
		// 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS to toggle add-on bar
		var key = document.createXULElement('key');
		if(appversion < 69) key = document.createElement("key");
		key.id = 'key_toggleAddonBar';
		key.setAttribute('key', '/');
		key.setAttribute('modifiers', 'accel');
		key.setAttribute('oncommand',
		  'var newAddonBar = document.getElementById("addonbar"); setToolbarVisibility(newAddonBar, newAddonBar.collapsed);');
		document.getElementById('mainKeyset').appendChild(key);
	  }
	} catch(e) {}

  }

}

/* initialization delay workaround */
document.addEventListener("DOMContentLoaded", AddAddonbar.init(), false);
/*
setTimeout(function(){
  AddAddonbar.init();
},2000);*/
