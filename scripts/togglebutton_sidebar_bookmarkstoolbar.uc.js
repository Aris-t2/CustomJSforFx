// 'Toggle Sidebar and Bookmarks toolbar' script for Firefox by Aris
// - left click toggles Sidebar
// - middle click toggle Bookmakrs toolbar
// - change "event.button=X" to "0", "1" or "2" to customize
// - 0 = leftclick, 1 = middleclick, 2 = rightclick


var ToggleSBandBT = {
  init: async function() {

	if (location != 'chrome://browser/content/browser.xhtml')
      return;
  
      try {
		Services.prefs.getDefaultBranch('browser.togglebutton_sb_bt_sbb.').setBoolPref('enabled',false);
		setToolbarVisibility(document.getElementById('sidebar-box'), Services.prefs.getBranch('browser.togglebutton_sb_bt_sbb.').getBoolPref('enabled'));
	  } catch(e) {}

   try {
	CustomizableUI.createWidget({
	  id: 'togglebutton_sb_bt', // button id
	  defaultArea: CustomizableUI.AREA_NAVBAR,
	  removable: true,
	  label: 'ToggleSB_BB',
	  tooltiptext: 'ToggleSB_BB',
	
	  onClick: function(event) {
		  
		var windows = Services.wm.getEnumerator(null);
		var tb_sb_bt_SideBar = null;
		while (windows.hasMoreElements()) {
		  var win = windows.getNext();
			  				  
		  if(event.button==0) { // 0 = leftclick, 1 = middleclick, 2 = rightclick
			tb_sb_bt_SideBar = win.document.getElementById('sidebar-box');
			  setToolbarVisibility(tb_sb_bt_SideBar, tb_sb_bt_SideBar.collapsed);
		  }

		  if(event.button==1) {  // 0 = leftclick, 1 = middleclick, 2 = rightclick			  
			BookmarkingUI.toggleBookmarksToolbar('bookmarks-widget');
		  }
		  
		
		  Services.prefs.getBranch('browser.togglebutton_sb_bt_sbb.').setBoolPref('enabled',!tb_sb_bt_SideBar.collapsed);
		
		
		  if(!tb_sb_bt_SideBar.collapsed)
		    win.document.querySelector('#togglebutton_sb_bt').setAttribute('checked','true');
		  else win.document.querySelector('#togglebutton_sb_bt').removeAttribute('checked');
		
		}
						  
	  },
	  onCreated: function(button) {
		if(Services.prefs.getBranch('browser.togglebutton_sb_bt_sbb.').getBoolPref('enabled'))
		  button.setAttribute('checked','true');
	  
	    return button;

	  }

	});
   } catch(e) {}

	Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService)
	  .loadAndRegisterSheet(Services.io.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(`
		#togglebutton_sb_bt .toolbarbutton-icon {
		  list-style-image: url('chrome://browser/skin/sidebars.svg');
		}
	  `), null, null), Components.classes['@mozilla.org/content/style-sheet-service;1']
	.getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET);
  }
}

/* initialization delay workaround */
document.addEventListener('DOMContentLoaded', ToggleSBandBT.init(), false);