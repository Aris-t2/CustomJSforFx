// 'Doubleclick on tab reloads tab' script for Firefox 126+ by Aris

var DoubleClickOnTabReloadTab = {
  init: function() {
	  
	try {

	 gBrowser.tabContainer.addEventListener("dblclick", function abcde(e) {
				
	  if(e.button==0)
	  {

		BrowserCommands.reload();
		e.stopPropagation();
		e.preventDefault();

	  }

	 }, false);
	
	} catch(e) {}

  }

}

setTimeout(function(){
  DoubleClickOnTabReloadTab.init();
},500);
