// New Tab script for Firefox 60+ by Aris
// Adds 'New Tab' item to tab context menu
// option: menuitem label
// option: show_icon = true/false
// option: show_menuitem_on_top = true/false
// option: define own new tab url / default: 'about:newtab'

var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var appversion = parseInt(Services.appinfo.version);

var item_label = "New Tab"; // menuitem label
var show_icon = true; // icon visible (true) or hidden (false)
var show_menuitem_on_top = false; // show menuitem on top (true) or not (false)
var newtab_url = 'about:newtab'; // set own url here e.g. 'https://www.google.com'

var NewTabMenuItem = {
  init: function() {

	try {
	  if(appversion <= 62) addtab_sep = document.createElement("menuseparator");
	  else addtab_sep = document.createXULElement("menuseparator");
	  addtab_sep.setAttribute("id","newtab-menuitem_sep");
	  document.getElementById("tabContextMenu").appendChild(addtab_sep);
	} catch(e) {}

	try {
	  if(appversion <= 62) addtab_item = document.createElement("menuitem");
	  else addtab_item = document.createXULElement("menuitem");
	  addtab_item.setAttribute("label", item_label);
	  addtab_item.setAttribute("id","newtab-menuitem");
	  addtab_item.setAttribute("class","menuitem-iconic");
	  addtab_item.setAttribute("key", "T");
	  addtab_item.setAttribute("oncommand", "NewTabMenuItem.newTab();");
	  document.getElementById("tabContextMenu").appendChild(addtab_item);
	} catch(e) {}
	
	
	var show_icon_code='';
	var show_menuitem_on_top_code='';
	
	if(show_icon)
	  show_icon_code='\
		\
		#newtab-menuitem .menu-iconic-icon {\
		  list-style-image: url("chrome://browser/skin/new-tab.svg"); /* icon / path to icon */ \
		}\
		\
	  ';
		
	if(show_menuitem_on_top)
	  show_menuitem_on_top_code='\
		\
		#newtab-menuitem {\
		  -moz-box-ordinal-group: 0 !important;\
		}\
		#newtab-menuitem_sep {\
		  display: none !important;\
		}\
		\
	 ';
	
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	// style button icon
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  '+show_menuitem_on_top_code+' \
	  '+show_icon_code+' \
	  \
	'), null, null);

	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

  },

  newTab: function() {
	  
	// adds a new tab
	// replace 'about:newtab' with a custom url, if needed
	try {
	  var mainWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
						.getService(Components.interfaces.nsIWindowMediator)
						.getMostRecentWindow("navigator:browser");
	  mainWindow.gBrowser.selectedTab = gBrowser.addTab(newtab_url, {triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
	} catch (e) {}
	
	/* focuses location bar */
	try {
	  document.getElementById('urlbar').focus();
	  document.getElementById('urlbar').select();
	} catch (e) {}

  }

}

NewTabMenuItem.init();
