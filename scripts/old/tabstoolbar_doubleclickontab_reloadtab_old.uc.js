// 'DoubleClickOnTabReloadTab' script for Firefox 60+ by Aris

var DoubleClickOnTabReloadTab = {
  init: function() {
	  
	try {

	 gBrowser.tabContainer.addEventListener("dblclick", function abcde(e) {
				
	  if(e.button==0
		  && e.target.localName != "toolbarbutton"
			&& e.target.localName != "arrowscrollbox"
			  && e.originalTarget.getAttribute("anonid") != "scrollbutton-up"
				&& e.originalTarget.getAttribute("anonid") != "scrollbutton-down"
				  && e.originalTarget.getAttribute("class") != "scrollbutton-up"
					&& e.originalTarget.getAttribute("class") != "scrollbutton-down"
					  && e.originalTarget.getAttribute("anonid") != "close-button")
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
