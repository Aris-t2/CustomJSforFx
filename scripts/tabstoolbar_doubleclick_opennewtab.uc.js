// 'Double click on tabs toolbar opens a new tab' script for Firefox 60+ by Aris
// Only works, if Firefox titlebar is used not OS titlebar ...
// ... Customizing mode > 'Titlebar' checkbox > unchecked

var NewTabOnDoubleClick = {
  init: function() {

	document.getElementById("TabsToolbar").addEventListener("dblclick", function openNewTabOnDoubleClick(e) {
				
	  if(e.button==0
	    && e.target.localName != "tab"
		  && e.target.localName != "toolbarbutton"
			&& e.target.localName != "arrowscrollbox"
			  && e.originalTarget.getAttribute("anonid") != "scrollbutton-up"
				&& e.originalTarget.getAttribute("anonid") != "scrollbutton-down"
				  && e.originalTarget.getAttribute("anonid") != "close-button")
	  {

		BrowserOpenTab();
		e.stopPropagation();
		e.preventDefault();

	  }

	}, false);

  }

}

setTimeout(function(){
  NewTabOnDoubleClick.init();
},500);
