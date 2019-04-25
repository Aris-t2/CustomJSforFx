// 'Expand Edit Bookmarks Popup' script for Firefox 60+ by Aris
//
// option: increase folder tree height
// option: hide preview image


var folder_tree_height = "220px"; // increase folder tree height
var hide_preview_image = false;


var EditBookmarkPanelTweaks = {
 init: function() {
	  
  try {
	
	document.getElementById('editBookmarkPanel').style.transition = 'unset';
	  
	if(hide_preview_image) {
	  document.getElementById('editBookmarkPanelImage').style.visibility = 'collapse';
	  document.getElementById('editBookmarkPanelFaviconContainer').style.visibility = 'collapse';
	}
		
	document.getElementById('editBMPanel_folderTree').style.minHeight = folder_tree_height;
	  
	document.getElementById('editBookmarkPanel').addEventListener("popupshown", function(){

	  gEditItemOverlay.toggleFolderTreeVisibility();
	  
	}, false);
	
  } catch(e) {}
	  
 }
}

document.addEventListener("DOMContentLoaded", EditBookmarkPanelTweaks.init(), false);
