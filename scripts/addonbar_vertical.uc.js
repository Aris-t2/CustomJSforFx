// 'Vertical Add-on Bar' script for Firefox by Aris
//
// no 'close' button
// 'toggle' toolbar with 'Ctr + Alt + /' on Windows/Linux or 'Cmd + Alt + /' on macOS
// optional toggle button hides the toolbar temporarily, it gets restored on every restart
// 'Vertical Add-on Bar' entry is only visible in toolbars context menu when in customizing mode
//
// flexible spaces on toolbar work 'vertically'
// toolbar can be on the left or on the right
// toolbar is display horizontally in customizing mode

// [!] Fix for WebExtensions with own windows by 黒仪大螃蟹 (for 1-N scripts)
	
(function() {

  // ==UserConfig==
  const addonbar_v_label = "Vertical Add-on Bar";    // toolbar name
  const button_label = "Toggle vertical Add-on Bar"; // toggle button name
  const addonbar_v_width = "30px";                   // toolbar width
  const addonbar_v_togglebutton = true;              // display toggle button for vertical toolbar (true) or not (false)
  const addonbar_v_on_the_left = true;               // display vertical toolbar on the left (true) or the right (false)
  const style_addonbar_v = true;                     // apply default toolbar appearance/colors to vertical add-on bar
  const theme_support = true;                        // better Firefox native theme support
  const compact_buttons = false;                     // compact button size (true) or default button size (false)
  // ==UserConfig==

  function init() {
	if (location != "chrome://browser/content/browser.xhtml") return;

	try {
	  let bar = document.getElementById("addonbar_v");
	  if (!bar) {
		const tb_addonbarv = document.createXULElement("toolbar");
		[
		  ["id", "addonbar_v"],
		  ["customizable", "true"],
		  ["class", "toolbar-primary chromeclass-toolbar browser-toolbar customization-target"],
		  ["mode", "icons"],
		  ["iconsize", "small"],
		  ["toolboxid", "navigator-toolbox"],
		  ["orient", "vertical"],
		  ["flex", "1"],
		  ["context", "toolbar-context-menu"],
		  ["toolbarname", addonbar_v_label],
		  ["label", addonbar_v_label],
		  ["lockiconsize", "true"],
		  ["defaultset", "spring"],
		  ["accesskey", ""]
		].forEach(([name, value]) => tb_addonbarv.setAttribute(name, value));

		const browser = document.getElementById("browser");
		addonbar_v_on_the_left
		  ? browser.insertBefore(tb_addonbarv, browser.firstChild)
		  : browser.appendChild(tb_addonbarv);

		bar = tb_addonbarv;

		// Register
		CustomizableUI.registerArea("addonbar_v", { legacy: true });
		CustomizableUI.registerToolbarNode(tb_addonbarv);

		const prefs = Services.prefs.getBranch("browser.vaddonbar.");
		// Restore state from prefs
		// Apply after register to prevent silent fail when it's in collapsed state
	    try {
	  	  Services.prefs.getDefaultBranch("browser.vaddonbar.").setBoolPref("enabled", true);
		  const enabled = prefs.getBoolPref("enabled");
		  bar.collapsed = !enabled;
	    } catch(e) {}

		// Detect theme change and apply necessary classes for theme support + Apply vertical background
		if (theme_support) {
		  const bgBox = document.createXULElement("vbox");
		  bar.classList.add("experimental");
		  bgBox.id = "addonbar_v_bg";
		  bar.appendChild(bgBox);
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

		// Movable toggle button
	    if (addonbar_v_togglebutton && !CustomizableUI.getWidget("togglebutton_addonbar_v")) {
	  	  CustomizableUI.createWidget({
	  	    id: "togglebutton_addonbar_v", // button id
	  	    defaultArea: CustomizableUI.AREA_NAVBAR,
	  	    removable: true,
	  	    label: button_label, // button title
	  	    tooltiptext: button_label, // tooltip title
			onClick(event) {
			  if (event.button == 0 || event.button == 1) {
				for (let win of Services.wm.getEnumerator("navigator:browser")) {
				  const bar = win.document.getElementById("addonbar_v");
				  const state = bar.collapsed = !bar.collapsed;
				  prefs.setBoolPref("enabled", !state);
				  win.document.querySelector("#togglebutton_addonbar_v")?.toggleAttribute("checked", !state);
				}
			  }
			},
			onCreated(button) {
			  if (prefs.getBoolPref("enabled")) button.setAttribute("checked", "true");
			  return button;
			}
	  	  });
	    }

	    // Toggle bar hotkey
		const key = document.createXULElement("key");
		key.id = "key_toggleVAddonBar";
		key.setAttribute("key", "/");
		key.setAttribute("modifiers", "accel,alt");
		key.addEventListener("command", () => {
		  for (let win of Services.wm.getEnumerator("navigator:browser")) {
			const bar = win.document.getElementById("addonbar_v");
			const state = bar.collapsed = !bar.collapsed;
			prefs.setBoolPref("enabled", !state);
			win.document.querySelector("#togglebutton_addonbar_v")?.toggleAttribute("checked", !state);
		  }
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
		  bar.setAttribute("orient", "horizontal");
		  document.getElementById("navigator-toolbox").appendChild(bar);
		  bar.collapsed = false;
		});
		document.addEventListener("aftercustomization", () => {
		  bar.setAttribute("orient", "vertical");
		  addonbar_v_on_the_left
			? browser.insertBefore(bar, browser.firstChild)
			: browser.appendChild(bar);
		  bar.collapsed = !prefs.getBoolPref("enabled", true);
		  bar.appendChild(document.getElementById("addonbar_v_bg")); // Make sure bg is always at the very end
		});
	  }
	  // Ignore download-button's autohide `browser.download.autohideButton` preference
	  if (!Services.prefs.getBranch("browser.download.").getBoolPref("autohideButton"))
		document.getElementById("downloads-button")?.removeAttribute("hidden");

	} catch(e) {}
	
	
	// Style toolbar
	let css = `
	  #main-window:not([customizing]) #addonbar_v:not([collapsed="true"]) {
	  	width: ${addonbar_v_width};
	  	min-width: ${addonbar_v_width};
	  	max-width: ${addonbar_v_width};
	  }
	  #main-window[customizing] #addonbar_v {
	  	outline: 1px dashed !important;
	  	outline-offset: -2px !important;
		overflow: hidden !important;
		height: 28px !important;
		min-height: 28px !important;
		max-height: 28px !important;
	  }
	`;

	if (style_addonbar_v) {
	  css += `
		${addonbar_v_on_the_left
		  ? "#addonbar_v { border-inline-end: 1px solid var(--sidebar-border-color, rgba(0,0,0,0.1)) !important; }"
		  : "#addonbar_v { border-inline-start: 1px solid var(--sidebar-border-color, rgba(0,0,0,0.1)) !important; }"
		}
	    #addonbar_v {
	  	  appearance: none !important;
	  	  background-color: var(--toolbar-bgcolor);
	  	  background-image: var(--toolbar-bgimage);
	  	  background-clip: padding-box;
	  	  color: var(--toolbar-color, inherit);
	    }

	    #main-window[chromehidden="menubar toolbar location directories status extrachrome "] #addonbar_v:not([collapsed="true"]),
	    #main-window[sizemode="fullscreen"] #addonbar_v:not([collapsed="true"]) {
	  	  min-width: 0px;
	  	  width: 0px;
	  	  max-width: 0px;
	    }
	    #addonbar_v toolbarbutton,
	    #addonbar_v toolbar .toolbarbutton-1 {
	  	  padding: 0 !important;
	    }
	    #unified-extensions-button[hidden] {
	  	  visibility: visible !important;
	  	  display: flex !important;
	    }
	    #addonbar_v toolbaritem separator {
	  	  display: none !important;
	    }
	    #main-window:not([customizing]) #addonbar_v > toolbaritem {
	  	  writing-mode: vertical-rl !important;
	  	  text-orientation: mixed !important;
	  	  transform: rotate(0deg) !important;
	    }
	    #main-window:not([customizing]) #addonbar_v > toolbaritem menupopup {
	  	  max-height: 170px !important;
	  	  max-width: 170px !important;
	  	  transform: rotate(-90deg) !important;
	    }
	    #main-window:not([customizing]) #addonbar_v > toolbaritem .toolbarbutton-badge {
	  	  transform: rotate(-90deg) !important;
	  	  position: absolute !important;
	  	  padding: 1px 2px !important;
	  	  top: -4px !important;
	    }
	    #main-window:not([customizing]) #addonbar_v #search-container,
	    #main-window:not([customizing]) #addonbar_v #wrapper-search-container {
	  	  flex: unset !important;
	    }
	    #main-window:not([customizing]) #addonbar_v #search-container {
	  	  min-width: unset !important;
	  	  width: unset !important;
	  	  height: 100px !important;
	  
	  	  &[width] {
	  	    flex: unset !important;
	  	  }
	    }
	    #main-window:not([customizing]) #addonbar_v #zoom-reset-button > .toolbarbutton-text {
	  	  min-width: unset !important;
	  	  min-height: unset !important;
	    }
	    #main-window:not([customizing]) #addonbar_v #zoom-reset-button:not([label]) {
	  	  display: none !important;
	    }
	    #main-window:not([customizing]) #addonbar_v .toolbarbutton-combined-buttons-dropmarker > .toolbarbutton-icon {
	  	  width: unset !important;
	  	  height: 16px !important;
	    }
		#main-window:not([customizing]) #addonbar_v:not([collapsed="true"], .header, .additional) {
		  &::before, &::after {
			content: "";
			width: ${addonbar_v_width};
			height: 1px;
			/*background: rgb(from var(--toolbar-bgcolor) r g b / 1);*/
			/*background: var(--lwt-header-image, var(--lwt-additional-images), rgb(from var(--toolbar-bgcolor) r g b / 1)) !important;*/
			background: rgb(from var(--toolbar-bgcolor) r g b / 1);
			position: absolute;
			opacity: 1;
		  }
		  &::before { top: -1px; }
		  &::after  { bottom: -1px;}
		}
		#addonbar_v.experimental {
		  overflow: hidden !important;
		}
		#addonbar_v.experimental > *:not(#addonbar_v_bg) {
		  z-index: 1 !important;
		}
		#addonbar_v.experimental #addonbar_v_bg {
		  position: relative !important;
		}
		/* rotate the background image in a vertical toolbar */
		#addonbar_v.experimental #addonbar_v_bg::before {
		  content: "" ;
		  position: absolute;
		  top: 0;
		  left: 0;
		  /* the horizontal length becomes the vertical span once rotated */
		  width: 100vw !important; 
		  height: ${addonbar_v_width} !important; 
		  background: var(--lwt-header-image, var(--lwt-additional-images), rgb(from var(--toolbar-bgcolor) r g b / 1)) !important;
		  background-repeat: no-repeat !important;
		  background-position: right top !important;
		  background-size: cover !important;
		  transform: rotate(90deg) translate(-100%, 0) !important;
		  transform-origin: bottom left !important;
		  z-index: 0 !important;
		  display: block !important;
		}
		#main-window[customizing] #addonbar_v.experimental #addonbar_v_bg::before {
		  display: none !important;
		}
		#addonbar_v.experimental.header #addonbar_v_bg::before {
		  background-size: auto !important;
		}
		#addonbar_v.experimental.additional #addonbar_v_bg::before {
		  background-size: cover !important;
		}
	  `;
	}

	// Toggle button styling
	if (addonbar_v_togglebutton) {
	  css += `
		#togglebutton_addonbar_v .toolbarbutton-icon {
		  list-style-image: url("chrome://browser/skin/sidebars.svg");
		  fill: var(--toolbarbutton-icon-fill);
		}
	  `;
	}

	// Compact button styling
	if (compact_buttons) {
	  css += `
		#addonbar_v toolbarbutton .toolbarbutton-icon {
		  padding: 0 !important;
		  width: 16px !important;
		  height: 16px !important;
		}
		#addonbar_v .toolbarbutton-badge-stack {
		  padding: 0 !important;
		  margin: 0 !important;
		  width: 16px !important;
		  min-width: 16px !important;
		  height: 16px !important;
		  min-height: 16px !important;
		}
		#addonbar_v toolbarbutton .toolbarbutton-badge {
		  margin-top: 0px !important;
		  font-size: 8px !important;
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
  if (location == "chrome://browser/content/browser.xhtml") {
	document.addEventListener("DOMContentLoaded", () => init(), { once: true });
  }
  /* Alternative delays */
  // Promise.resolve().then(() => init());
  // or
  // setTimeout(() => init(), 2000);

})();