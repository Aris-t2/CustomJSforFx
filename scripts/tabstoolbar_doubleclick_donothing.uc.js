// 'Do nothing on double click on tabs toolbar' script for Firefox 60+ by Aris
// Script is only for Firefox titlebar not OS titlebar:
// ... Customizing mode > 'Titlebar' checkbox > unchecked


(function() {


  setTimeout(function(){

	try {

 
      gBrowser.tabContainer.addEventListener('dblclick', function abcd(e) {
		if(e.button==0) {
			
			e.stopPropagation();
			e.preventDefault();

		}
	  }, true);
    
	
	} catch(e) {}

  },500);
	
	
})();