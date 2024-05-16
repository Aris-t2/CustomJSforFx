// 'Double click on tabs toolbar opens a new tab' script for Firefox 126+ by Aris
// Script is only for Firefox titlebar not OS titlebar:
// Customizing mode > 'Titlebar' checkbox > unchecked


var NewTabOnDoubleClick = {
  init: function() {
	  
	try {

	 document.getElementById("tabbrowser-arrowscrollbox").addEventListener("dblclick", function openNewTabOnDoubleClick(e) {
				
	  if(e.button==0 && e.target.localName == "arrowscrollbox")
	  {
		BrowserCommands.openTab();
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
