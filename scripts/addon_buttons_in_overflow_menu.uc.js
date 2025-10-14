/* 'Add-on buttons in overflow menu' script for Firefox 14X+ by Aris

  At least one default toolbar button has to be inside overflow menu for it to show up on navigation toolbar.
  Pin buttons to toolbar or move buttons to overflow menu using 'right-click' context menus 'Pin to Toolbar'.
  Unified extension button gets hidden and moved to toolbars end for extension popups to appear there.
  
  [!] Experimental: code might...
  ... work on multiple windows (Fx 113 Nightly)
  ... work on first window only (Fx 111 release)
  ... not work at all (Fx 112 Beta)
*/


(function() {

  const hideButton = false;

  function watchElementInjection(id, callback) {
    const source = document.getElementById(id);
    if (source && source.parentNode && document.contains(source)) {
      callback(source);
      return;
    }
    const listener = {
      onWidgetAfterDOMChange(changedNode, nextNode, container) {
        const source = document.getElementById(id);
        if (source && source.parentNode && document.contains(source)) {
          callback(source);
          CustomizableUI.removeListener(listener);
        }
      }
    };
    CustomizableUI.addListener(listener);
  }

  function moveUnifiedExtensions(source) {
    const target = document.getElementById("widget-overflow-fixed-list");
    if (target && source && source.parentNode !== target) {
      target.appendChild(document.createXULElement("toolbarseparator"));
      target.appendChild(source);
    }
  }

  function injectCSS() {
    let css = `
      #unified-extensions-area {
        .unified-extensions-item-contents,
        toolbarbutton + toolbarbutton.subviewbutton {
          display: none !important;
        }
        toolbarbutton {
          .toolbarbutton-text {
            display: flex !important;
            padding-inline-start: 0.5em !important;
          }
          .toolbarbutton-icon {
            width: 16px !important;
            height: 16px !important;
          }
          .toolbarbutton-badge-stack {
            margin: 0px !important;
          }
        }
      }
    `;

    if (hideButton) {
      css += `
        #unified-extensions-button {
          position: absolute !important;
          right: 0 !important;
          opacity: 0 !important;
          z-index: -1000 !important;
        }
      `;
    }

    const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    const uri = Services.io.newURI("data:text/css;charset=UTF-8," + encodeURIComponent(css));
    if (!sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
      sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    }
  }

  function init() {
    injectCSS();
    watchElementInjection("unified-extensions-area", moveUnifiedExtensions);

    if (!gUnifiedExtensions._panel) {
      gUnifiedExtensions.panel; // Force creation of #unified-extensions-area in new windows
    }
  }

  if (gBrowserInit.delayedStartupFinished) {
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
