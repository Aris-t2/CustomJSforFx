// 'Vertical Add-on Bar' script for Firefox 60+ by Aris
//
// no 'close' button
// no 'toggle'-key feature
// optional toggle button hides the toolbar temporarily, it gets restored on every restart
// 'Vertical Add-on Bar' entry is only visible in toolbars context menu when in customizing mode
//
// flexible spaces on toolbar work 'vertically'
// toolbar can be on the left or on the right
// toolbar is display horizontally in customizing mode


Components.utils.import("resource:///modules/CustomizableUI.jsm");
var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var AddonbarVertical = {
  init: function() {
	  
	var addonbar_v_label = "Vertical Add-on Bar"; // toolbar name
	var button_label = "Toggle vertical Add-on Bar"; // Toggle button name
	var addonbar_v_togglebutton = true; // display toggle button for vertical toolbar (true) or not (false)
	var addonbar_v_on_the_left = true; // display vertical toolbar on the left (true) or the right (false)
	var insert_before_borders = false; // may not always offer a visible change
	var style_addonbar_v = true; // apply default toolbar appearance/colors to vertical add-on bar

	try {
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
		#main-window[customizing] #addonbar_v { \
		  outline: 1px dashed !important; \
		  outline-offset: -2px !important; \
		} \
		'+end_border+' \
	  ';
	}
	
	if(addonbar_v_togglebutton) {
	  tooglebutton_addonbar_v_style ='\
		#tooglebutton_addonbar_v .toolbarbutton-icon {\
		  list-style-image: url("chrome://browser/skin/sidebars.svg"); /* icon / path to icon */ \
		  fill: green; /* icon color name/code */\
		}\
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
setTimeout(function(){
  AddonbarVertical.init();
},500);