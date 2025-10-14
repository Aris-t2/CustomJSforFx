// 'Favicon in urlbars identity box' script for Firefox 14X+ by Aris
//
// This script restores current pages favicon inside urlbar (aka location bar, address bar or awesome bar).
// [!] If a page does not offer a favicon, browser default branch icon is shown.
// [!] In a multi-window environment pages without favicons might show wrong icons.
// option: set icon for pages without favicon

(function() {

  // ==UserConfig==
  const spinner = "chrome://newtab/content/data/content/assets/spinner.svg";
  const globe   = "chrome://userchrome3/content/defaultFavicon.svg";
  const sheet   = "chrome://global/skin/icons/Portrait.png";
  const brand   = "chrome://branding/content/icon32.png";
  const i_icon  = "chrome://global/skin/icons/info.svg";

  const icon_for_pages_without_favicon = brand;      // i_icon, sheet, globe or brand (colorized Fx channel icon)
  const favicon_click_opens_page_info_window = true; // opens page info window on LMB click
  const page_info_default_tab = "mediaTab";          // "generalTab" "mediaTab" "permTab" "securityTab"
  const favicon_right_click_clear_page_data = true;  // prompt 'clear cookies/site data' on RMB click
  const favicon_spinner_during_loading = true;       // Use spinner icon while tab is loading
  const add_origin_attribute = false;                // Add data-origin attribute with resolved site origin or extension ID
  // ==UserConfig==

  function init() {
	try {
	  // Create favicon element in the urlbar
	  const favimginurlbar = document.createXULElement("image");
	  favimginurlbar.id = "favimginurlbar";
	  favimginurlbar.style.cssText = `
		-moz-context-properties: fill;
		align-self: center;
		width: 16px;
		height: 16px;
		margin: auto 3px;
	  `;
	  document.getElementById("identity-box").appendChild(favimginurlbar);

	  // Clear cookies/site data for current page
	  async function clearSiteDataForCurrentPage() {
		const uri = gBrowser.currentURI;
		const base = uri?.host && SiteDataManager.getBaseDomainFromHost(uri.host);
		if (base && SiteDataManager.promptSiteDataRemoval(window, [base])) {
		  await SiteDataManager.remove(base);
		}
	  }

	  // data-origin attribute
	  function resolveOriginForCurrentTab() {
		const uri = gBrowser?.currentURI;
		if (!uri) return "";
	
		const scheme = uri.scheme;
		if (!["about", "http", "https", "moz-extension"].includes(scheme)) return "";

		const value = scheme === "about" ? uri.spec : uri.host;
		const uuidMap = JSON.parse(Services.prefs.getStringPref("extensions.webextensions.uuids", "{}"));
		return scheme === "moz-extension"
		  ? Object.entries(uuidMap).find(([id, uuid]) => uuid === value)?.[0] || ""
		  : value;
	  }
	
	  function updateIcon() {
		  const tab = gBrowser.selectedTab;
		  const isBusy = tab.hasAttribute("busy");
		  const favicon = tab.image || icon_for_pages_without_favicon || brand;

		  if (add_origin_attribute) {
			favimginurlbar.setAttribute("data-origin", resolveOriginForCurrentTab());
		  }

		  if (!favicon_spinner_during_loading) {
			// only update if favicon is different
			if (favimginurlbar.getAttribute("src") !== favicon) {
			  favimginurlbar.setAttribute("src", favicon);
			}
			return;
		  }

		  favimginurlbar.toggleAttribute("loading", isBusy);
		  favimginurlbar.setAttribute("src", isBusy ? "" : favicon);
	  }

	  if (favicon_click_opens_page_info_window || favicon_right_click_clear_page_data) {
		favimginurlbar.addEventListener("click", e => {
		  if (e.button === 0 && favicon_click_opens_page_info_window) {
			page_info_default_tab
			  ? BrowserCommands.pageInfo(null, page_info_default_tab)
			  : document.getElementById("View:PageInfo").doCommand();
		  } else if (e.button === 2 && favicon_right_click_clear_page_data) {
			e.preventDefault();
			e.stopPropagation();
			clearSiteDataForCurrentPage();
		  }
		});
	  }

	  document.addEventListener("TabAttrModified", e => {
		const changed = e.detail?.changed;
		const attrsToCheck = ["image", "selected"];
		if (favicon_spinner_during_loading) {attrsToCheck.push("busy");}
		const shouldUpdate = changed?.some(attr => attrsToCheck.includes(attr));
		if (shouldUpdate && e.target === gBrowser.selectedTab) {
		  updateIcon();
		}
	  }, false);

	  // Alignment
	  let css = `
		@media -moz-pref("browser.urlbar.scotchBonnet.enableOverride") {
		  #urlbar[unifiedsearchbutton-available] #identity-box > :not(#favimginurlbar) {
			display: none !important;
		  }
		  #urlbar[unifiedsearchbutton-available] {
			#urlbar-searchmode-switcher {
			  margin-inline-end: 0px !important;
			}
			#identity-box {
			  display: inline-flex !important;
			}
			@media not -moz-pref("browser.urlbar.unifiedSearchButton.always") {
			  #urlbar-searchmode-switcher {
				padding-inline-end: 4px !important;
				margin-inline-end: 2px !important;
			  }
			  #identity-box > #favimginurlbar {
				margin-inline-start: 1px !important;
			  }
			}
		  }
		}
	  `;

	  // 'megabar_expanding_breakout_disabled.css' compatibility
	  // '#urlbar[breakout] *' blocks inline .style animation rule
	  if (favicon_spinner_during_loading) {
		css += `
		  #urlbar[breakout] #favimginurlbar[loading],
		  #favimginurlbar[loading] {
			animation: spin 0.5s linear infinite !important;
			transform-origin: center;
			background: currentColor;
			fill: currentcolor;
			opacity: 0.6;
			mask-image: url("${spinner}");
			mask-repeat: no-repeat;
			mask-size: 16px;
		  }
		  @keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		  }
		`;
	  }

	  const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	  const uri = Services.io.newURI("data:text/css;charset=UTF-8," + encodeURIComponent(css));
	  if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
		sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
	  }

	  updateIcon();

	} catch (e) {
	  console.error("Favicon error:", e);
	}
  }

  /* initialization delay workaround */
  if (location == "chrome://browser/content/browser.xhtml") {
	document.addEventListener("DOMContentLoaded", () => init(), { once: true });
  }
  /* Use the below code instead of the one above this line, if issues occur */
  // Promise.resolve().then(() => init());
  // or
  // setTimeout(() => init(), 2000);

})();
