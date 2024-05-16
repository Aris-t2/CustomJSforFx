// 'Middle click on tab opens a new tab' script for Firefox 126+ by Aris


var NewTabOnMiddleClickonTab = {
  init: function() {
	  
	try {

 
      gBrowser.tabContainer.addEventListener('click', function abc(e) {
		  if(e.button==1
			&& e.target.localName == "tab")
		  {
			
			e.stopPropagation();
			e.preventDefault();
			
			BrowserCommands.openTab();

		  }
	  }, true);
    
	
	} catch(e) {}

  }

}

setTimeout(function(){
  NewTabOnMiddleClickonTab.init();
},500);
