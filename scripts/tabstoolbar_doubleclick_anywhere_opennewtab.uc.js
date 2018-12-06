// 'Double click anywhere on tabs toolbar, tabs or tab buttons opens a new tab' script for Firefox 60+ by Aris


var DoubleClickAnywhereOnTabsToolbar = {
  init: function() {
	  
	try {

 
      gBrowser.tabContainer.addEventListener('dblclick', function abcd(e) {
		if(e.button==0) {
			
			e.stopPropagation();
			e.preventDefault();
			
			BrowserOpenTab();

		}
	  }, true);
    
	
	} catch(e) {}

  }

}

setTimeout(function(){
  DoubleClickAnywhereOnTabsToolbar.init();
},500);
