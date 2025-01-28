// Add-on Bar script for Firefox 126+ by Aris
//
// no 'close' button
// 'toggle' toolbar with 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS
// no 'Add-on Bar' entry in toolbar context menu
//
// option: smaller buttons / reduced toolbar button height
//
// flexible spaces on add-on bar behave like on old Firefox versions

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)


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
	var h_button_label = 'Toggle horizontal Add-on Bar'; // Toggle button name
	
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
		  font-size: 5pt !important;
		  min-width: unset !important;
		  min-height: unset !important;
		  margin-inline-start: 0px !important;
		  margin-inline-end: 0px !important;
		}
		#addonbar .toolbaritem-combined-buttons {
		  margin-inline: 0px !important;
		}
		#addonbar toolbarbutton {
		  padding: 0 !important;
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
		  :root[lwtheme]  #addonbar {
			background: var(--lwt-accent-color) !important;
		  }
		  :root[lwtheme][lwtheme-image='true'] #addonbar {
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
		  #togglebutton_addonbar_h .toolbarbutton-icon { \
		    list-style-image: url('chrome://browser/skin/sidebars.svg');
		    fill: green; 
			transform: rotate(270deg);
		  }
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
	    /*key.setAttribute('oncommand',`
			var windows = Services.wm.getEnumerator(null);
			while (windows.hasMoreElements()) {
			  var win = windows.getNext();
			  var hAddonBar = win.document.getElementById('addonbar');
			  setToolbarVisibility(hAddonBar, hAddonBar.collapsed);
			  Services.prefs.getBranch('browser.addonbar.').setBoolPref('enabled',!hAddonBar.collapsed);
			  if(!hAddonBar.collapsed)
				win.document.querySelector('#togglebutton_addonbar_h').setAttribute('checked','true');
			  else win.document.querySelector('#togglebutton_addonbar_h').removeAttribute('checked');
			}
	    `);*/
		key.addEventListener("command", () => {var windows = Services.wm.getEnumerator(null);
			while (windows.hasMoreElements()) {
			  var win = windows.getNext();
			  var hAddonBar = win.document.getElementById('addonbar');
			  setToolbarVisibility(hAddonBar, hAddonBar.collapsed);
			  Services.prefs.getBranch('browser.addonbar.').setBoolPref('enabled',!hAddonBar.collapsed);
			  if(!hAddonBar.collapsed)
				win.document.querySelector('#togglebutton_addonbar_h').setAttribute('checked','true');
			  else win.document.querySelector('#togglebutton_addonbar_h').removeAttribute('checked');
			}} );
		document.getElementById('mainKeyset').appendChild(key);
		
		
		try {
		  setToolbarVisibility(document.getElementById('addonbar'), Services.prefs.getBranch('browser.addonbar.').getBoolPref('enabled'));
		} catch(e) {}
		
		
		CustomizableUI.createWidget({
			id: 'togglebutton_addonbar_h', // button id
			defaultArea: CustomizableUI.AREA_NAVBAR,
			removable: true,
			label: h_button_label, // button title
			tooltiptext: h_button_label, // tooltip title
			onClick: function(event) {
			  if(event.button==0) {
			    var windows = Services.wm.getEnumerator(null);
				while (windows.hasMoreElements()) {
				  var win = windows.getNext();
				  
				  var hAddonBar = win.document.getElementById('addonbar');
				  setToolbarVisibility(hAddonBar, hAddonBar.collapsed);
					  
				  
				  Services.prefs.getBranch('browser.addonbar.').setBoolPref('enabled',!hAddonBar.collapsed);
				  
				  if(!hAddonBar.collapsed)
					win.document.querySelector('#togglebutton_addonbar_h').setAttribute('checked','true');
				  else win.document.querySelector('#togglebutton_addonbar_h').removeAttribute('checked');
				}
			  }
			},
			onCreated: function(button) {
			  if(Services.prefs.getBranch('browser.addonbar.').getBoolPref('enabled'))
			    button.setAttribute('checked','true');
			  return button;
			}
				
		});
		
	  
	  }
	} catch(e) {}

  }

}

/* initialization delay workaround */
document.addEventListener('DOMContentLoaded', AddAddonbar.init(), false);
/* Use the below code instead of the one above this line, if issues occur */

/* fix for downloads button on add-on bar - thanks to dimdamin */
/* https://github.com/Aris-t2/CustomJSforFx/issues/125#issuecomment-2506613776 */
(async url => !location.href.startsWith(url) || await delayedStartupPromise ||
	(async (scrNT, nTjs) => {
		if (scrNT.length >= 1) {
			nTjs.uri = "data:application/x-javascript;charset=UTF-8,";
			nTjs.res = await fetch(scrNT[0].src);
			nTjs.src = (await nTjs.res.text())
				.replace(/navigator-toolbox/, "addonbar")
				.replace(/widget-overflow/, "addonbar");
			(await ChromeUtils.compileScript(nTjs.uri + encodeURIComponent(nTjs.src))).executeInGlobal(this);
		};
	})(document.getElementById("navigator-toolbox").querySelectorAll(":scope > script"), {})
)("chrome://browser/content/browser.x");

