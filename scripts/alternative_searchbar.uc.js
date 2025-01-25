// 'Alternative search bar' script for Firefox 125+ by Aris
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
// Idea based on 'search revert' script by '2002Andreas':
// https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673&start=2010#p1099758
//
// Initial "old search" script ported from old Firefox versions by Aris
//
//
// Feature (not optional): search glass is always visible at search bars end (like with "old" search)
// Feature (not optional): search button shows current search engines icon (like with "old" search)
// Feature (not optional): search buttons dropmarker is always visible (like with "old" search)
//
// Option: clear search input after search
// Option: revert to first search engine in list after search
// Option: old search engine selection popup
// Option: hide 'add engines' '+' indicator
// Option: hide 'oneoff' search engines (engines at popups bottom)
// Option: hide placeholder text 'Search'
// Option: swap the icons of search engine button and go button
// Option: show icons and search engine names instead of only icons
// Option: select search engine by scrolling mouse wheel over search bars button

// [!] Default browser feature: search engine can be changed inside default/modern popup by right-clicking
//     search icon and selecting 'Set As Default Search Engine' menuitem.


// Configuration area - start (all 'false' by default)
var clear_searchbar_after_search = false; // clear input after search (true) or not (false)
let clear_searchbar_on_doubleclick = false; // clear input after double-clicking the input box (true) or not (false)
var revert_to_first_engine_after_search = false; // revert to first engine (true) or not (false)
var old_search_engine_selection_popup = false; // show old search engine selection popup (true) or not (false)
var select_engine_by_scrolling_over_button = false; // select search engine by scrolling mouse wheel over search bars button (true) or not (false)
var select_engine_by_click_oneoffs_button = false; // select search engine by left-clicking search icon (true) or not (false)
var hide_oneoff_search_engines = false; // hide 'one off' search engines (true) or not (false)
var hide_addengines_plus_indicator = false; // hide add engines '+' sign (true) or not (false)
var hide_placeholder = false; // hide placeholder (true) or not (false)
var switch_glass_and_engine_icon = false; // swap icons of search engine button and go button (true) or not (false)
var show_search_engine_names = false; // show search engine names (true) or not (false)
var show_search_engine_names_with_scrollbar = false; // show search engine names with scrollbars (true) or not (false)
var show_search_engine_names_with_scrollbar_height = '170px'; // higher values show more search engines
var initialization_delay_value = 0; // some systems might require a higher value than '1' second (=1000ms) and on some even '0' is enough
var searchsettingslabel = "Change Search Settings";
// Configuration area - end

var isInCustomize = 1; //start at 1 to set it once at startup
var appversion = parseInt(Services.appinfo.version);

var AltSearchbar = {
  init: async function() {
    await Services.search.wrappedJSObject.init();

    if (location != 'chrome://browser/content/browser.xhtml')
      return;

    window.removeEventListener("load", AltSearchbar.init, false);

    try {

      var searchbar = document.getElementById("searchbar");
      var appversion = parseInt(Services.appinfo.version);

      // apply only once at init
      updateStyleSheet();

      if (hide_placeholder)
        hideSearchbarsPlaceholder();

      if (select_engine_by_scrolling_over_button)
        selectEngineByScrollingOverButton();

      if (old_search_engine_selection_popup)
        createOldSelectionPopup();

      if (select_engine_by_click_oneoffs_button)
        selectEngineByClickOneoffsButton();

      // select search engine by scrolling mouse wheel over search bars button
      function selectEngineByScrollingOverButton() {
        if (!old_search_engine_selection_popup) Services.search.getVisibleEngines().then(engines => searchbar.engines = engines);
        searchbar.addEventListener("DOMMouseScroll", (event) => {
          if (event.originalTarget.classList.contains("searchbar-search-button")) {
            const enabledEngines = searchbar.engines.filter((e) => !e.hideOneOffButton);
            const selectedEngineIndex = enabledEngines.findIndex((e) => e.name === searchbar.currentEngine.name);
            enabledEngines.length < 1 ? null :
              searchbar.currentEngine = enabledEngines[(selectedEngineIndex + (event.detail > 0 ? 1 : -1) + enabledEngines.length) % enabledEngines.length];
            BrowserSearch.searchBar.select();
          }
        }, true);
      };

      // left click on off select engine
      function selectEngineByClickOneoffsButton() {
        var searchoneoffs = searchbar.textbox.popup.oneOffButtons;
        searchoneoffs.container.addEventListener("click", (event) => {
          if ((event.target.className == "searchbar-engine-one-off-item") && !(event instanceof KeyboardEvent) && (event.button == 0)) {
            event.stopPropagation();
            searchoneoffs.contextMenuPopup._triggerButton = event.target;
            searchoneoffs.contextMenuPopup.querySelectorAll('[class^="search-one-offs-context-set-default"]:not([hidden])')[0]
              .dispatchEvent(new Event('command', {
                bubbles: true,
                cancelable: true
              }));
          }
        }, true);
      };

      // hide placeholder
      function hideSearchbarsPlaceholder() {
        searchbar.getElementsByClassName('searchbar-textbox')[0].removeAttribute("placeholder");
      };

      function attachOldPopupToButton(e) {
        if (isInCustomize == 1) {
          setTimeout(function() {
            searchbar.getElementsByClassName("searchbar-search-button")[0].setAttribute("popup", "searchbuttonpopup");
          }, initialization_delay_value);
        }
        if (isInCustomize > 0)
          isInCustomize--;
      }

      // old search selection popup
      async function createOldSelectionPopup() {

        searchbar.engines = await Services.search.getVisibleEngines();

        window.addEventListener("beforecustomization", function(e) { isInCustomize++; }, false);
        window.addEventListener("aftercustomization", attachOldPopupToButton, false);

        // set new search engine
        searchbar.setNewSearchEngine = function(index) {
          searchbar.currentEngine = searchbar.engines[index];
          BrowserSearch.searchBar.select();
        };

        // create search popup
        searchbuttonpopup = document.createXULElement("menupopup");
        searchbuttonpopup.setAttribute("id", "searchbuttonpopup");
        searchbuttonpopup.style.setProperty("width", searchbar.getBoundingClientRect().width + 8 + "px");
        searchbuttonpopup.setAttribute("position", "after_start");

        try {

          for (let i = 0; i <= searchbar.engines.length - 1; ++i) {

            // skip hidden search engines
            const isHidden = searchbar.engines[i]?.hideOneOffButton;
            if (isHidden) continue;

            let menuitem = document.createXULElement("menuitem");
            menuitem.setAttribute("label", searchbar.engines[i].name);
            menuitem.setAttribute("tooltiptext", searchbar.engines[i].name);
            menuitem.setAttribute("class", "menuitem-iconic searchbar-engine-menuitem menuitem-with-favicon");

            if (searchbar.engines[i].name == searchbar.currentEngine.name)
              menuitem.setAttribute("selected", "true");

            searchbar.engines[i].getIconURL().then(iconURL => {
              menuitem.setAttribute("image", iconURL);
            });

            menuitem.addEventListener("command", () => {document.getElementById('searchbar').setNewSearchEngine(i);});

            searchbuttonpopup.appendChild(menuitem);

          }

          menuseparator_om = document.createXULElement("menuseparator");

          searchbuttonpopup.appendChild(menuseparator_om);

          menuitem_om = document.createXULElement("menuitem");
          menuitem_om.setAttribute("label", searchsettingslabel);
          menuitem_om.setAttribute("class", "open-engine-manager");
          menuitem_om.addEventListener("command", () => {openPreferences('search');});
          searchbuttonpopup.appendChild(menuitem_om);

        } catch (exc) {
          console.log("Exception AltSearchbar: " + exc);
        }

        document.getElementById("mainPopupSet").appendChild(searchbuttonpopup);

        // adjust popup width
        setTimeout(function() {
          document.getElementById('searchbuttonpopup').style.setProperty("width", document.getElementById("searchbar").getBoundingClientRect().width + 8 + "px");
        }, 1000);

        var observer_width = new MutationObserver(function(mutations, observer) {
          observer.disconnect();
          try {
            document.getElementById('searchbuttonpopup').style.setProperty("width", document.getElementById("searchbar").getBoundingClientRect().width + 8 + "px");
          } catch (e) {}
          observer.observe(document.getElementById('search-container'), { attributes: true, attributeFilter: ['width'] });
          observer.observe(document.getElementById('main-window'), { attributes: true, attributeFilter: ['sizemode'] });
        });

        try {
          observer_width.observe(document.getElementById('search-container'), { attributes: true, attributeFilter: ['width'] });
          observer_width.observe(document.getElementById('main-window'), { attributes: true, attributeFilter: ['sizemode'] });
        } catch (e) {}

        // attach new popup to search bars search button
        try {
          attachOldPopupToButton();
        } catch (e) {
          console.log("AltSearchbar: Failed to attach new popup to search bar search button");
        }

        // Refresh the script's search popup (searchbuttonpopup) with any changes made to search engines/options.
        async function updateEngines() {

          try {

            searchbuttonpopup = document.getElementById("searchbuttonpopup");

            searchbar.engines = await Services.search.getVisibleEngines();

            try {

              while (searchbuttonpopup.childNodes[0].tagName.toLowerCase() != "menuseparator")
                searchbuttonpopup.removeChild(searchbuttonpopup.firstChild);

              var separator = searchbuttonpopup.childNodes[0];

              for (let i = 0; i <= searchbar.engines.length - 1; ++i) {

                const isHidden = searchbar.engines[i]?.hideOneOffButton;
                if (isHidden) continue;

                let menuitem = document.createXULElement("menuitem");
                menuitem.setAttribute("label", searchbar.engines[i].name);
                menuitem.setAttribute("class", "menuitem-iconic searchbar-engine-menuitem menuitem-with-favicon");
                menuitem.setAttribute("tooltiptext", searchbar.engines[i].name);

                if (searchbar.engines[i].name == searchbar.currentEngine.name)
                  menuitem.setAttribute("selected", "true");

                // Replaced `await` with `.then()` to prevent issues caused by `engine-changed` and `engine-removed` 
                // observers triggering simultaneously on engine removal. Using `.then()` ensures both calls resolve properly.
                setTimeout(() => {
                    searchbar.engines[i].getIconURL().then(iconURL => {
                        menuitem.setAttribute("image", iconURL || "chrome://browser/skin/search-engine-placeholder.png");
                    });
                }, 0);

                menuitem.addEventListener("command", () => {document.getElementById('searchbar').setNewSearchEngine(i);});

                searchbuttonpopup.insertBefore(menuitem, separator);

              }

            } catch (exc) {
              console.log(exc);
            }

          } catch (exc) {
            console.log("update altbar exc: " + exc);
          }
        }

        // Used to observe modifications made to search engines. We are only interested in the addition and removal of engines.
        Services.obs.addObserver(function observer(subject, topic, data) {
          // If a search engine/option is added or removed, we need to refresh the script's popup. We use updateEngines() to do that.
          if (data == "engine-added" || data == "engine-removed" || data == "engine-changed") {
            updateEngines();
          }
        }, "browser-search-engine-modified");

        // Used to create an add engine item and append it into the script's search popup (searchbuttonpopup). This is the option
        // that is displayed as "Add enginename" e.g. Add DuckDuckGo.
        function createAddEngineItem(e) {
          try {

            const searchButtonPopup = document.getElementById("searchbuttonpopup");

            Array.from(searchButtonPopup.querySelectorAll(".custom-addengine-item"))
              .forEach(item => item.remove());
            const separator = searchButtonPopup.querySelector(".custom-addengine-separator");
            if (separator) {
              separator.remove();
            }

            // Get available search engines
            const engines = gBrowser.selectedBrowser.engines || [];
            if (engines.length === 0) {
              return;
            }

            if (!searchButtonPopup.querySelector(".custom-addengine-separator")) {
              const separator = document.createXULElement("menuseparator");
              separator.classList.add("custom-addengine-separator");
              searchButtonPopup.appendChild(separator);
            }

            try {

              engines.forEach((engine, index) => {
                let menuitem = document.createXULElement("menuitem");
                menuitem.setAttribute("class", "menuitem-iconic searchbar-engine-menuitem menuitem-with-favicon custom-addengine-item");
                menuitem.setAttribute("image", engine.icon || "chrome://browser/skin/search-engine-placeholder.png");
                menuitem.setAttribute("engine-name", engine.title);
                menuitem.setAttribute("uri", engine.uri);
                menuitem.addEventListener("command", () => {Services.search.addOpenSearchEngine(engine.uri, engine.icon);});
                menuitem.setAttribute("label", "Add “" + engine.title + "”");
                menuitem.setAttribute("tooltiptext", "Add search engine “" + engine.title + "”");

                searchButtonPopup.appendChild(menuitem);
              });

            } catch (exc) {
              console.log(exc);
            }

          } catch (exc) {
            console.log("custom addengine exc: " + exc);
          }
        }

        searchbar.addEventListener("mousedown", (event) => {
          var defaultPopup = document.getElementById("PopupSearchAutoComplete"); // Browser's default search popup.
          var scriptPopup = document.getElementById("searchbuttonpopup");
          var addEngineItem = document.getElementsByClassName("custom-addengine-item")[0];
          var searchButton = document.getElementsByClassName("searchbar-search-button")[0];

          // hasAddEnginesAttribute == true means there is a search engine provided by the page, for us to add using "Add enginename."
          // You will see a green plus badge on the search button icon, if that is the case.
          var hasAddEnginesAttribute = searchButton.hasAttribute("addengines");

          // Skip clicks on the search button until searchbuttonpopup is available. Disable propagation, too.
          if (!scriptPopup) {
            event.stopPropagation();
            return;
          }

          defaultPopup.style.visibility = "visible";

          // If the user clicks on any element on the search bar except the search text.
          if (event.target.getAttribute("class") != "searchbar-textbox") {

            // Propagation causes PopupSearchAutoComplete to be shown, which in turn causes search-add-engines to be populated.
            // We monitor the PopupSearchAutoComplete and after it is shown, we use createAddEngineItem() to create the add
            // engine item and populate the script's popup (searchbuttonpopup). Propagation causes PopupSearchAutoComplete to be 
            // displayed with searchbuttonpopup, at the same time (when the user clicks the search button). Displaying 
            // PopupSearchAutoComplete with every search button click is inefficient. We allow propagation only when it is needed, 
            // and we set the PopupSearchAutoComplete visibility to collapse, so we do not see it with the script's popup.

            // If there are no changes to be done to the searchbuttonpopup, go ahead and skip propagation.
            // If there is an engine to be added, and the engine item is already available on the script's popup, there are no changes.
            // If there is no engine to be added, and there is no engine item, that also means that there are no changes needed.
            // On the other hand, if hasAddEnginesAttribute and addEngineItem are not synchronized, we need to apply propagation
            // to refresh the searchbuttonpopup. We set the addEngineItem visibility to collapse, and allow propagation.
            if ((hasAddEnginesAttribute && addEngineItem
                                        && addEngineItem.hasAttribute("image")
                                        && addEngineItem.getAttribute("label") !== "null"
                                        && addEngineItem.getAttribute("image") !== "chrome://browser/skin/search-engine-placeholder.png"
                                        && gBrowser.selectedBrowser.engines[0].uri === addEngineItem.getAttribute("uri"))
                                        || (!hasAddEnginesAttribute && !addEngineItem)) {
              event.stopPropagation();
            } else {
              // Hide default search popup ('this.openSuggestionsPanel(true)') 
              // when searchbuttonpopup is opened after 'add engine' entry was added or removed.
              defaultPopup.addEventListener('popupshown', () => {
                defaultPopup.hidePopup();
              }, { once: true });

              defaultPopup.style.visibility = "collapse";

              // We now use 'gBrowser.selectedBrowser.engines' directly to get the data,
              // eliminating the need to wait for the original menu, and allowing for instant updates.
              // defaultPopup.addEventListener("popupshowing", createAddEngineItem, { once: true });
              createAddEngineItem()
            }
          }

          /*searchbar.focus();*/

        }, true);

      }; //createOldSelectionPopup



      ChromeUtils.defineESModuleGetters(lazy, {
        SearchSuggestionController:
          "resource://gre/modules/SearchSuggestionController.sys.mjs",
      });

      if (appversion >= 120) {
        ChromeUtils.defineESModuleGetters(lazy, {
          FormHistory:
            "resource://gre/modules/FormHistory.sys.mjs",
        });
      }

      /* clear searchbar after search */
      if (clear_searchbar_after_search && searchbar.doSearch) {
        setTimeout(function() {
          if (!window.BrowserSearch)
            return;

          var searchbar = BrowserSearch.searchBar;

          if (!searchbar)
            return;

          var textbox = searchbar.textbox;
          var searchbar_go_button = searchbar.getElementsByClassName("search-go-container")[0];

          document.getElementById('PopupSearchAutoComplete').addEventListener('click', function(e) {
            if (e.button == 0 || e.button == 1) {
              textbox.value = '';
              document.getElementById('PopupSearchAutoComplete').hidePopup();
            }
          });

          textbox.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
              textbox.value = '';
              document.getElementById('PopupSearchAutoComplete').hidePopup();
            }
          });

          searchbar_go_button.addEventListener('click', function(e) {
            if (e.button == 0 || e.button == 1) {
              textbox.value = '';
              document.getElementById('PopupSearchAutoComplete').hidePopup();
            }
          });

        }, 0);
      }

      /* clear searchbar on double-click */
      if (clear_searchbar_on_doubleclick) {
        var searchbar = BrowserSearch.searchBar;

        if (!searchbar)
          return;

        document.querySelector("#searchbar .searchbar-textbox").addEventListener("dblclick", function clearInputBox() {
          searchbar.textbox.value = '';
          searchbar.textbox.popup.hidePopup();
          // Refocus the input box to allow autocompletion suggestions to reappear 
          // when the same value is re-entered after clearing.
          searchbar.textbox.blur();
          searchbar.textbox.focus();
        });
      }

      /* revert to first search engine after search */
      if (revert_to_first_engine_after_search && searchbar.doSearch) {
        setTimeout(function() {
          if (!window.BrowserSearch)
            return;

          var searchbar = BrowserSearch.searchBar;

          if (!searchbar)
            return;

          if (!old_search_engine_selection_popup && !select_engine_by_scrolling_over_button)
            Services.search.getVisibleEngines().then(engines => searchbar.engines = engines);

          var textbox = searchbar.textbox;
          var searchbar_go_button = searchbar.getElementsByClassName("search-go-container")[0];

          document.getElementById('PopupSearchAutoComplete').addEventListener('click', function(e) {
            if (e.button == 0 || e.button == 1) {
              searchbar.currentEngine = searchbar.engines[0];
            }
          });

          textbox.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
              searchbar.currentEngine = searchbar.engines[0];
            }
          });

          searchbar_go_button.addEventListener('click', function(e) {
            if (e.button == 0 || e.button == 1) {
              searchbar.currentEngine = searchbar.engines[0];
            }
          });

        }, 0);
      }

      function updateSelected() {
        const menuitems = searchbuttonpopup.querySelectorAll(".searchbar-engine-menuitem");
        const enabledEngines = searchbar.engines.filter(e => !e.hideOneOffButton);
        menuitems.forEach((menuitem, menuitemIndex) => {
          if (enabledEngines[menuitemIndex]?.name === searchbar.currentEngine.name) {
            menuitem.setAttribute("selected", "true");
          } else {
            menuitem.removeAttribute("selected");
          }
        });
      }

      // Workaround for the deprecated setIcon function
      var oldUpdateDisplay = searchbar.updateDisplay;
      searchbar.updateDisplay = function() {
        oldUpdateDisplay.call(this);
        if (old_search_engine_selection_popup) {
          updateSelected();
        }

        // 'useSrc' allows overwriting '!important' rules, forcing icons to update properly.
        const updateIcon = (element, useSrc = false) => {
          if (element && searchbar.currentEngine.getIconURL) {
            searchbar.currentEngine.getIconURL().then(iconURL => {
              useSrc
                ? element.setAttribute("src", iconURL)
                : element.style.setProperty("list-style-image", `url(${iconURL})`, "important");
            });
          }
        };

        if (switch_glass_and_engine_icon) {
          element = document.querySelector(".search-go-button");
        } else {
          element = document.querySelector(".searchbar-search-button .searchbar-search-icon");
        }
        updateIcon(element, switch_glass_and_engine_icon);
      };

      // main style sheet
      async function updateStyleSheet() {
        var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

        var hide_oneoff_search_engines_code = '';
        var show_search_engine_names_code = '';
        var show_search_engine_names_with_scrollbar_code = '';
        var hide_addengines_plus_indicator_code = '';
        var switch_glass_and_engine_icon_code = '';

        var icon_url = null;

        try {
          icon_url = await document.getElementById("searchbar").currentEngine.getIconURL();
        } catch {}

        if (hide_oneoff_search_engines)
          hide_oneoff_search_engines_code = `
          #PopupSearchAutoComplete .search-panel-header,
          #PopupSearchAutoComplete .search-one-offs {
            display: none !important;
          }
        `;

        if (hide_addengines_plus_indicator)
          hide_addengines_plus_indicator_code = `
         .searchbar-search-button[addengines=true]::after {
           visibility: hidden !important;
         }
       `;

        if (show_search_engine_names && !hide_oneoff_search_engines)
          show_search_engine_names_code = `
        #PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item {
          appearance: none !important;
          min-width: 0 !important;
          width: 100% !important;
          border: unset !important;
          height: 18px !important;
          background-image: unset !important;
          padding-inline-start: 2px !important;
          margin-inline-start: 5px !important;
          margin-inline-end: 0 !important;
        }

        #PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item::after {
          appearance: none !important;
          display: block !important;
          content: attr(tooltiptext) !important;
          position: relative !important;
          padding-inline-start: 6px !important;
          min-width: 0 !important;
          width: 100% !important;
          white-space: nowrap !important;
        }

        #PopupSearchAutoComplete .search-panel-one-offs {
          min-height: unset !important;
          height: unset !important;
          max-height: unset !important;
          line-height: unset !important;
        }

        #PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item .button-box {
          display: inline !important;
        }

        #PopupSearchAutoComplete  .search-setting-button {
          z-index: 1000 !important;
        }

        #PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item .button-box .button-icon {
          margin-top: 1px !important;
          padding-inline-start: 0px !important;
          margin-inline-start: 0px !important;
          position: relative !important;
        }
        `;

        if (show_search_engine_names_with_scrollbar && !hide_oneoff_search_engines && show_search_engine_names)
          show_search_engine_names_with_scrollbar_code = `
        #PopupSearchAutoComplete .search-one-offs {
          height: ` + show_search_engine_names_with_scrollbar_height + ` !important;
          max-height: ` + show_search_engine_names_with_scrollbar_height + ` !important;
          overflow-y: scroll !important;
          overflow-x: hidden !important;
        }
        `;

        if (switch_glass_and_engine_icon)
          switch_glass_and_engine_icon_code = `
        .search-go-button {
          list-style-image: url(` + icon_url + `) !important;
          transform: scaleX(1) !important;
        }
        .searchbar-search-button .searchbar-search-icon {
          list-style-image: url("chrome://global/skin/icons/search-glass.svg") !important;
          -moz-context-properties: fill, fill-opacity !important;
          fill-opacity: 1.0 !important;
          fill: #3683ba !important;
        }
        .searchbar-search-button:hover .searchbar-search-icon {
          fill: #1d518c !important;
        }
        .searchbar-search-button:active .searchbar-search-icon {
          fill: #00095d !important;
        }
        `;

        var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
        #search-container{
          min-width: 20px !important;
        }
        #searchbuttonpopup {
          margin-inline-start: -5px !important;
          margin-inline-end: 5px !important;

          & > menuitem{
            padding-inline-start: 0.3em !important;
            max-width: none !important;

            &.open-engine-manager::before {
              content: "";
              padding-inline-end: 2em;
            }
          }
        }
        .searchbar-search-button .searchbar-search-icon {
          list-style-image: url(` + icon_url + `);
        }
        .search-go-button {
          list-style-image: url("chrome://global/skin/icons/search-glass.svg") !important;
          -moz-context-properties: fill, fill-opacity !important;
          fill-opacity: 1.0 !important;
          fill: #3683ba !important;
          transform: scaleX(-1) !important;
          background: unset !important;
          margin-inline-end: 4px !important;
        }
        .search-go-button:hover {
          fill: #1d518c !important;
        }
        .search-go-button:active {
          fill: #00095d !important;
        }
        .search-go-button[hidden="true"] {
          display: block !important;
        }
        .searchbar-search-button[addengines=true] > .searchbar-search-icon-overlay,
        .searchbar-search-button:not([addengines=true]) > .searchbar-search-icon-overlay {
          list-style-image: url("chrome://global/skin/icons/arrow-down-12.svg") !important;
          -moz-context-properties: fill !important;
          margin-inline-start: -6px !important;
          margin-inline-end: 2px !important;
          width: 11px !important;
          height: 11px !important;
        }
        .searchbar-search-button[addengines=true] > .searchbar-search-icon-overlay {
          margin-top: 0px !important;
        }
        .searchbar-search-button[addengines=true]::after {
          content: " " !important;
          background: url("chrome://browser/skin/search-indicator-badge-add.svg") center no-repeat !important;
          display: block !important;
          visibility: visible !important;
          width: 11px !important;
          height: 11px !important;
          margin-inline-start: 18px !important;
          margin-top: -12px !important;
          position: absolute !important;
        }
        .searchbar-search-button[addengines=true] > .searchbar-search-icon-overlay {
          visibility: visible !important;
        }
        .custom-addengine-item > .menu-iconic-left::after {
          position: relative !important;
          display: block !important;
          content: "" !important;
          background: url("chrome://browser/skin/search-indicator-badge-add.svg") no-repeat center !important;
          box-shadow: none  !important;
          margin-top: -12px !important;
          margin-inline-start: -4px !important;
          margin-right: -7px !important;
          width: 11px !important;
          height: 11px !important;
          min-width: 11px !important;
          min-height: 11px !important;
        }
        ` + hide_addengines_plus_indicator_code + `
        ` + hide_oneoff_search_engines_code + `
        ` + show_search_engine_names_code + `
        ` + show_search_engine_names_with_scrollbar_code + `
        ` + switch_glass_and_engine_icon_code + `
      `), null, null);

        // remove old style sheet
        if (sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
          sss.unregisterSheet(uri, sss.AGENT_SHEET);
        }

        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

      };

    } catch (e) {}

  }
}

/* if search is not hidden on current window, wait for searchbar loading and then initialize 'alternative search' (with delay) */
if (!document.firstElementChild.hasAttribute("chromehidden") || !document.firstElementChild.getAttribute("chromehidden").includes("toolbar")) {
  if (document.readyState === "complete") {
    setTimeout(AltSearchbar.init, initialization_delay_value);
  } else {
    window.addEventListener("load", AltSearchbar.init, false);
  }
}
