// 'about:'-Button script for Firefox by Aris
//
// Need a different 'about' page button? (can open any url)
// - replace "about:about" 'url' with any url
// - replace button 'id'
// - replace 'icon' / icon 'url' / 'icon_color'
//
// - custom icons can be placed in ".../chrome/icons/" and set by filename, e.g. "my-icon.svg" / "my-icon.png"
//
// Firefox icons available in the current release:
// https://searchfox.org/firefox-release/search?q=chrome.*.svg&path=&case=false&regexp=true

(function() {

  // ==UserConfig==
  const id = "about-button-gen";                       // button id
  const label = "About Button (generic)";              // button label and tooltip
  const url = "about:about";                           // URL to open on button press
  const open_in_window = false;                        // open URL in a window instead of a tab
  const icon = "chrome://browser/skin/window.svg";     // chrome path or filename, e.g. "my-icon.png"
  const icon_color = "red";                            // icon color: rgb(255, 0, 0), #ff0000, red
  // ==UserConfig==

  function init() {
    if (location != "chrome://browser/content/browser.xhtml") return;

    try {
      if (CustomizableUI.getWidget(id)?.provider === "api") return;

      CustomizableUI.createWidget({
        id: id,
        defaultArea: CustomizableUI.AREA_NAVBAR,
        removable: true,
        label: label,
        tooltiptext: label,

        onClick: function(event) {
          if (event.button != 0)
            return;

          try {
            const win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
              .getService(Components.interfaces.nsIWindowMediator)
              .getMostRecentWindow("navigator:browser");

            if (open_in_window)
              window.open(url, "", "width=1024,height=768,chrome");
            else
              win.gBrowser.selectedTab = win.gBrowser.addTrustedTab(url);
          } catch (e) {}
        }
      });

      const icon_uri = icon.includes("://") ? icon :
        PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir, "chrome", "icons", icon));

      const css = `
        #${id} .toolbarbutton-icon {
          list-style-image: url("${icon_uri}");
          fill: ${icon_color};
        }
      `;

      const sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
        .getService(Components.interfaces.nsIStyleSheetService);
      const uri = Services.io.newURI(
        "data:text/css;charset=utf-8," + encodeURIComponent(css)
      );

      sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    } catch (e) {
      Components.utils.reportError(e);
    }

  }

  /* initialization delay */
  if (typeof gBrowserInit !== "undefined" && gBrowserInit.delayedStartupFinished) {
    init();
  } else {
    const delayedListener = (subject, topic) => {
      if (topic === "browser-delayed-startup-finished" && subject === window) {
        Services.obs.removeObserver(delayedListener, topic);
        init();
      }
    };
    Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
  }

})();