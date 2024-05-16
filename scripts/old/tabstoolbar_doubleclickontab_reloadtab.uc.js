// 'Doubleclick on tab reloads tab' script for Firefox 60+ by Aris

var DoubleClickOnTabReloadTab = {
  init: function() {
	  
	try {

	 gBrowser.tabContainer.addEventListener("dblclick", function abcde(e) {
				
	  if(e.button==0)
	  {

		BrowserReload();
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
