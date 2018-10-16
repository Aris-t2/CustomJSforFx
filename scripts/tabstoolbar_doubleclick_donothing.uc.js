// 'Do nothing on double click on tabs toolbar' script for Firefox 60+ by Aris

var CatchDoubleClick = {
  init: function() {

	document.getElementById("TabsToolbar").addEventListener("dblclick", function removeDoubleClick(e) {
				
	  if(e.button==0
	    && e.target.localName != "tab"
		  && e.target.localName != "toolbarbutton"
			&& e.target.localName != "arrowscrollbox"
			  && e.originalTarget.getAttribute("anonid") != "scrollbutton-up"
				&& e.originalTarget.getAttribute("anonid") != "scrollbutton-down"
				  && e.originalTarget.getAttribute("anonid") != "close-button")
	  {

		e.stopPropagation();
		e.preventDefault();

	  }

	}, false);

  }

}

CatchDoubleClick.init();
