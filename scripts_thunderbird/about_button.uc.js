// 'about:'-Button script for Thunderbird 68+ by Aris
//
// Need a different 'about' page button?
// - replace 'about:config' url with a different 'about:' url
// - replace button id
// - replace icon / icon url / icon color
//
// WIP
// - currently only works on main windows main toolbar (not on tabs and menu toolbar!)
// - resetting caches will temp. move button to toolbars end again
//
// This is not the best way to create a toolbar button, but the only one currently works.
// Using CustomizableUI.jsm / CustomizableUI.createWidget() does not work in Thunderbird (yet?).
// Attaching a button to toolbar palette does not work in Thunderbird.

(function() {

  var ctb_aboutbutton = document.createElement("toolbarbutton");

  ctb_aboutbutton.setAttribute("id", "ctb_about");
  ctb_aboutbutton.setAttribute("class", "toolbarbutton-1");
  ctb_aboutbutton.setAttribute("removable", "true");
  ctb_aboutbutton.setAttribute("label", "About");
  
  ctb_aboutbutton.addEventListener("click", function ctb_aboutbuttonClick(event) {
	if (event.button == 0) {
		let url = 'about:config';
		let tabmail = document.getElementById("tabmail");
		tabmail.openTab("contentTab", {contentPage: url});
	}
  }, false);

  document.getElementById("mail-bar3").appendChild(ctb_aboutbutton);

  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	#ctb_about .toolbarbutton-icon {\
	  list-style-image: url("chrome://messenger/skin/icons/file-item.svg");  \
	  fill: blue;\
	}\
	\
  '), null, null);

  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

})();
