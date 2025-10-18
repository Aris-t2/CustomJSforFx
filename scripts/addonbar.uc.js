// Add-on Bar script for Firefox 14X+ by Aris
//
// no 'close' button
// 'toggle' toolbar with 'Ctr + /' on Windows/Linux or 'Cmd + /' on macOS
// no 'Add-on Bar' entry in toolbar context menu
//
// option: smaller buttons / reduced toolbar button height
//
// flexible spaces on add-on bar behave like on old Firefox versions

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)

(function() {

  // ==UserConfig==
  const move_statuspanel_to_addonbar = false; // reposition url display (bottom left corner)
  const compact_buttons = false;              // reduced toolbar height and smaller buttons
  const theme_support = true;                 // better Firefox native theme support
  // ==UserConfig==

  function init() {
	if (location != "chrome://browser/content/browser.xhtml") return;
	// toolbar
	try {
	  let bar = document.getElementById("addonbar");
	  if (!bar) {
		const tb_addonbar = document.createXULElement("toolbar");
		[
		  ["id", "addonbar"],
		  ["collapsed", "false"],
		  ["toolbarname", "Add-on Bar"],
		  ["defaultset", "spring,spring"],
		  ["customizable", "true"],
		  ["mode", "icons"],
		  ["iconsize", "small"],
		  ["context", "toolbar-context-menu"],
		  ["lockiconsize", "true"],
		  ["class", "toolbar-primary chromeclass-toolbar browser-toolbar customization-target"]
		].forEach(([name, value]) => tb_addonbar.setAttribute(name, value));

		document.getElementById("browser").parentNode.appendChild(tb_addonbar);
		bar = tb_addonbar;

		const _appendStatusPanelDefault = gBrowser._appendStatusPanel;
		if (move_statuspanel_to_addonbar) {
		  tb_addonbar.insertBefore(document.querySelector("#statuspanel"), tb_addonbar.firstChild);
		  gBrowser._appendStatusPanel = function() { updateStatusPanel(); };
		  window.addEventListener("fullscreen", updateStatusPanel);
		}

		// Handle tab change/fullscreen toggle/bar collapsed
		function updateStatusPanel() {
		  if (!move_statuspanel_to_addonbar) return;
		  const shouldMove = bar && !bar.collapsed && !window.fullScreen;
		  (shouldMove ? bar.insertBefore(StatusPanel.panel, bar.firstChild) : _appendStatusPanelDefault.call(gBrowser));
		}

		// Register
		CustomizableUI.registerArea("addonbar", { legacy: true });
		CustomizableUI.registerToolbarNode(tb_addonbar);

		const prefs = Services.prefs.getBranch("browser.addonbar.");
		// Restore state from prefs
		// Apply after register to prevent silent fail when it's in collapsed state
		try {
		  Services.prefs.getDefaultBranch("browser.addonbar.").setBoolPref("enabled", true);
		  const enabled = prefs.getBoolPref("enabled");
		  bar.collapsed = !enabled;
		  updateStatusPanel();
		} catch(e) {}

		// Detect theme change and apply necessary classes for theme support
		if (theme_support || move_statuspanel_to_addonbar) {
		  if (theme_support) { bar.classList.add("experimental"); }
		  const updateBackgroundClass = () => {
			const cs = getComputedStyle(document.documentElement);
			const hasHeader = cs.getPropertyValue("--lwt-header-image").trim();
			const hasAdditional = cs.getPropertyValue("--lwt-additional-images").trim();
			const validHeader = hasHeader && hasHeader !== "none";
			const validAdditional = hasAdditional && hasAdditional !== "none";
			bar.classList.toggle("header", validHeader);
			bar.classList.toggle("additional", validAdditional && !validHeader);
		  };
		  updateBackgroundClass();
		  Services.prefs.addObserver("extensions.activeThemeID", {observe: updateBackgroundClass});
		}

		// Toggle bar hotkey
		const key = document.createXULElement("key");
		key.id = "key_toggleAddonBar";
		key.setAttribute("key", "/");
		key.setAttribute("modifiers", "accel");
		key.addEventListener("command", () => {
		  bar.collapsed = !bar.collapsed;
		  prefs.setBoolPref("enabled", !bar.collapsed);
		  updateStatusPanel();
		});
		document.getElementById("mainKeyset").appendChild(key);

		// Attach handlers for buttons moved outside #navigator-toolbox
		// https://searchfox.org/firefox-main/source/browser/base/content/navigator-toolbox.js
		const customHandlers = {
		  "unified-extensions-button": (el, e) => gUnifiedExtensions.togglePanel(e),
		  "fxa-toolbar-menu-button":   (el, e) => gSync.toggleAccountPanel(el, e),
		  "firefox-view-button":       (el, e) => FirefoxViewHandler.openToolbarMouseEvent(e),
		  "downloads-button":          (el, e) => DownloadsIndicatorView.onCommand(e),
		  "pageActionButton":          (el, e) => BrowserPageActions.mainButtonClicked(e),
		  "alltabs-button":            (el, e) => gTabsPanel.showAllTabsPanel(e, "alltabs-button"),
		  "library-button":            (el, e) => PanelUI.showSubView("appMenu-libraryView", el, e),
		  "import-button":             (el, e) => MigrationUtils.showMigrationWizard(window, {
			entrypoint: MigrationUtils.MIGRATION_ENTRYPOINTS.BOOKMARKS_TOOLBAR,
		  }),
		};

		bar.addEventListener("mousedown", (e) => {
		  const button = e.target.closest("toolbarbutton");
		  if (button?.id && customHandlers[button.id]) customHandlers[button.id](button, e);
		});

		// Force display during customization
		document.addEventListener("beforecustomization", () => {
		  bar.collapsed = false;
		});
		document.addEventListener("aftercustomization", () => {
		  bar.collapsed = !prefs.getBoolPref("enabled", true);
		});

	  }

	} catch(e) {}

	// stylesheet
	let css = `
	  #addonbar toolbarpaletteitem[place=toolbar][id^=wrapper-customizableui-special-spring],
	  #addonbar toolbarspring {
		-moz-box-flex: 1 !important;
		min-width: unset !important;
		width: unset !important;
		max-width: unset !important;
	  }
	  #main-window[customizing] #addonbar {
		outline: 1px dashed !important;
		outline-offset: -2px !important;
	  }
	  #addonbar {
		border-top: 1px solid var(--sidebar-border-color,rgba(0,0,0,0.1)) !important;
		background-color: var(--toolbar-bgcolor);
		background-image: var(--toolbar-bgimage);
		-moz-window-dragging: no-drag !important;
	  }
	  :root[lwtheme] #addonbar:not(.experimental) {
		background: var(--lwt-accent-color) !important;
	  }
	  :root[lwtheme][lwtheme-image="true"] #addonbar:not(.experimental) {
		background: var(--lwt-header-image) !important;
		background-position: 0vw 50vh !important;
	  }
	  :root[lwtheme] #addonbar.experimental,
	  :root[lwtheme][lwtheme-image="true"] #addonbar.experimental {
		background-image: var(--lwt-header-image, none), var(--lwt-additional-images) !important;
		background-color: rgb(from var(--toolbar-bgcolor) r g b / 1) !important;
		background-repeat: no-repeat, var(--lwt-background-tiling) !important;
		background-position: right top, var(--lwt-background-alignment) !important;
	  }
	  #unified-extensions-button[hidden]{
		visibility: visible !important;
		display: flex !important;
	  }
	  #addonbar{
		> #statuspanel{
		  translate: 24px !important;
		  max-width: 94% !important;
		  padding: 0px !important;
		  inset: unset !important;
		  align-self: center !important;
		  z-index: 100 !important;
		  /* make sure that #statuspanel's text is visible on themes that use image background */
		  > #statuspanel-label {
			background-position: right top, var(--lwt-background-alignment) !important;
			background-repeat: no-repeat, var(--lwt-background-tiling) !important;
			/*background: var(--lwt-header-image, var(--lwt-additional-images), rgb(from var(--toolbar-bgcolor) r g b / 1)) !important;*/
			background: var(--lwt-accent-color, rgb(from var(--toolbar-bgcolor) r g b / 1)) !important;
			color: var(--lwt-text-color) !important;
			border: none !important;
		  }
		  &[mirror] {
			opacity: 0 !important;
			transition: none !important;
		  }
		}
		/* Plain colored themes without images */
		&:not(.header, .additional) > #statuspanel > #statuspanel-label {
		  background: rgb(from var(--toolbar-bgcolor) r g b / 1) !important;
		}
		/* Switch between auto/cover for better background image display */
		&.experimental.header { background-size: auto !important; }
		&.experimental.additional { background-size: cover, auto !important; }
	  }
	  #addonbar {
		/* Normalize buttons */
		toolbarbutton {
		  margin: 0 !important;
		  padding: 0 3px !important;
		}
		> toolbaritem {
		  margin: 0 !important;
		  padding: 0 !important;
		}
		/* First button alignment */  
		> toolbarbutton:not(#statuspanel):first-child,
		> #statuspanel + toolbarbutton,
		> toolbaritem.unified-extensions-item:first-child toolbarbutton,
		> #statuspanel + toolbaritem.unified-extensions-item toolbarbutton {
		  padding-left: 1px !important;
		}
	  }
	`;

	// Compact button styling
	if (compact_buttons) {
	  css += `
		#addonbar toolbarbutton .toolbarbutton-icon {
		  padding: 0 !important;
		  width: 16px !important;
		  height: 16px !important;
		}
		#addonbar .toolbarbutton-badge-stack {
		  padding: 0 !important;
		  margin: 0 !important;
		  width: 16px !important;
		  min-width: 16px !important;
		  height: 16px !important;
		  min-height: 16px !important;
		}
		#addonbar toolbarbutton .toolbarbutton-badge {
		  margin-top: 0px !important;
		  font-size: 5pt !important;
		  min-width: unset !important;
		  min-height: unset !important;
		  margin-inline-start: 0px !important;
		  margin-inline-end: 0px !important;
		}
		#addonbar .toolbaritem-combined-buttons {
		  margin-inline: 0px !important;
		}
		#addonbar toolbarbutton {
		  padding: 0 !important;
		}
	  `;
	}

	const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	const uri = Services.io.newURI("data:text/css;charset=UTF-8," + encodeURIComponent(css));
	if (!sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
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

  /* Alternative delays */
  // document.addEventListener("DOMContentLoaded", () => init(), { once: true });
  // or
  // document.addEventListener('DOMContentLoaded', init(), false);
  // or
  // Promise.resolve().then(() => init());
  // or
  // setTimeout(() => init(), 2000);

})();