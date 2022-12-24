// Add-on Bar script for Firefox 102+ by Aris
//
// no 'close' button
// 'toggle' toolbar with 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS
// no 'Add-on Bar' entry in toolbar context menu
//
// option: smaller buttons / reduced toolbar button height
//
// flexible spaces on add-on bar behave like on old Firefox versions

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)


Components.utils.import('resource:///modules/CustomizableUI.jsm');
var {Services} = Components.utils.import('resource://gre/modules/Services.jsm', {});
var appversion = parseInt(Services.appinfo.version);

var compact_buttons = false; // reduced toolbar height and smaller buttons

var AddAddonbar = {
  init: function() {

	if (location != 'chrome://browser/content/browser.xhtml')
      return;
	  
	/* blank tab workaround */
	try {
	  if(gBrowser.selectedBrowser.getAttribute('blank')) gBrowser.selectedBrowser.removeAttribute('blank');
	} catch(e) {}
	
	try {
	  Services.prefs.getDefaultBranch('browser.addonbar.').setBoolPref('enabled',true);
	} catch(e) {}

	var addonbar_label = 'Add-on Bar';
	var compact_buttons_code = '';
	
	if(compact_buttons)
	  compact_buttons_code = `
		#addonbar toolbarbutton .toolbarbutton-icon {
		  padding: 0 !important;
		  width: 16px !important;
		  height: 16px !important;
		}
		#addonbar .toolbarbutton-badge-stack {
		  padding: 0 !important;
		  margin: 0 !important;
		  width: 16px !important;
		  min-width: 16px !important;
		  height: 16px !important;
		  min-height: 16px !important;
		}
		#addonbar toolbarbutton .toolbarbutton-badge {
		  margin-top: 0px !important;
		  font-size: 8px !important;
		}
	  `;

	// style sheet
	Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).loadAndRegisterSheet(
	  Services.io.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(`
		  #addonbar toolbarpaletteitem[place=toolbar][id^=wrapper-customizableui-special-spring],
		  #addonbar toolbarspring {
			-moz-box-flex: 1 !important;
			min-width: unset !important;
			width: unset !important;
			max-width: unset !important;
		  }
		  #main-window[customizing] #addonbar {
			outline: 1px dashed !important;
			outline-offset: -2px !important;
		  }
		  #addonbar {
			border-top: 1px solid var(--sidebar-border-color,rgba(0,0,0,0.1)) !important;
			background-color: var(--toolbar-bgcolor);
			background-image: var(--toolbar-bgimage);
			-moz-window-dragging: no-drag !important;
		  }
		  #main-window:-moz-lwtheme #addonbar {
			background: var(--lwt-accent-color) !important;
		  }
		  #main-window[lwtheme-image='true']:-moz-lwtheme #addonbar {
			background: var(--lwt-header-image) !important;
			background-position: 0vw 50vh !important;
		  }
		  /* autohide add-on bar in fullscreen mode */
		  /*#main-window[sizemode='fullscreen']:not([inDOMFullscreen='true']) #addonbar {
			visibility: visible !important;
			display: block !important;
			min-height: 1px !important;
			height: 1px !important;
			max-height: 1px !important;
		  }
		  #main-window[sizemode='fullscreen']:not([inDOMFullscreen='true']) #addonbar:hover {
			min-height: 24px !important;
			height: 24px !important;
			max-height: 24px !important;
		  }*/
		  `+compact_buttons_code+`
	  `), null, null),
	  Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET
	);

	// toolbar
	try {
	  if(document.getElementById('addonbar') == null) {
		var tb_addonbar = document.createXULElement('toolbar');
		tb_addonbar.setAttribute('id','addonbar');
		tb_addonbar.setAttribute('collapsed', 'false');
		tb_addonbar.setAttribute('toolbarname', addonbar_label);
		tb_addonbar.setAttribute('defaultset','spring,spring'); 
		tb_addonbar.setAttribute('customizable','true');
		tb_addonbar.setAttribute('mode','icons');
		tb_addonbar.setAttribute('iconsize','small');
		tb_addonbar.setAttribute('context','toolbar-context-menu');
		tb_addonbar.setAttribute('lockiconsize','true');
		tb_addonbar.setAttribute('class','toolbar-primary chromeclass-toolbar browser-toolbar customization-target');

		document.getElementById('browser').parentNode.appendChild(tb_addonbar);
		
		CustomizableUI.registerArea('addonbar', {legacy: true});
	  
		CustomizableUI.registerToolbarNode(tb_addonbar);
		
		// 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS to toggle add-on bar
		var key = document.createXULElement('key');
		key.id = 'key_toggleAddonBar';
		key.setAttribute('key', '/');
		key.setAttribute('modifiers', 'accel');
		key.setAttribute('oncommand',`
			var newAddonBar = document.getElementById('addonbar');
			setToolbarVisibility(newAddonBar, newAddonBar.collapsed);
			Services.prefs.getBranch('browser.addonbar.').setBoolPref('enabled',!newAddonBar.collapsed);
		  `);
		document.getElementById('mainKeyset').appendChild(key);
		
		
		try {
		  setToolbarVisibility(document.getElementById('addonbar'), Services.prefs.getBranch('browser.addonbar.').getBoolPref('enabled'));
		} catch(e) {}
	  
	  }
	} catch(e) {}

  }

}

/* initialization delay workaround */
document.addEventListener('DOMContentLoaded', AddAddonbar.init(), false);
/* Use the below code instead of the one above this line, if issues occur */
/*
setTimeout(function(){
  AddAddonbar.init();
},2000);
*/
