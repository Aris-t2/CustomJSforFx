// 'Tab label in urlbar' script for Firefox by Aris

(function() {
	
  try {
  
	var tablabel = document.createXULElement("label");
	tablabel.setAttribute("id","tab_label_in_urlbar");
	tablabel.setAttribute("value",gBrowser.selectedBrowser.contentTitle);
	document.getElementById("page-action-buttons").insertBefore(tablabel, document.getElementById("page-action-buttons").firstChild);
  
	// catch cases where tab title can change
	document.addEventListener("TabAttrModified", updateLabel, false);
	document.addEventListener('TabSelect', updateLabel, false);
	document.addEventListener('TabOpen', updateLabel, false);
	document.addEventListener('TabClose', updateLabel, false);
	document.addEventListener('load', updateLabel, false);
	document.addEventListener("DOMContentLoaded", updateLabel, false);
  
	function updateLabel() {
	  tablabel.setAttribute("value",gBrowser.selectedBrowser.contentTitle);
	}
  
  } catch(e) {}
	
}());


