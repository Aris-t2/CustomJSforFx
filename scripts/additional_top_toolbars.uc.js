// 'Additional top toolbars' script for Firefox 60+ by Aris
// - "number_of_additional_top_toolbars": set the amount of additional top toolbar
// - "tb_label": set a toolbar name
// - use toolbar[id^="additional_top_toolbar"] {...} to affect all toolbars at once in CSS

var AdditionalTopToolbars = {
  init: function() {
	  
	var number_of_additional_top_toolbars = 1;
	var tb_label = "Top Toolbar";

	try {
		
	  if(number_of_additional_top_toolbars>0) {
	
	    var i=1;

	    while(i<=number_of_additional_top_toolbars) {
		
		  var toptoolbar = document.createXULElement("toolbar");
		
		  if(i==1) {
			toptoolbar.setAttribute("id","additional_top_toolbar1");
			toptoolbar.setAttribute("toolbarname", tb_label);
			toptoolbar.setAttribute("label", tb_label);
		  }
		  else {
			toptoolbar.setAttribute("id", "additional_top_toolbar"+i+"");
			toptoolbar.setAttribute("toolbarname", tb_label+" ("+i+")");
			toptoolbar.setAttribute("toolbarname", tb_label+" ("+i+")");
		  }
		
		  toptoolbar.setAttribute("customizable","true");
		  toptoolbar.setAttribute("class","toolbar-primary chromeclass-toolbar");
		  toptoolbar.setAttribute("mode","icons");
		  toptoolbar.setAttribute("iconsize","small");
		  toptoolbar.setAttribute("toolboxid","navigator-toolbox");
		  toptoolbar.setAttribute("context","toolbar-context-menu");
		  toptoolbar.setAttribute("lockiconsize","true");
		  toptoolbar.setAttribute("defaultset","spring");
		
		  document.querySelector('#navigator-toolbox').appendChild(toptoolbar);

		  i++;
		
	    }
	  }

	  // CSS
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
		toolbar[id^="additional_top_toolbar"] { \
	      -moz-appearance: none !important; \
		  background-color: var(--toolbar-bgcolor); \
		  background-image: var(--toolbar-bgimage); \
		  background-clip: padding-box; \
		  color: var(--toolbar-color, inherit); \
		} \
	  \
	  '), null, null);

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	
	} catch(e){}	

  }

}

setTimeout(function(){
  AdditionalTopToolbars.init();
},500);
