// 'Tab label in urlbar' script for Firefox by Aris

(function() {
	
  try {

	var tablabelbox = document.createXULElement("hbox");
	tablabelbox.setAttribute("id","tab_label_in_urlbar_box");
	tablabelbox.setAttribute("class","urlbar-page-action");
	tablabelbox.setAttribute("role","button");

	var tablabel = document.createXULElement("label");
	tablabel.setAttribute("id","tab_label_in_urlbar");
	tablabelbox.appendChild(tablabel);
	document.getElementById("page-action-buttons").insertBefore(tablabelbox, document.getElementById("page-action-buttons").firstChild);
	//document.getElementById("urlbar-input-container").insertBefore(tablabelbox, document.getElementById("urlbar-input-container").querySelector(".urlbar-input-box").nextSibling);

	updateLabel();
  
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
	
	var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	  \
		/* hide item to interact with urlbar, if focused, open and on hover */ \
		#urlbar:is([focused="true"],[breakout-extend],:hover) #tab_label_in_urlbar_box {\
		  visibility: collapse !important; \
		}\
		\
		#tab_label_in_urlbar {\
		  margin-block: unset !important;\
		  margin-inline: unset !important;\
		  margin-top: -2px !important;\
		}\
	  \
	'), null, null);
  
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
  } catch(e) {}
	
}());


