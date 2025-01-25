/* Restart item script for Firefox 89+ by Aris

  - left-click on restart item: normal restart
  - middle-click on restart item: restart + clear caches
  - right-click on restart item: no special function
  
  - option: display restart icon in menubars 'File' menu
  - option: display restart icon in main menus popup

  - based on 'addRestartButton.uc.js' script by Alice0775
  - restart code from Classic Theme Restorer add-on
  - invalidate caches from Session Saver add-on
*/

var appversion = parseInt(Services.appinfo.version);
var menuicon = false;
var appmenuicon = false;

var RestartMenuFileAppItems = {
  init: function() {

	var button_label = "Restart";
	
	try {
	  restartitem_filemenu = document.createXULElement("menuitem");
	  if(menuicon) restartitem_filemenu.setAttribute("class","menuitem-iconic");
	  restartitem_filemenu.setAttribute("label", button_label);
	  restartitem_filemenu.setAttribute("id","fileMenu-restart-item");
	  restartitem_filemenu.setAttribute("accesskey", "R");
	  restartitem_filemenu.setAttribute("acceltext", "R");
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
	  if(appmenuicon) restartitem_appmenu.setAttribute("class","subviewbutton subviewbutton-iconic");
	    else restartitem_appmenu.setAttribute("class","subviewbutton");
	  restartitem_appmenu.setAttribute("accesskey", "R");
	  restartitem_appmenu.setAttribute("shortcut", "Alt+R");
	  restartitem_appmenu.setAttribute("insertbefore", "appMenu-quit-button2");
	  restartitem_appmenu.setAttribute("onclick", "if (event.button == 0) {RestartMenuFileAppItems.restartApp(false);} else if (event.button == 1) {RestartMenuFileAppItems.restartApp(true)};");
	  restartitem_appmenu.setAttribute("oncommand", "RestartMenuFileAppItems.restartApp(false);");  
	  
	  
	  var AMObserver = new MutationObserver(function(mutations) {
	    mutations.forEach(function(mutation) {
			if(document.querySelector("#appMenu-restart-button") == null ) document.querySelector("#appMenu-quit-button2").parentNode.insertBefore(restartitem_appmenu,document.getElementById("appMenu-quit-button2"));
	    });    
	  });

	AMObserver.observe(document.querySelector("#PanelUI-menu-button"), { attributes: true, attributeFilter: ['open'] });

	  
	} catch(e) {}

	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	
	var icon = "chrome://global/skin/icons/reload.svg";
  
	if(appversion < 92) icon = "chrome://browser/skin/reload.svg";
	
	var menu_item_code = "";
	
	if(menuicon)
	 menu_item_code ='	\
	  #fileMenu-restart-item { \
	  	 list-style-image: url("'+icon+'") !important; /* File Menu Entry */ \
	  } \
	  #fileMenu-restart-item > hbox > image.menu-iconic-icon { /* Style the menuItem */ \
		 margin-inline-start: 2px; \
		 margin-top: 2px; \
		-moz-context-properties: fill; \
		 transform: scaleX(-1); \
		 fill: red; \
	  } \
	 ';
	  
	var appmenu_item_code = "";
	  
	if(appmenuicon)
	 appmenu_item_code = '	\
	  #appMenu-restart-button { \
		list-style-image: url("'+icon+'"); /* Button in appMenu */ \
	  } \
	  #appMenu-restart-button .toolbarbutton-icon { /* Style the Button */ \
		transform: scaleX(-1); /* Icon mirroring */ \
		color: red; /* Icon color name */ \
	  } \
	  #main-window:-moz-lwtheme:-moz-lwtheme-brighttext #appMenu-restart-button .toolbarbutton-icon { \
		color: unset; /* do not color the icon in dark mode */ \
	  } \
	 ';

	// Style the icons (button/menu)
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  '+menu_item_code+'\
	  '+appmenu_item_code+'\
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
