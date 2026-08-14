// 'Alternative search bar' script for Firefox 153+ by Aris
//
// Thanks to UndeadStar (aka BoomerangAide) for Fx 69+ improvements
// https://github.com/Aris-t2/CustomJSforFx/issues/11
//
// Thanks to samehb (aka Sameh Barakat) for Fx 68-75+ improvements
// https://github.com/Aris-t2/CustomJSforFx/issues/11
//
// Thanks to anomiex for the setIcon workaround on Fx 77+
// https://github.com/Aris-t2/CustomJSforFx/issues/33
//
// Thanks to 117649 for the Fx107+ fix
// https://github.com/Aris-t2/CustomJSforFx/pull/73
//
// Thanks to milupo for the Fx121+ workaround
// https://github.com/Aris-t2/CustomJSforFx/discussions/59#discussioncomment-7935627
//
// Thanks to Sneakpeakcss for Fx 13X+ improvements
// https://github.com/Aris-t2/CustomJSforFx/discussions/59#discussioncomment-11819554
//
// Thanks to Sneakpeakcss for Fx 137+ improvements
// https://github.com/Aris-t2/CustomJSforFx/discussions/59#discussioncomment-12707026
//
// Idea based on 'search revert' script by '2002Andreas':
// https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673&start=2010#p1099758
//
// Initial "old search" script ported from old Firefox by Aris for Classic Theme Restorer
//
//
// Feature (not optional): search button shows current search engines icon (like with "old" search)
// Feature (not optional): search buttons dropmarker is always visible (like with "old" search)
//
// Option: clear search input after search
// Option: revert to first search engine in list after search
// Option: old search engine selection popup
// Option: hide 'oneoff' search engines (engines at popups bottom)
// Option: hide placeholder text 'Search'
// Option: swap the icons of search engine button and go button
// Option: show 'add engines' '+' indicator
// Option: always display go button
// Option: select search engine by scrolling mouse wheel over searchbars button
// option: replace native search suggestions with old plain search history (independent of Firefox search suggestion settings)
// option: restore old inputbox hotkeys (ctrl+up/down | ctrl+mwheel) to cycle through search engines
// option: restore old one-off search buttons in autocomplete popup

// [!] Default browser feature: search engine can be changed inside default/modern popup by right-clicking
//     search icon and selecting 'Set As Default Search Engine' menuitem.


(function() {

  // ==UserConfig==
  const old_search_engine_selection_popup = true;       // show old search engine selection popup
  const revert_to_first_engine_after_search = false;    // revert to first engine after search
  const switch_glass_and_engine_icon = false;           // swap search engine and go button icons
  const clear_searchbar_after_search = false;           // clear input after search
  const clear_searchbar_on_doubleclick = false;         // clear input after double-clicking the input box
  const show_addengines_plus_indicator = false;         // show add engines '+' sign over button
  const custom_search_history = true;                   // replace search suggestions with old plain search history
  const custom_search_history_max_results = 50;         // maximum number of search history results
  const select_engine_with_mousewheel = false;          // select engine with mousewheel over search button
  const restore_select_hotkeys = false;                 // select engine with Ctrl+Up/Down and Ctrl+MouseWheel
  const restore_oneoff_buttons = true;                  // restore engine buttons in autocomplete popup
  const go_button_always_visible = false;               // always display magnifying glass go button
  const hide_placeholder = false;                       // hide placeholder "Search" text in inputbox
  // ==UserConfig==

  async function init() {
    if (location != "chrome://browser/content/browser.xhtml") return;

    const lazy = {};
    ChromeUtils.defineESModuleGetters(lazy, {
      SearchService: "moz-src:///toolkit/components/search/SearchService.sys.mjs",
    });
    const SS = lazy.SearchService;

    try {
      const appver = parseInt(Services.appinfo.version);
      const searchbar = document.getElementById("searchbar");
      const searchbarNew = document.getElementById("searchbar-new");
      const searchButton = searchbarNew.querySelector(".searchmode-switcher");
      const searchContainer = document.getElementById("search-container");

      // initialize engines
      searchbar.engines = await SS.getVisibleEngines();
      updateStyleSheet();

      [
        [revert_to_first_engine_after_search,    revertToFirstEngineAfterSearch],
        [old_search_engine_selection_popup,      createOldSelectionPopup],
        [clear_searchbar_on_doubleclick,         clearSearchbarOnDoubleclick],
        [clear_searchbar_after_search,           clearSearchbarAfterSearch],
        [select_engine_with_mousewheel,          selectEngineWithMousewheel],
        [switch_glass_and_engine_icon,           switchGlassAndEngineIcon],
        [restore_select_hotkeys,                 restoreCycleHotkeys],
        [restore_oneoff_buttons,                 restoreOneOffButtons],
        [custom_search_history,                  customHistoryAutocomplete],
        [hide_placeholder,                       hideSearchbarsPlaceholder],
      ].forEach(([enabled, fn]) => enabled && fn());


      function afterCustomizationHandler() {
        if (hide_placeholder)
          hideSearchbarsPlaceholder();
      }
      window.addEventListener("aftercustomization", afterCustomizationHandler, false);

      // old search selection popup
      async function createOldSelectionPopup() {
        const searchbuttonpopup = document.querySelector("#searchmode-switcher-panel-list-searchbar");
        if (!searchbuttonpopup) return;

        searchbar.engines = await SS.getVisibleEngines();

        // remove header and separator at the top of the popup
        const header = searchbuttonpopup.querySelector(".searchmode-switcher-panel-description");
        if (header) {
          const separator = header.nextElementSibling;
          if (separator?.localName === "hr" && !separator.className) {
            separator.remove();
          }
          header.remove();
        }

        // handle separator for "Add engine" entry
        function updateAddEngineSeparator() {
          const hasAddEngines = !!searchbuttonpopup.querySelector(".searchmode-switcher-addEngine");
          const separator = searchbuttonpopup.querySelector(".custom-addengine-separator");
          if (hasAddEngines && !separator) {
            const hr = document.createElement("hr");
            hr.className = "custom-addengine-separator";
            searchbuttonpopup.querySelector(".searchmode-switcher-panel-search-settings-button")?.before(hr);
          } else if (!hasAddEngines) {
            separator?.remove();
          }
        }

        // add selected=true to engine entries for CSS styling
        function updateSelected() {
          const menuitems = searchbuttonpopup.querySelectorAll(".searchmode-switcher-installed");
          menuitems.forEach((menuitem, index) => {
            if (searchbar.engines[index]?.name === searchbar.currentEngine.name) {
              menuitem.setAttribute("selected", "true");
            } else {
              menuitem.removeAttribute("selected");
            }
          });
        }
        // Firefox clears attributes when opened, so we apply them while it's being shown,
        // also keep the "Add engine" separator updated
        searchbuttonpopup.addEventListener("shown", () => {
          updateSelected()
          updateAddEngineSeparator();
        }, true);
        // watch [iconsrc] to keep selected=true attribute in sync
        searchButton._engineObserver?.disconnect();
        (searchButton._engineObserver = new MutationObserver(updateSelected))
          .observe(searchButton, { attributes: true, attributeFilter: ["iconsrc"] });

        // replace temporary searchMode selection with global search engine selection
        function patchEngineSelection() {
          const oldSetSearchMode = searchbarNew.setSearchMode;
          searchbarNew.setSearchMode = function(searchMode, ...args) {
            if (searchMode?.entry === "searchbutton" && searchMode.engineName) {
              const engine = searchbar.engines.find(e => e.name === searchMode.engineName);
              if (!engine) return; // don't set searchMode on "Add engine"
              searchbar.currentEngine = engine;
              return;
            }
            return oldSetSearchMode.apply(this, [searchMode, ...args]);
          };
        }
        patchEngineSelection();

        // let keyboard hotkeys toggle the popup on/off
        function toggleSearchPopup(e) {
          searchbuttonpopup?.open ? searchbuttonpopup.hide()
                                  : searchbuttonpopup.show(e, searchButton);
        }
        function attachPopupToggleHotkey() {
          searchbarNew?.addEventListener("keydown", (e) => {
            if ((e.key !== "ArrowDown" && e.key !== "ArrowUp") || (e.ctrlKey)) return;
            if (e.altKey || e.ctrlKey) toggleSearchPopup(e);
          }, true);
        }
        attachPopupToggleHotkey();

        // clicking on active inputbox while autocomplete is opened closes it and selects whole search query
        document.querySelector("#searchbar-new .urlbar-input-box")?.addEventListener("mousedown", () => {
          const autocompleteOpen = searchbarNew.view?.isOpen;
          const inputFocused = document.activeElement === searchbarNew.inputField;
          if (autocompleteOpen && inputFocused) {
            setTimeout(() => searchbarNew.inputField.select(), 0);
          }
          if (autocompleteOpen) searchbarNew.view.close();
        }, true);

        // Firefox logic for opening suggestions is all over the place, make it less annoying
        function suppressAutocomplete() {
          const view = searchbarNew.view;
          if (!view) return;
          const oldAutoOpen = view.autoOpen;
          view.autoOpen = function(...args) {
            const event = args[0]?.event;
            if (["mousedown", "command", "focus"].includes(event?.type)) return false;
            return oldAutoOpen.apply(this, args);
          };
          const oldStartQuery = searchbarNew.startQuery;
          searchbarNew.startQuery = function(...args) {
            const event = args[0]?.event;
            // clearing searchbar via 'x' button replaces it with empty value,
            // which for some reason triggers autocomplete popup
            if (event?.type === "input" && event.inputType === "insertReplacementText" && !this.value) {
              this.view.close();
              return;
            }
            // suppress it after engine selection
            if (event?.type === "input" && event.inputType === undefined) {
              // select whole query after selecting engine
              const inputFocused = document.activeElement === searchbarNew.inputField;
              if (inputFocused && this.value) {
                setTimeout(() => searchbarNew.inputField.select(), 0);
              }
              this.view.close();
              return;
            }
            return oldStartQuery.apply(this, args);
          };
        }
        suppressAutocomplete();

        // match popup width with #searchbar
        function syncSearchPopupWidth() {
          searchbuttonpopup.style.width = `${searchbarNew.getBoundingClientRect().width - 4}px`;
        }
        syncSearchPopupWidth();
        const popupWidthObserver = new MutationObserver(syncSearchPopupWidth);
        popupWidthObserver.observe(document.getElementById("search-container"), {
            attributes: true,
            attributeFilter: ["width"]
          });
        popupWidthObserver.observe(document.getElementById("main-window"), {
            attributes: true,
            attributeFilter: ["sizemode"]
          });
      };

      // used to observe modifications made to search engines
      // if a search engine is added/removed/moved, we need to
      // refresh the stored "searchbar.engines" state
      const requireEngineUpdate =  old_search_engine_selection_popup
                                || select_engine_with_mousewheel
                                || revert_to_first_engine_after_search
                                || restore_oneoff_buttons;
      if (requireEngineUpdate) {
        const engineObserver = (subject, topic, data) => {
          if (data === "engine-added" || data === "engine-removed" || data === "engine-changed" || data === "engine-icon-changed") {
            SS.getVisibleEngines().then(engines => {
              searchbar.engines = engines;
              if (restore_oneoff_buttons) restoreOneOffButtons();
            });
          }
        };
        Services.obs.addObserver(engineObserver, "browser-search-engine-modified");
      }

      // hide placeholder
      function hideSearchbarsPlaceholder() {
        document.querySelector("#search-container .urlbar-input")?.removeAttribute("placeholder");
      };

      function cycleEngine(direction) {
        const engines = searchbar.engines;
        if (!engines.length) return;
        if (searchbarNew.searchMode) searchbarNew.searchMode = null;
        const currentIndex = engines.findIndex(e => e.name === searchbar.currentEngine.name);
        searchbar.currentEngine = engines[(currentIndex + direction + engines.length) % engines.length];
        searchbarNew.select();
      }
      // select search engine with ctrl+up/down or ctrl+mwheel over inputbox
      function restoreCycleHotkeys() {
        searchbarNew?.addEventListener("keydown", (event) => {
          if (!event.ctrlKey) return;
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
          event.preventDefault();
          event.stopPropagation();
          cycleEngine(event.key === "ArrowUp" ? -1 : 1);
        }, true);

        searchbarNew?.addEventListener("DOMMouseScroll", (event) => {
          if (!event.ctrlKey || event.detail === 0) return;
          event.preventDefault();
          event.stopPropagation();
          cycleEngine(event.detail > 0 ? 1 : -1);
        }, true);
      }
      // select search engine by scrolling mousewheel over searchbars button
      function selectEngineWithMousewheel() {
        searchbarNew?.addEventListener("DOMMouseScroll", (event) => {
          if (event.target.closest("#searchbar-new .searchmode-switcher")) {
            cycleEngine(event.detail > 0 ? 1 : -1);
          }
        }, true);
      }

      // clear searchbar after search
      function clearSearchbarAfterSearch() {
        const oldPickResult = searchbarNew.pickResult;
        searchbarNew.pickResult = function(...args) {
          const result = oldPickResult.apply(this, args);
          searchbarNew.handleRevert?.();
          return result;
        };
      }
      // clear searchbar on double-click
      function clearSearchbarOnDoubleclick() {
        document.querySelector("#search-container .urlbar-input")?.addEventListener("dblclick", () => {
          searchbarNew.handleRevert?.();
        });
      }

      // revert to first search engine after search
      function revertToFirstEngineAfterSearch() {
        const oldPickResult = searchbarNew.pickResult;
        searchbarNew.pickResult = function(...args) {
          const result = oldPickResult.apply(this, args);
            if (searchbarNew.searchMode) queueMicrotask(() => { searchbarNew.searchMode = null; });
            searchbar.currentEngine = searchbar.engines[0];
          return result;
        };
      }

      function applyEngineIcon(icon_url) {
        if (switch_glass_and_engine_icon) {
          searchButton.setAttribute("iconsrc", "chrome://global/skin/icons/search-glass.svg");
          const goButton = document.querySelector("#searchbar-new .urlbar-go-button");
          goButton?.style.setProperty("content", `url(${icon_url})`, "important");
        } else {
          searchButton.iconSrc = icon_url;
        }
      }
      // swap engine icon with the go-button
      function switchGlassAndEngineIcon() {
        const glassUrl = "chrome://global/skin/icons/search-glass.svg";
        const mo = new MutationObserver(() => {
          const currentIcon = searchButton.getAttribute("iconsrc");
          if (currentIcon !== glassUrl) applyEngineIcon(currentIcon);
        });
        mo.observe(searchButton, { attributes: true, attributeFilter: ["iconsrc"] });
        const shadow = searchButton.shadowRoot;
        const img = shadow.querySelector("img");
        img.classList.add("custom-glass-icon");
        if (!shadow.querySelector("#custom-glass-icon-style")) {
          const style = document.createElement("style");
          style.id = "custom-glass-icon-style";
          style.textContent = `
            #main-button:hover .custom-glass-icon,
            #main-button[aria-expanded="true"] .custom-glass-icon {
              fill: #00adee !important;
            }
          `;
          shadow.appendChild(style);
        }
      }

      function customHistoryAutocomplete() {
        if (searchbarNew.__customHistoryProviderInstalled) return;

        ChromeUtils.defineESModuleGetters(lazy, {
          UrlbarResult: "chrome://browser/content/urlbar/UrlbarResult.mjs",
          UrlbarUtils: "moz-src:///browser/components/urlbar/UrlbarUtils.sys.mjs",
          UrlbarShared: "chrome://browser/content/urlbar/UrlbarShared.mjs",
          FormHistory: "resource://gre/modules/FormHistory.sys.mjs",
          UrlbarProviderRecentSearches: "moz-src:///browser/components/urlbar/UrlbarProviderRecentSearches.sys.mjs",
        });

        const controller = searchbarNew.view.controller;
        const manager = controller.parentController?.manager ?? controller.manager;
        // separate provider instance per browser window
        class SearchbarHistoryProvider extends lazy.UrlbarProviderRecentSearches {
          constructor(id) {
            super();
            this._windowId = id;
            this._name = "SearchbarHistoryProvider-" + id;
          }
          // urlbar uses provider.name as an identifier
          get name() {
            return this._name;
          }
          // only run this provider for the window it was registered in
          async isActive(queryContext) {
            return queryContext.sapName == "searchbar" &&
                   this._windowId == Services.wm.getMostRecentWindow("navigator:browser").docShell.outerWindowID;
          }
          async startQuery(queryContext, addCallback) {
            if (queryContext.sapName != "searchbar") return;
            if (!queryContext.searchString) return;

            queryContext.maxResults = custom_search_history_max_results; // override browser.urlbar.maxRichResults
            const engine = queryContext.searchMode?.engineName
                         ? lazy.SearchService.getEngineByName(queryContext.searchMode.engineName)
                         : lazy.SearchService.defaultEngine;
            if (!engine) return;

            const results = await lazy.FormHistory.getAutoCompleteResults( queryContext.searchString,
              { fieldname: "searchbar-history" }, () => false
            );
            const resultType   = lazy.UrlbarShared?.RESULT_TYPE   ?? lazy.UrlbarUtils.RESULT_TYPE;
            const resultSource = lazy.UrlbarShared?.RESULT_SOURCE ?? lazy.UrlbarUtils.RESULT_SOURCE;
            for (const entry of results.slice(0, custom_search_history_max_results)) {
              addCallback(this,
                new lazy.UrlbarResult({
                  type: resultType.SEARCH,
                  source: resultSource.HISTORY,
                  payload: {
                    engine: engine.name,
                    suggestion: entry.text,
                    title: entry.text,
                    isBlockable: true,
                    blockL10n: { id: `urlbar-result-menu-remove-from-history${lazy.UrlbarShared?.RESULT_TYPE ? "2" : ""}` },
                  },
                })
              );
            }
          }
        }

        const provider = new SearchbarHistoryProvider(window.docShell.outerWindowID);
        manager.registerProvider(provider);
        searchbarNew.__customHistoryProviderInstalled = true;
        // searchbarNew.__customHistoryProvider = provider;

        // remove only this window's provider when the window is closed
        window.addEventListener("unload", () => {
          queueMicrotask(() => {
           manager.unregisterProvider(provider);
          });
        }, { once: true });

        // keep the selected row visible when navigating with keyboard
        searchbarNew.inputField.addEventListener("keydown", e => {
          if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(e.key)) return;
          requestAnimationFrame(() => {
            const activeId = searchbarNew.inputField.getAttribute("aria-activedescendant");
            document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
          });
        });
      }

      function restoreOneOffButtons() {
        const resultsBody = document.getElementById("searchbar-results");
        const bodyInner = resultsBody?.closest(".urlbarView-body-inner");
        if (!bodyInner) return;

        let row = bodyInner.querySelector(".search-panel-one-offs");
        if (!row) {
          const container = document.createElement("div");
          container.className = "search-panel-one-offs-container";
          row = document.createElement("div");
          row.className = "search-panel-one-offs";
          row.setAttribute("role", "group");
          container.appendChild(row);
          bodyInner.appendChild(container);
        }

        // prevent duplication on update
        // row.textContent = "";
        row.replaceChildren();

        for (const engine of searchbar.engines) {
          const button = document.createElement("button");
          button.className = "searchbar-engine-one-off-item";
          button.tabIndex = -1;
          button.title = engine.name;
          const box = document.createElement("div");
          box.className = "button-box";
          const img = document.createElement("img");
          img.className = "button-icon";
          engine.getIconURL().then(url => { img.src = url; });
          box.appendChild(img);
          
          const label = document.createElement("label");
          label.className = "button-text";
          label.textContent = engine.name;
          box.appendChild(label);

          button.appendChild(box);

          // LMB / MMB
          function handleOneOffClick(e) {
            if (e.button !== 0 && e.button !== 1) return;
            if (!searchbarNew.value.trim()) return;
            e.preventDefault();
            const submission = engine.getSubmission(searchbarNew.value, null, "searchbar");
            if (!submission) return;
            const where = e.button === 1 ? "tab" : "current";
            openTrustedLinkIn(submission.uri.spec, where, {
              postData: submission.postData,
              ...(e.button === 1 && { inBackground: true })
            });
            if (where === "current" && clear_searchbar_after_search) {
              searchbarNew.handleRevert?.();
            }
            if (revert_to_first_engine_after_search) {
              if (searchbarNew.searchMode) queueMicrotask(() => { searchbarNew.searchMode = null; });
              searchbar.currentEngine = searchbar.engines[0];
            }
          }
          button.addEventListener("mousedown", e => e.preventDefault());
          button.addEventListener("click", handleOneOffClick);
          button.addEventListener("auxclick", handleOneOffClick);

          row.appendChild(button);
        }

        // prev/next selection with TAB/SHIFT+TAB
        searchbarNew.removeEventListener("keydown", searchbarNew._oneOffTabHandler, true);
        searchbarNew._oneOffTabHandler = (e) => {
          if (e.key !== "Tab" || !searchbarNew.view?.isOpen) return;
          const buttons = Array.from(searchbarNew.querySelectorAll(".searchbar-engine-one-off-item:not(.search-setting-button)"));
          if (!buttons.length) return;
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const current = buttons.findIndex(b => b.hasAttribute("selected"));
          buttons[current]?.removeAttribute("selected");
          // allow returning to default search at the edges
          let next = current === -1 ? (e.shiftKey ? buttons.length - 1 : 0) : current + (e.shiftKey ? -1 : 1);
          if (next < 0 || next >= buttons.length) return;
          // let next = (current + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length; // buttons only
          buttons[next].setAttribute("selected", "true");
        };
        searchbarNew.addEventListener("keydown", searchbarNew._oneOffTabHandler, true);

        searchbarNew.removeEventListener("keydown", searchbarNew._oneOffEnterHandler, true);
        searchbarNew._oneOffEnterHandler = (e) => {
          if (e.key !== "Enter" || !searchbarNew.view?.isOpen) return;
          if (document.activeElement !== searchbarNew.inputField) return;
          const selected = searchbarNew.querySelector(".searchbar-engine-one-off-item[selected]");
          if (!selected) return;
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          selected.dispatchEvent(new MouseEvent("click", { button: e.altKey ? 1 : 0, bubbles: true }));
        };
        searchbarNew.addEventListener("keydown", searchbarNew._oneOffEnterHandler, true);

        // popupshown/popuphidden don't cover autocomplete, and blur misses focused input clicks
        searchbarNew._oneOffSelectionObserver?.disconnect();
        (searchbarNew._oneOffSelectionObserver = new MutationObserver(() => {
          const selected = searchbarNew.querySelector(".searchbar-engine-one-off-item[selected]");
          selected?.removeAttribute("selected");
        })).observe(searchbarNew, { attributes: true, attributeFilter: ["open"] });

        // from #openPanel()
        function forceOpenOneOffPanel(view) {
          if (view.isOpen) return;
          const input = view.input;
          input.inputField.setAttribute("aria-expanded", "true");
          input.toggleAttribute("suppress-focus-border", true);
          input.toggleAttribute("open", true);
        }
        // 'searchbarNew.view.onQueryFinished()' calls 'close()' when a query has no results,
        // keep it open so the one-off buttons can be used with a unique query
        const view = searchbarNew.view;
        if (view && !view._oneOffNoResultsHooked) {
          view._oneOffNoResultsHooked = true;
          const oldClose = view.close;
          view.close = function(...args) {
            if (this._keepNoResultsOpen) return;
            return oldClose.apply(this, args);
          };

          const oldOnQueryFinished = view.onQueryFinished;
          view.onQueryFinished = function(...args) {
            this._keepNoResultsOpen = true;
            try {
              const result = oldOnQueryFinished.apply(this, args);
              // display one-off for query with no autocomplete results (usertyping noresults)
              if (!this.isOpen) {
                forceOpenOneOffPanel(this);
              }
              return result
            } finally {
              this._keepNoResultsOpen = false;
            }
          };
        }

        const sButton = document.createElement("button");
        sButton.className = "searchbar-engine-one-off-item search-setting-button";
        sButton.tabIndex = -1;
        const sBox = document.createElement("div");
        sBox.className = "button-box";
        const sImg = document.createElement("img");
        sImg.className = "button-icon";
        sImg.src = "chrome://global/skin/icons/settings.svg";
        const sLabel = document.createElement("label");
        sLabel.className = "button-text";
        // translated settings label
        document.l10n.formatValue(`urlbar-searchmode-popup-search-settings${appver < 154 ? "-panelitem" : ""}`)
        .then(settingsText => {
          sButton.title = settingsText;
          sLabel.textContent = settingsText;
        });
        sBox.append(sImg, sLabel);
        sButton.appendChild(sBox);
        sButton.addEventListener("mousedown", e => e.preventDefault());
        sButton.addEventListener("click", () => openPreferences("paneSearch"));

        row.appendChild(sButton);
      }

      // main style sheet
      async function updateStyleSheet() {
        try {
          await SS.init();
          const icon_url = await document.getElementById("searchbar").currentEngine.getIconURL();
          if (searchButton && icon_url) applyEngineIcon(icon_url);
        } catch {}

        let css = `
          #search-container {
            min-width: 20px !important;
          }
          #searchbuttonpopup {
            scrollbar-width: thin !important;
            max-width: none !important;
            background: var(--panel-background-color, var(--background-color-box)) !important;
            color: var(--panel-text-color, var(--text-color)) !important;
          }
          #searchmode-switcher-panel-list-searchbar {
            scrollbar-width: thin !important;
            max-width: none !important;
          }
          /* highlight currently selected search engine */
          .searchmode-switcher-installed[selected="true"]::part(button):not(:hover) {
            background-color: color-mix(in srgb, currentColor 10%, transparent) !important;
          }
          #searchbar-new .urlbar-go-button {
            content: url("chrome://global/skin/icons/search-glass.svg") !important;
            fill-opacity: 0.8 !important;
            /* fill: #00adee !important; */
            transform: scaleX(-1) !important;
            background: unset !important;
            margin-inline-end: 4px !important;
          }
          #searchbar-new .urlbar-go-button:hover {
            fill: #00adee !important;
            fill-opacity: 1 !important;
          }
          #searchbar-new .urlbar-go-button:active {
            /* fill: #1d518c !important; */
            fill-opacity: 0.8 !important;
          }

          #searchbar-new :is(.searchmode-switcher-dropmarker, .searchmode-switcher-close) {
            margin-inline-start: -4px !important;
            margin-inline-end: -1px !important;
          }
          #searchbar-new .searchmode-switcher:is(:hover) .searchmode-switcher-dropmarker,
          #searchbar-new .searchmode-switcher:is([open]) .searchmode-switcher-dropmarker {
            fill: #00adee;
          }
          /* general engine popup + autocomplete alignments */
          #searchbar-new {
            & .urlbarView-results,
            & .searchmode-switcher {
              padding-left: 1px;
            }
            & .urlbarView-favicon {
              padding-left: 3px !important;
              margin: 0 4px 0 4px !important;
            }
            & .searchmode-switcher-addEngine::part(button),
            & .searchmode-switcher-installed::part(button),
            & .searchmode-switcher-panel-search-settings-button::part(button) {
              background-position-x: 4px;
              /*margin-inline-end: 2px !important;
              margin-left: 2px !important;*/
              padding-block: 4px;
              /*padding-inline-start: calc(var(--panel-menuitem-padding-inline) + 22px - 4px);*/
            }
            & .searchmode-switcher-addEngine::part(button)::before {
              inset-inline-start: 13px;
            }
          }

          /* autocomplete search history popup */
          #searchbar-new .urlbarView {
            overflow: hidden !important;
            margin-right: 1px !important;
            width: auto !important;
            overflow-y: visible !important;
            scrollbar-width: thin !important;
            clip-path: inset(0 0 1px 0 round 0 0 8px 0) !important;

            & .urlbarView-row {
              margin-inline-end: var(--urlbarView-results-padding);
              min-height: 25px !important;
            }
            & .urlbarView-results {
              max-height: min(400px, 50vh) !important;
            }
            & .urlbarView-favicon {
              content: var(--icon-url, url("chrome://global/skin/icons/search-glass.svg"));
              margin: var(--panel-menuitem-margin);
            }
            & .urlbarView-title {
              font-size: 12px !important;
            }
            & .urlbarView-row-inner {
              padding: 0px !important;
              min-height: unset !important;
              scroll-margin-block: 10px !important;
            }
          }
        `;

        if (restore_oneoff_buttons) {
          css += `
            #searchbar-new .search-panel-one-offs-container {
              position: relative;
              display: flex;
              flex-direction: row;
              padding: 4px;
            }
            #searchbar-new .search-panel-one-offs-container::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0px;
              right: 6px;
              border-top: 1px solid var(--panel-separator-color, ThreeDLightShadow);
            }
            #searchbar-new .search-panel-one-offs {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              align-items: center;
              flex: 1;
              gap: 2px;
              margin: 0;
              line-height: 0;
            }
            #searchbar-new .searchbar-engine-one-off-item {
              all: unset;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 28px;
              height: 28px;
              border-radius: 4px;
              cursor: pointer;
              box-sizing: border-box;
              &:hover {
                background: var(--button-background-color-hover);
              }
              &[selected] {
                background: var(--urlbarview-background-color-selected);
              }
            }
            #searchbar-new #searchbar-results {
              max-height: min(400px, 50vh) !important;
              overflow-y: auto !important;
              scrollbar-width: thin !important;
              position: relative !important;
              z-index: 10 !important;
            }
            #searchbar-new .urlbarView {
              overflow: hidden !important;
              overflow-y: hidden !important;
              margin-right: 1px !important;
              width: auto !important;
              padding-right: 2px !important;
            }
            #searchbar-new .search-setting-button {
              margin-inline-start: auto !important;
            }
            /* one-off buttons spacing from settings button */
            #searchbar-new {
              & .search-panel-one-offs {
                padding-inline-end: 29px;
              }
              & .search-setting-button {
                position: absolute !important;
                right: 4px;
                bottom: 4px;
              }
            }
          `;
        }

        if (go_button_always_visible) {
          css += `
            #searchbar-new .urlbar-go-button {
              display: block !important;
            }
          `;
        }

        if (show_addengines_plus_indicator) {
          css += `
            searchbar[addengines="true"] ~ #searchbar-new .searchmode-switcher::part(button)::before {
              content: "";
              position: absolute;
              display: flex;
              background: url(chrome://browser/skin/search-indicator-badge-add.svg) no-repeat center;
              height: 11px;
              width: 11px;
              top: 1px;
              inset-inline-start: 17px;
            }
          `;

        }

        if (switch_glass_and_engine_icon) {
          css += `
            #searchbar-new .urlbar-go-button {
              display: block !important;
              transform: scaleX(1) !important;
              width: 16px !important;
              height: 16px !important;
            }
          `;
        }

        const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
        const uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(css));

        if (sss.sheetRegistered(uri, sss.AUTHOR_SHEET)) {
          sss.unregisterSheet(uri, sss.AUTHOR_SHEET);
        }
        sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);
      }
    } catch(e) {console.error("[alternative_searchbar_new.uc.js]", e);}
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