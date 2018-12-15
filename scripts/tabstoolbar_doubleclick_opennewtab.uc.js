// 'Double click on tabs toolbar opens a new tab' script for Firefox 60+ by Aris
// Script is only for Firefox titlebar not OS titlebar:
// Customizing mode > 'Titlebar' checkbox > unchecked


var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});

var NewTabOnDoubleClick = {
  init: function() {
	  
	try {

	 document.getElementById("TabsToolbar").addEventListener("dblclick", function openNewTabOnDoubleClick(e) {
				
	  if(e.button==0 && Services.prefs.getBranch("browser.tabs.").getBoolPref("drawInTitlebar")
	    && e.target.localName != "tab"
		  && e.target.localName != "toolbarbutton"
			&& e.target.localName != "arrowscrollbox"
			  && e.originalTarget.getAttribute("anonid") != "scrollbutton-up"
				&& e.originalTarget.getAttribute("anonid") != "scrollbutton-down"
				  && e.originalTarget.getAttribute("class") != "scrollbutton-up"
					&& e.originalTarget.getAttribute("class") != "scrollbutton-down"
					  && e.originalTarget.getAttribute("anonid") != "close-button")
	  {

		BrowserOpenTab();
		e.stopPropagation();
		e.preventDefault();

	  }

	 }, false);
	
	} catch(e) {}

  }

}

setTimeout(function(){
  NewTabOnDoubleClick.init();
},500);
