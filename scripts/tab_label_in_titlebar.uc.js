// 'Tab label in titlebar' script for Firefox by Aris

(function() {

  try {

	// Configuration area

	// 0 = CustomCSSforFx not installed or tabs on top;
	// 1 = tabs not on top;
	// 2 = tabs not on top + alt menubar position;
	var customcssforfx_tabs_position = 0; 
	
	// 0 = CustomCSSforFx not installed / disabled; 
	// 1 = default/large;
	// 2 = icon only
	var customcssforfx_appbutton_in_titlebar = 0; 


	// create 'tab label in titlebar' item
	var titlebarlabelbox = document.createXULElement("hbox");
	titlebarlabelbox.setAttribute("id","tab_label_in_titlebar_box");

	var titlebarlabel = document.createXULElement("label");
	titlebarlabel.setAttribute("id","tab_label_in_titlebar");
	titlebarlabelbox.appendChild(titlebarlabel);
	document.getElementById("titlebar").insertBefore(titlebarlabelbox, document.getElementById("titlebar").firstChild);
 
	// cases where tab title changes
	document.addEventListener("TabAttrModified", updateLabel, false);
	document.addEventListener('TabSelect', updateLabel, false);
	document.addEventListener('TabOpen', updateLabel, false);
	document.addEventListener('TabClose', updateLabel, false);
	document.addEventListener('load', updateLabel, false);
	document.addEventListener("DOMContentLoaded", updateLabel, false);
	
	updateLabel();
  
	function updateLabel() {
	  setTimeout(function(){
	    titlebarlabel.setAttribute("value",gBrowser.selectedBrowser.contentTitle);
	  },100);
	}
	
	var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	
	var customcssforfx_appbutton_in_titlebar_code = '';
	
	if(customcssforfx_appbutton_in_titlebar == 1)
	  customcssforfx_appbutton_in_titlebar_code = ' \
	  #tab_label_in_titlebar_box { \
		padding-inline-start: 93px !important; \
	  } \
	  ';
    else if(customcssforfx_appbutton_in_titlebar == 2)
	  customcssforfx_appbutton_in_titlebar_code = ' \
	  #tab_label_in_titlebar_box { \
		padding-inline-start: 40px !important; \
	  } \
	  ';
	  
	var adjust_tabs_toolbar_position_code = ' \
	  #toolbar-menubar { \
		padding-top: 20px !important; \
	  } \
	  #toolbar-menubar[inactive="true"] + #TabsToolbar { \
		padding-top: 26px !important; \
	  } \
	  .titlebar-spacer[type="pre-tabs"], \
	  .titlebar-spacer[type="post-tabs"] { \
		display: none !important; \
	  } \
	  #main-window:not([sizemode="fullscreen"]) .titlebar-buttonbox-container { \
	    position: absolute !important; \
		display: flex !important; \
		top: 0 !important; \
		right: 0 !important; \
	  }\
	  #main-window:not([sizemode="fullscreen"])[sizemode="maximized"] .titlebar-buttonbox-container { \
		top: 8px !important; \
	  }\
	  #main-window[tabsintitlebar] #TabsToolbar { \
		padding-inline-start: 2px !important; \
	  } \
	  ';

	if(customcssforfx_tabs_position == 1)
	  adjust_tabs_toolbar_position_code = ' \
	  #toolbar-menubar #menubar-items { \
		padding-top: 13px !important; \
	  } \
	  #tab_label_in_titlebar_box { \
		margin-top: -3px !important; \
	  } \
	  #toolbar-menubar .menubar-text { \
		margin: 0px 6px !important; \
	  } \
	  #main-window:not([sizemode="fullscreen"])[sizemode="maximized"] #toolbar-menubar #menubar-items { \
		padding-top: 10px !important; \
	  } \
	  #main-window:not([sizemode="fullscreen"])[sizemode="maximized"] #tab_label_in_titlebar_box { \
		margin-top: -4px !important; \
	  } \
	  #main-window:not([sizemode="fullscreen"])[sizemode="maximized"] #toolbar-menubar .menubar-text { \
		margin: -2px 6px !important; \
	  } \
	  ';
	
	if(customcssforfx_tabs_position == 2)
	  adjust_tabs_toolbar_position_code = ' \
	  #toolbar-menubar { \
	    position: absolute !important; \
		display: flex !important; \
		top: 0 !important; \
		right: 0px !important; \
	  } \
	  #main-window:not([sizemode="fullscreen"])[sizemode="maximized"] #toolbar-menubar { \
		top: 8px !important; \
	  }\
	  #tab_label_in_titlebar_box { \
		max-width: 40vw !important; \
	  } \
	  ';
	
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
	  #tab_label_in_titlebar_box { \
	    position: absolute !important; \
		display: flex !important; \
	  }\
	  '+adjust_tabs_toolbar_position_code+'\
	  '+customcssforfx_appbutton_in_titlebar_code+'\
	  \
	  '), null, null);
  
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
  } catch(e) {}
	
}());
