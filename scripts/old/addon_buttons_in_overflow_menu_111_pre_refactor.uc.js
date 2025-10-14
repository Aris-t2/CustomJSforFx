/* 'Add-on buttons in overflow menu' script for Firefox 111+ by Aris

  At least one default toolbar button has to be inside overflow menu for it to show up on navigation toolbar.
  Pin buttons to toolbar or move buttons to overflow menu using 'right-click' context menus 'Pin to Toolbar'.
  Unified extension button gets hidden and moved to toolbars end for extension popups to appear there.
  
  [!] Experimental: code might...
  ... work on multiple windows (Fx 113 Nightly)
  ... work on first window only (Fx 111 release)
  ... not work at all (Fx 112 Beta)
*/


(function() {

	try {
	  document.getElementById("widget-overflow-fixed-list").appendChild(document.getElementById("unified-extensions-area"));
	} catch (e) {}
	
  
	// style sheet
	Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).loadAndRegisterSheet(
	  Services.io.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(`
		  #unified-extensions-area .unified-extensions-item-contents, 
		  #unified-extensions-area toolbarbutton + toolbarbutton.subviewbutton {
			display: none !important;
		  }
		  #unified-extensions-area toolbarbutton .toolbarbutton-text {
			display: flex !important;
		  }
		  #unified-extensions-area .toolbarbutton-icon {
			width: 16px !important;
			height: 16px !important;
		  }
		  #unified-extensions-button {
			position: absolute !important;
			right: 0 !important;
			opacity: 0 !important;
			z-index: -1000 !important;
		  }
	  `), null, null),
	  Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET
	);

}());
