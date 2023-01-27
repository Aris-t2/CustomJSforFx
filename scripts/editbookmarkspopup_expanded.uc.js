// 'Expand Edit Bookmarks Popup' script for Firefox 109+ by Aris
//
// option: increase folder tree height
// option: hide preview image


var folder_tree_height = "240px"; // increase folder tree height
var hide_preview_image = false; // hide (true) or show (false) preview image
var timeout_value = 0; // milliseconds - increase value, if popup does not expand: 100 > 500 > 1000 ...


var EditBookmarkPanelTweaks = {
 init: function() {

  try {

	/* click only method */
	/*document.querySelector("#star-button").addEventListener("click", function(e){
	 if(e.button==0) setTimeout(function(){
	  if(document.querySelector("#editBMPanel_folderTreeRow").getAttribute("collapsed"))
		gEditItemOverlay.toggleFolderTreeVisibility();
	 },timeout_value);
	}, false);*/
	
	/* general method to listen to panels 'open' status */
	var BSObserver = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
		setTimeout(function(){
		  if(document.querySelector("#editBMPanel_folderTreeRow").getAttribute("hidden"))
			gEditItemOverlay.toggleFolderTreeVisibility();
		 },timeout_value);
	  });    
	});

	BSObserver.observe(document.querySelector("#star-button-box"), { attributes: true, attributeFilter: ['open'] });

	
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	
	var hide_preview_image_code ='';
	  
	if(hide_preview_image)
	   hide_preview_image_code = ' \
		#editBookmarkPanelImage, #editBookmarkPanelFaviconContainer, #editBookmarkPanel html { \
		  display: none !important; \
		} \
	  ';
	  
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		\
		#editBookmarkPanel {\
		  transition: unset !important; \
		} \
		#editBMPanel_folderTree {\
		  min-height: '+folder_tree_height+' !important; \
		} \
		'+hide_preview_image_code+' \
		\
	'), null, null);

	// remove old style sheet
	if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) sss.unregisterSheet(uri,sss.AGENT_SHEET);
	
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	
  } catch(e) {}

 }
}

document.addEventListener("DOMContentLoaded", EditBookmarkPanelTweaks.init(), false);
