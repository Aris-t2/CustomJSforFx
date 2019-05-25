// 'Vertical Add-on Bar' script for Firefox 60+ by Aris
//
// no 'close' button
// 'toggle' toolbar with 'Ctr + Alt + /' on Windows/Linux or 'Cmd + Alt + /' on macOS
// optional toggle button hides the toolbar temporarily, it gets restored on every restart
// 'Vertical Add-on Bar' entry is only visible in toolbars context menu when in customizing mode
//
// flexible spaces on toolbar work 'vertically'
// toolbar can be on the left or on the right
// toolbar is display horizontally in customizing mode

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)


Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var AddonbarVertical = {
  init: function() {
	  
	/* blank tab workaround */
	try {
	  if(gBrowser.selectedBrowser.getAttribute('blank')) gBrowser.selectedBrowser.removeAttribute('blank');
	} catch(e) {}
	  
	var addonbar_v_label = "Vertical Add-on Bar"; // toolbar name
	var button_label = "Toggle vertical Add-on Bar"; // Toggle button name
	var addonbar_v_togglebutton = true; // display toggle button for vertical toolbar (true) or not (false)
	var addonbar_v_on_the_left = true; // display vertical toolbar on the left (true) or the right (false)
	var insert_before_borders = false; // may not always offer a visible change
	var style_addonbar_v = true; // apply default toolbar appearance/colors to vertical add-on bar
	var addonbar_v_width = "30px"; // toolbar width

	try {
	 if(document.getElementById('toolbox_abv') == null) {
	  if(appversion <= 62) var toolbox_abv = document.createElement("toolbox");
	  else var toolbox_abv = document.createXULElement("toolbox");
	  toolbox_abv.setAttribute("orient","horizontal");
	  toolbox_abv.setAttribute("id","toolbox_abv");
	  toolbox_abv.setAttribute("insertbefore","sidebar-box");
	  
	  if(appversion <= 62) var tb_addonbarv = document.createElement("toolbar");
	  else var tb_addonbarv = document.createXULElement("toolbar");
	  tb_addonbarv.setAttribute("id","addonbar_v");
	  tb_addonbarv.setAttribute("customizable","true");
	  tb_addonbarv.setAttribute("class","toolbar-primary chromeclass-toolbar browser-toolbar customization-target");
	  tb_addonbarv.setAttribute("mode","icons");
	  tb_addonbarv.setAttribute("iconsize","small");
	  tb_addonbarv.setAttribute("toolboxid","navigator-toolbox");
	  tb_addonbarv.setAttribute("orient","vertical");
	  tb_addonbarv.setAttribute("flex","1");
	  tb_addonbarv.setAttribute("context","toolbar-context-menu");
	  tb_addonbarv.setAttribute("toolbarname", addonbar_v_label);
	  tb_addonbarv.setAttribute("label", addonbar_v_label);
	  tb_addonbarv.setAttribute("lockiconsize","true");
	  tb_addonbarv.setAttribute("defaultset","spring");
	  
	  toolbox_abv.appendChild(tb_addonbarv);
	  
	  CustomizableUI.registerArea("addonbar_v", {legacy: true});
	  if(appversion >= 65) CustomizableUI.registerToolbarNode(tb_addonbarv);
	  
	  if(addonbar_v_on_the_left) {
	    if(insert_before_borders) document.getElementById("browser").insertBefore(toolbox_abv,document.getElementById("browser").firstChild);
	    else document.getElementById("browser").insertBefore(toolbox_abv,document.getElementById("browser").firstChild.nextSibling);
	  }
	  else {
		if(insert_before_borders) document.getElementById("browser").appendChild(toolbox_abv);
	    else document.getElementById("browser").insertBefore(toolbox_abv,document.getElementById("browser").lastChild);
	  }
	  
  	  var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		  try {
			if(document.querySelector('#main-window').getAttribute('customizing')) {
			  document.querySelector('#addonbar_v').setAttribute("orient","horizontal");
			  document.querySelector('#navigator-toolbox').appendChild(document.querySelector('#addonbar_v'));
			}
			else  {
			  document.querySelector('#addonbar_v').setAttribute("orient","vertical");
			  document.querySelector('#toolbox_abv').appendChild(document.querySelector('#addonbar_v'));

			}
		  } catch(e){}
		});    
	  });
	
	  observer.observe(document.querySelector('#main-window'), { attributes: true, attributeFilter: ['customizing'] });
	  
	  try {
		Services.prefs.getDefaultBranch("browser.vaddonbar.").setBoolPref("enabled",true);
		setToolbarVisibility(document.getElementById("addonbar_v"), Services.prefs.getBranch("browser.vaddonbar.").getBoolPref("enabled"));
		setToolbarVisibility(document.getElementById("toolbox_abv"), Services.prefs.getBranch("browser.vaddonbar.").getBoolPref("enabled"));
	  } catch(e) {}
	  
	  if(addonbar_v_togglebutton) {
	  
		CustomizableUI.createWidget({
			id: "tooglebutton_addonbar_v", // button id
			defaultArea: CustomizableUI.AREA_NAVBAR,
			removable: true,
			label: button_label, // button title
			tooltiptext: button_label, // tooltip title
			onClick: function(event) {
			  var vAddonBar = document.getElementById("addonbar_v");
			  setToolbarVisibility(vAddonBar, vAddonBar.collapsed);
			  
			  var vAddonBarBox = document.getElementById("toolbox_abv");
			  setToolbarVisibility(vAddonBarBox, vAddonBarBox.collapsed);
			  
			  Services.prefs.getBranch("browser.vaddonbar.").setBoolPref("enabled",!vAddonBar.collapsed)
			  
			  if(!vAddonBar.collapsed)
			    document.querySelector('#tooglebutton_addonbar_v').setAttribute("checked","true");
			   else document.querySelector('#tooglebutton_addonbar_v').removeAttribute("checked");
			},
			onCreated: function(button) {
			  if(!document.getElementById("addonbar_v").collapsed)
			    button.setAttribute("checked","true");
			  return button;
			}
				
		});
	  }

	  // 'Ctr + Alt + /' on Windows/Linux or 'Cmd + Alt + /' on macOS to toggle vertical add-on bar
	  var key = document.createXULElement('key');
	  if(appversion < 69) key = document.createElement("key");
	  key.id = 'key_toggleVAddonBar';
	  key.setAttribute('key', '/');
	  key.setAttribute('modifiers', 'accel,alt');
	  key.setAttribute('oncommand',
		'	var newvAddonBar = document.getElementById("addonbar_v");\
			setToolbarVisibility(newvAddonBar, newvAddonBar.collapsed);\
			var newvAddonBarBox = document.getElementById("toolbox_abv");\
			setToolbarVisibility(newvAddonBarBox, newvAddonBarBox.collapsed);\
		');
	  document.getElementById('mainKeyset').appendChild(key);
	  
	 }
	} catch(e) {}
	
	// style toolbar & toggle button
	var addonbar_v_style = '';
	var tooglebutton_addonbar_v_style = '';
	
	if(style_addonbar_v) {
	  var end_border =' \
		#addonbar_v { \
			-moz-border-end: 1px solid var(--sidebar-border-color,rgba(0,0,0,0.1)) !important; \
		}\
	  ';
		  
	  if(!addonbar_v_on_the_left) {
		end_border ='\
		  #addonbar_v { \
			-moz-border-start: 1px solid var(--sidebar-border-color,rgba(0,0,0,0.1)) !important; \
		  }\
		';
	  }

	  addonbar_v_style ='\
		#addonbar_v { \
		  -moz-appearance: none !important; \
		  background-color: var(--toolbar-bgcolor); \
		  background-image: var(--toolbar-bgimage); \
		  background-clip: padding-box; \
		  color: var(--toolbar-color, inherit); \
		} \
		#main-window:not([customizing]) #toolbox_abv:not([collapsed="true"]), \
		#main-window:not([customizing]) #addonbar_v:not([collapsed="true"]) { \
		  min-width: '+addonbar_v_width+'; \
		  width: '+addonbar_v_width+'; \
		  max-width: '+addonbar_v_width+'; \
		} \
		#main-window[chromehidden="menubar toolbar location directories status extrachrome "] #toolbox_abv:not([collapsed="true"]), \
		#main-window[chromehidden="menubar toolbar location directories status extrachrome "] #addonbar_v:not([collapsed="true"]), \
		#main-window[sizemode="fullscreen"] #toolbox_abv:not([collapsed="true"]), \
		#main-window[sizemode="fullscreen"] #addonbar_v:not([collapsed="true"]) { \
		  min-width: 0px; \
		  width: 0px; \
		  max-width: 0px; \
		} \
		#main-window[customizing] #addonbar_v { \
		  outline: 1px dashed !important; \
		  outline-offset: -2px !important; \
		} \
		'+end_border+' \
	  ';
	}
	
	if(addonbar_v_togglebutton) {
	  tooglebutton_addonbar_v_style ='\
		#tooglebutton_addonbar_v .toolbarbutton-icon { \
		  list-style-image: url("chrome://browser/skin/sidebars.svg"); \
		  fill: green; \
		}\
		/*#tooglebutton_addonbar_v .toolbarbutton-icon { \
		  list-style-image: url("chrome://browser/skin/forward.svg"); \
		  fill: red; \
		} \
		#tooglebutton_addonbar_v[checked] .toolbarbutton-icon { \
		  fill: green;  \
		} \
		#tooglebutton_addonbar_v { \
		  background: url("chrome://browser/skin/back.svg") no-repeat; \
		  background-size: 35% !important; \
		  background-position: 10% 70% !important; \
		} \
		#tooglebutton_addonbar_v[checked] { \
		  transform: rotate(180deg) !important;  \
		  background: url("chrome://browser/skin/back.svg") no-repeat; \
		  background-position: 10% 30% !important; \
		}*/ \
	  ';
	}
	  
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  '+addonbar_v_style+' \
	  '+tooglebutton_addonbar_v_style+' \
	'), null, null);
	  
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	
  }

}

/* initialization delay workaround */
document.addEventListener("DOMContentLoaded", AddonbarVertical.init(), false);

/*
setTimeout(function(){
  AddonbarVertical.init();
},1000);
*/
