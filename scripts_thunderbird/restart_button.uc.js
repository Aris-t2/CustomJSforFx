// Restart button script for Thunderbird 68+ by Aris
//
// left-click on restart button: normal restart
// middle-click on restart button: restart + clear caches
// right-click on restart button: no special function
//
// WIP
// - currently only works on main windows main toolbar (not on tabs and menu toolbar!)
// - resetting caches will temp. move button to toolbars end again
//
// This is not the best way to create a toolbar button, but the only one currently works.
// Using CustomizableUI.jsm / CustomizableUI.createWidget() does not work in Thunderbird (yet?).
// Attaching a button to toolbar palette does not work in Thunderbird.

(function() {

  var ctb_restartbutton = document.createElement("toolbarbutton");

  ctb_restartbutton.setAttribute("id", "ctb_restart");
  ctb_restartbutton.setAttribute("class", "toolbarbutton-1");
  ctb_restartbutton.setAttribute("removable", "true");
  ctb_restartbutton.setAttribute("label", "Restart");

  ctb_restartbutton.addEventListener("click", function ctb_restartbuttonClick(event) {
	if (event.button == 0) {RestartMenuFileAppItems.restartApp(false);} else if (event.button == 1) {RestartMenuFileAppItems.restartApp(true)};
  }, false);

  document.getElementById("mail-bar3").appendChild(ctb_restartbutton);

  var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
  
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	\
	#ctb_restart .toolbarbutton-icon {\
	  list-style-image: url("chrome://messenger/skin/icons/replyall.svg");  \
	  fill: red;\
	}\
	\
  '), null, null);

  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

})();
