// Movable urlbar script for Firefox 60+ by Aris

var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var {CustomizableUI} = Components.utils.import("resource:///modules/CustomizableUI.jsm", {});

var MovableUrlbar = {
  init: function() {

	try {
	  document.getElementById('urlbar-container').setAttribute('removable','true');
	} catch(e){}

	try {
	  if(!document.getElementById('urlbar-container').getAttribute('cui-areatype'))
		document.getElementById('urlbar-container').setAttribute('cui-areatype','toolbar');
	} catch(e){}
	
  	var observer = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
		try {
		  if(!document.getElementById('urlbar-container').getAttribute('cui-areatype')) {
			CustomizableUI.addWidgetToArea("urlbar-container", CustomizableUI.AREA_NAVBAR);
		  } else if (document.getElementById('urlbar-container').getAttribute('cui-areatype')=="menu-panel") {
			CustomizableUI.addWidgetToArea("urlbar-container", CustomizableUI.AREA_NAVBAR);
		  }
		} catch(e){}
	  });    
	});
	
	try {
	  observer.observe(document.getElementById('urlbar-container'), { attributes: true, attributeFilter: ['cui-areatype'] });
	} catch(e){}

  }

}

MovableUrlbar.init();
