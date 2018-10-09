// Restart item script for Firefox 60+ by Aris
//
// left-click on restart item: normal restart
// middle-click on restart item: restart + clear caches
// right-click on restart item: no special function
//
// based on 'addRestartButton.uc.js' script by Alice0775
// restart code from Classic Theme Restorer add-on
// invalidate caches from Session Saver add-on

var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});

var RestartMenuFileAppItems = {
  init: function() {

	var button_label = "Restart";
	
	try {
	  switch (document.getElementById("nav-bar").getAttribute("aria-label")) {
		case "Navigations-Symbolleiste": button_label = "Neustarten"; break;
		case "Панель навигации": button_label = "Перезапустить"; break;
	  }
	} catch(e) {}

	try {
	  restartitem_filemenu = document.createXULElement("menuitem");
	  restartitem_filemenu.setAttribute("label", button_label);
	  restartitem_filemenu.setAttribute("id","fileMenu-restart-item");
	  restartitem_filemenu.setAttribute("key", "R");
	  restartitem_filemenu.setAttribute("insertbefore", "menu_FileQuitItem");
	  restartitem_filemenu.setAttribute("onclick", "if (event.button == 0) {RestartMenuFileAppItems.restartApp(false);} else if (event.button == 1) {RestartMenuFileAppItems.restartApp(true)};");
	  restartitem_filemenu.setAttribute("oncommand", "RestartMenuFileAppItems.restartApp(false);");

	  if(document.getElementById("menu_FileQuitItem").previousSibling.id != "fileMenu-restart-item" )
		document.getElementById("menu_FileQuitItem").parentNode.insertBefore(restartitem_filemenu,document.getElementById("menu_FileQuitItem"));
	} catch(e) {}

	try {
	  restartitem_appmenu = document.createXULElement("toolbarbutton");
	  restartitem_appmenu.setAttribute("label", button_label);
	  restartitem_appmenu.setAttribute("id","appMenu-restart-button");
	  restartitem_appmenu.setAttribute("class","subviewbutton subviewbutton-iconic");
	  restartitem_appmenu.setAttribute("key", "R");
	  restartitem_appmenu.setAttribute("insertbefore", "appMenu-quit-button");
	  restartitem_appmenu.setAttribute("onclick", "if (event.button == 0) {RestartMenuFileAppItems.restartApp(false);} else if (event.button == 1) {RestartMenuFileAppItems.restartApp(true)};");
	  restartitem_appmenu.setAttribute("oncommand", "RestartMenuFileAppItems.restartApp(false);");

	  if(document.getElementById("appMenu-quit-button").previousSibling.id != "appMenu-restart-button" )
		document.getElementById("appMenu-quit-button").parentNode.insertBefore(restartitem_appmenu,document.getElementById("appMenu-quit-button"));
	} catch(e) {}

	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	// style button icon
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
	  #appMenu-restart-button {\
		list-style-image: url("chrome://browser/skin/reload.svg"); /* icon / path to icon */ \
	  }\
	  #appMenu-restart-button .toolbarbutton-icon {\
		transform: scaleX(-1); /* icon mirroring */\
		color: red; /* icon color name/code */\
	  }\
	  \
	'), null, null);

	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	
  },

  restartApp: function(clearcaches) {

	var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
	var observerSvc = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);

	if(clearcaches) {
	  Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
	}

	observerSvc.notifyObservers(cancelQuit, "quit-application-requested", "restart");

	if(cancelQuit.data) return false;

	Services.startup.quit(Services.startup.eRestart | Services.startup.eAttemptQuit);

  }

}

RestartMenuFileAppItems.init();
