// 'Tab label in titlebar' script for Firefox by Aris

(function() {
	
  try {

	var customcssforfx_tabs_not_on_top = 0; // 0 = CustomCSSforFx not installed; 1 = tabs on top; 2 = tabs not on top;
	var customcssforfx_appbutton_in_titlebar = 0; // 0 = CustomCSSforFx not installed / disabled; 1 = default/big; 2 = icon only
	
	var titlebarlabelbox = document.createXULElement("hbox");
	titlebarlabelbox.setAttribute("id","tab_label_in_titlebar_box");

	var titlebarlabel = document.createXULElement("label");
	titlebarlabel.setAttribute("id","tab_label_in_titlebar");
	titlebarlabelbox.appendChild(titlebarlabel);
	document.getElementById("titlebar").insertBefore(titlebarlabelbox, document.getElementById("titlebar").firstChild);
 
	// catch cases where tab title can change
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
		padding-inline-start: 95px !important; \
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

	if(customcssforfx_tabs_not_on_top == 2)
		adjust_tabs_toolbar_position_code = '';
	
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


