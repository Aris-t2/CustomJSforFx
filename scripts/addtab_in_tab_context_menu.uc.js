// New Tab script for Firefox 60+ by Aris
// Adds 'New Tab' item to tab context menu

var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});

var NewTabMenuItem = {
  init: function() {

	var item_label = "New Tab";

	try {
	  addtab_sep = document.createElement("menuseparator");
	  addtab_sep.setAttribute("id","newtab-menuitem_sep");
	  document.getElementById("tabContextMenu").appendChild(addtab_sep);
	} catch(e) {}

	try {
	  addtab_item = document.createElement("menuitem");
	  addtab_item.setAttribute("label", item_label);
	  addtab_item.setAttribute("id","newtab-menuitem");
	  addtab_item.setAttribute("class","menuitem-iconic");
	  addtab_item.setAttribute("key", "T");
	  addtab_item.setAttribute("oncommand", "NewTabMenuItem.newTab();");
	  document.getElementById("tabContextMenu").appendChild(addtab_item);
	} catch(e) {}
	
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	// style button icon
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
	  #newtab-menuitem .menu-iconic-icon {\
		list-style-image: url("chrome://browser/skin/new-tab.svg"); /* icon / path to icon */ \
	  }\
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
	  mainWindow.gBrowser.selectedTab = gBrowser.addTab('about:newtab', {triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
	} catch (e) {}
	
	/* focuses location bar */
	try {
	  document.getElementById('urlbar').focus();
	  document.getElementById('urlbar').select();
	} catch (e) {}

  }

}

NewTabMenuItem.init();
