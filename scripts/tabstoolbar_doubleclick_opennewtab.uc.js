// 'Double click on tabs toolbar opens a new tab' script for Firefox 91+ by Aris
// Script is only for Firefox titlebar not OS titlebar:
// Customizing mode > 'Titlebar' checkbox > unchecked


var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});

var NewTabOnDoubleClick = {
  init: function() {
	  
	try {

	 document.getElementById("tabbrowser-arrowscrollbox").addEventListener("dblclick", function openNewTabOnDoubleClick(e) {
				
	  if(e.button==0 && e.target.localName == "arrowscrollbox")
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
