// 'Vertical Add-on Bar' script for Firefox 60+ by Aris
//
// no 'toggle'-key feature
// no 'close' button
// no 'Vertical Add-on Bar' entry in toolbar context menu
//
// flexible spaces on toolbar work 'vertically'
// toolbar can be on the left or on the right
// toolbar is display horizontally in customizing mode


var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});

var AddonbarVertical = {
  init: function() {

	var addonbar_v_label = "Vertical Add-on Bar"; // toolbar name
	var addonbar_v_on_the_left = true; // display vertical toolbar on the left (true) or the right (false)
	var insert_before_borders = false; // may not always offer a visible change
	var style_addonbar_v = true; // apply default toolbar appearance/colors to vertical add-on bar
	
	try {
	  var toolbox_abv = document.createElement("toolbox");
	  toolbox_abv.setAttribute("orient","horizontal");
	  toolbox_abv.setAttribute("id","toolbox_abv");
	  toolbox_abv.setAttribute("insertbefore","sidebar-box");
	  
	  var tb_addonbarv = document.createElement("toolbar");
	  tb_addonbarv.setAttribute("id","addonbar_v");
	  tb_addonbarv.setAttribute("customizable","true");
	  tb_addonbarv.setAttribute("class","toolbar-primary chromeclass-toolbar");
	  tb_addonbarv.setAttribute("mode","icons");
	  tb_addonbarv.setAttribute("iconsize","small");
	  tb_addonbarv.setAttribute("toolboxid","navigator-toolbox");
	  tb_addonbarv.setAttribute("orient","vertical");
	  tb_addonbarv.setAttribute("flex","1");
	  tb_addonbarv.setAttribute("context","toolbar-context-menu");
	  tb_addonbarv.setAttribute("toolbarname", addonbar_v_label);
	  tb_addonbarv.setAttribute("label", addonbar_v_label);
	  tb_addonbarv.setAttribute("lockiconsize","true");
	  tb_addonbarv.setAttribute("defaultset","spring");

	  toolbox_abv.appendChild(tb_addonbarv);
	  
	  if(addonbar_v_on_the_left) {
	    if(insert_before_borders) document.getElementById("browser").insertBefore(toolbox_abv,document.getElementById("browser").firstChild);
	    else document.getElementById("browser").insertBefore(toolbox_abv,document.getElementById("browser").firstChild.nextSibling);
	  }
	  else {
		if(insert_before_borders) document.getElementById("browser").appendChild(toolbox_abv);
	    else document.getElementById("browser").insertBefore(toolbox_abv,document.getElementById("browser").lastChild);
	  }
	  
  	  var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		  try {
			if(document.querySelector('#main-window').getAttribute('customizing')) {
			  document.querySelector('#addonbar_v').setAttribute("orient","horizontal");
			  document.querySelector('#navigator-toolbox').appendChild(document.querySelector('#addonbar_v'));
			}
			else  {
			  document.querySelector('#addonbar_v').setAttribute("orient","vertical");
			  document.querySelector('#toolbox_abv').appendChild(document.querySelector('#addonbar_v'));

			}
		  } catch(e){}
		});    
	  });
	
	  observer.observe(document.querySelector('#main-window'), { attributes: true, attributeFilter: ['customizing'] });
	  
	} catch(e) {}

	// style toolbar
	if(style_addonbar_v) {
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
		#addonbar_v[orient="vertical"] { \
	      -moz-appearance: none !important; \
		  background-color: var(--toolbar-bgcolor); \
		  background-image: var(--toolbar-bgimage); \
		  background-clip: padding-box; \
		  color: var(--toolbar-color, inherit); \
		} \
	  \
	  '), null, null);

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	
	}
	
  }

}

AddonbarVertical.init();
