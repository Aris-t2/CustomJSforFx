// 'Alternative search bar' script for Firefox 60+ by Aris
//
// Based on 'search revert' script by '2002Andreas':
// https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673&start=2010#p1099758
//
// Search glass always visible at search bars end (like with old search)
// Search button shows current search engines icon (like with old search)
// Search buttons dropmarker always visible (like with old search)
//
// option: clear search input after search
// option: revert to first search engine in list after search
// option: old search engine selection popup ([!] FIREFOX 64+ only [!])
// option: hide oneoff search engines
// option: show search engine names instead of icons only
// option: select search engine by scrolling mouse wheel over searchbars button
//
// [!] Old search engine selection popup: 'add engines' menuitems is not present!
//     Use default popup instead by hitting 'DOWN' key or typing into text field.
// [!] If searchbar is focused, what can be done with 'CTRL + K' or 'CTRL + E', one can switch
//     through search engines with 'CTRL + UP&DOWN keys' and 'CTRL + Mouse wheel UP&DOWN' combos! 


// Configuration area - start
var clear_searchbar_after_search = false; // clear input after search (true) or not (false)
var revert_to_first_engine_after_search = false; // revert to first engine (true) or not (false)
var old_search_engine_selection_popup_fx64 = false; // show old search engine selection popup (true) or not (false)
var select_engine_by_scrolling_over_button = false; // select search engine by scrolling mouse wheel over searchbars button (true) or not (false)
var hide_oneoff_search_engines = false; // hide 'one off' search engines (true) or not (false)
var show_search_engine_names = false; // show search engine names (true) or not (false)
var show_search_engine_names_with_scrollbar = false; // show search engine names with scrollbars (true) or not (false)
var show_search_engine_names_with_scrollbar_height = '170px'; // higher values show more search engines
var searchsettingslabel = "Search Settings";
// Configuration area - end


// main function
(function() {
  try {
	var searchbar = document.getElementById("searchbar");
	var appversion = parseInt(Services.appinfo.version);

	updateStyleSheet();

	if(select_engine_by_scrolling_over_button)
	  selectEngineByScrollingOverButton();

	if(old_search_engine_selection_popup_fx64 && appversion >= 64)
	  createOldSelectionPopup();

	// select search engine by scrolling mouse wheel over searchbars button
	function selectEngineByScrollingOverButton() {
	  searchbar.addEventListener("DOMMouseScroll", (event) => {
		if (event.originalTarget.classList.contains("searchbar-search-button")) {
          searchbar.selectEngine(event, event.detail > 0);
		}
	  }, true);
	}

	// old search selection popup
	function createOldSelectionPopup() {

	  var engines = searchbar.engines;
		
	  // set new search engine
	  searchbar.setNewSearchEngine = function(index) {
		searchbar.currentEngine = searchbar.engines[index];
	  };

	  // create search popup
	  if(appversion <= 62) searchbuttonpopup = document.createElement("menupopup");
		else searchbuttonpopup = document.createXULElement("menupopup");
	  searchbuttonpopup.setAttribute("id", "searchbuttonpopup");
	  searchbuttonpopup.setAttribute("width", searchbar.firstChild.nextSibling.getBoundingClientRect().width - 6 );
	  searchbuttonpopup.setAttribute("position", "after_start");
	 
	  for (var i = 0; i <= engines.length - 1; ++i) {
					
		if(appversion <= 62) menuitem = document.createElement("menuitem");
		  else menuitem = document.createXULElement("menuitem");
		var name = engines[i].name;
		menuitem.setAttribute("label", name);
		menuitem.setAttribute("class", "menuitem-iconic searchbar-engine-menuitem menuitem-with-favicon");		
		if (engines[i] == searchbar.currentEngine)
		  menuitem.setAttribute("selected", "true");
		if (engines[i].iconURI)
		  searchbar.setIcon(menuitem, engines[i].iconURI.spec);
		menuitem.setAttribute("oncommand", "document.getElementById('searchbar').setNewSearchEngine("+i+")");
		
		searchbuttonpopup.appendChild(menuitem);

	  }

	  if(appversion <= 62) menuseparator_om = document.createElement("menuseparator");
		else menuseparator_om = document.createXULElement("menuseparator");
	  searchbuttonpopup.appendChild(menuseparator_om);
		
	  if(appversion <= 62) menuitem_om = document.createElement("menuitem");
		else menuitem_om = document.createXULElement("menuitem");
	  menuitem_om.setAttribute("label", searchsettingslabel);
	  menuitem_om.setAttribute("class", "open-engine-manager");	
	  menuitem_om.setAttribute("oncommand", "openPreferences('search');");
	  searchbuttonpopup.appendChild(menuitem_om);
	
	  document.getElementById("mainPopupSet").appendChild(searchbuttonpopup);
	  
	  // attach new popup to searchbars search button
	  document.getAnonymousElementByAttribute(searchbar.firstChild.nextSibling, "class", "searchbar-search-button").setAttribute("popup", "searchbuttonpopup");
		  
	  // hide default popup when clicking on search button
	  searchbar.addEventListener("mousedown", (event) => {
	   if (event.originalTarget.classList.contains("searchbar-search-button")) {
		document.getElementById('PopupSearchAutoComplete').hidePopup();
		document.getElementById("PopupSearchAutoComplete").style.visibility="collapse";
		
		setTimeout(function() {
		 document.getElementById("PopupSearchAutoComplete").style.visibility="visible";
		 document.getElementById('PopupSearchAutoComplete').hidePopup();
		}, 1000);
		  
	   }
	  }, true);

	};
   
	// doSearch function taken from Fx60s internal 'searchbar.xml' file and modified
	if(appversion < 63) searchbar.doSearch = function(aData, aWhere, aEngine) {
			
      var textBox = this._textbox;
	  
      if (aData && !PrivateBrowsingUtils.isWindowPrivate(window)) {
         this.FormHistory.update(
           { op : "bump",
             fieldname : textBox.getAttribute("autocompletesearchparam"),
             value : aData },
           { handleError : function(aError) {
               Components.utils.reportError("Saving search to form history failed: " + aError.message);
           }});
       }

       let engine = aEngine || this.currentEngine;
       var submission = engine.getSubmission(aData, null, "searchbar");
       let params = {
         postData: submission.postData,
         inBackground: aWhere == "tab-background"
       };

       openUILinkIn(submission.uri.spec,aWhere == "tab-background" ? "tab" : aWhere,params);

	  if(clear_searchbar_after_search)
		this.value = '';
		  
	  if(revert_to_first_engine_after_search) {
		  this.currentEngine = this.engines ? this.engines[0] : this._engines[0];
		  updateStyleSheet();
	  }
	};
	
	// doSearch function taken from Fx64s internal 'searchbar.js' file and modified
	if(appversion >= 63) searchbar.doSearch = function(aData, aWhere, aEngine, aParams, aOneOff) {
			
	  let textBox = this._textbox;

	  // Save the current value in the form history
	  if (aData && !PrivateBrowsingUtils.isWindowPrivate(window) && this.FormHistory.enabled) {
		this.FormHistory.update({
			op: "bump",
			fieldname: textBox.getAttribute("autocompletesearchparam"),
			value: aData,
		}, {
			handleError(aError) {
			  Cu.reportError("Saving search to form history failed: " + aError.message);
			},
		});
	  }

	  let engine = aEngine || this.currentEngine;
	  let submission = engine.getSubmission(aData, null, "searchbar");
	  let telemetrySearchDetails = this.telemetrySearchDetails;
	  this.telemetrySearchDetails = null;
	  if (telemetrySearchDetails && telemetrySearchDetails.index == -1) {
		telemetrySearchDetails = null;
	  }
	  // If we hit here, we come either from a one-off, a plain search or a suggestion.
	  const details = {
		isOneOff: aOneOff,
		isSuggestion: (!aOneOff && telemetrySearchDetails),
		selection: telemetrySearchDetails,
	  };
	  BrowserSearch.recordSearchInTelemetry(engine, "searchbar", details);
	  // null parameter below specifies HTML response for search
	  let params = {
		postData: submission.postData,
	  };
	  if (aParams) {
		for (let key in aParams) {
		  params[key] = aParams[key];
		}
	  }
	  openTrustedLinkIn(submission.uri.spec, aWhere, params);
		
		if(clear_searchbar_after_search)
			this.value = '';
		  
		if(revert_to_first_engine_after_search) {
			this.currentEngine = this.engines ? this.engines[0] : this._engines[0];
			updateStyleSheet();
		}
	};

	// setIcon function taken from browsers internal 'searchbar.js' file and modified
	searchbar.setIcon = function(element, uri) {
	  element.setAttribute("src", uri);
	  updateStyleSheet();
	};
	
	// override selectEngine function and remove automatic popup opening
	searchbar.selectEngine = function(aEvent, isNextEngine) {
      // Find the new index
      let newIndex = this.engines.indexOf(this.currentEngine);
      newIndex += isNextEngine ? 1 : -1;

      if (newIndex >= 0 && newIndex < this.engines.length) {
        this.currentEngine = this.engines[newIndex];
      }

      aEvent.preventDefault();
      aEvent.stopPropagation();

	};

	// main style sheet
	function updateStyleSheet() {
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	  
	  var hide_oneoff_search_engines_code='';
	  var show_search_engine_names_code='';
	  var show_search_engine_names_with_scrollbar_code='';
	
	  if(hide_oneoff_search_engines)
		hide_oneoff_search_engines_code=' \
		  #PopupSearchAutoComplete .search-panel-header, \
		  #PopupSearchAutoComplete .search-one-offs { \
			display: none !important; \
		  } \
		';
		
	  if(show_search_engine_names && !hide_oneoff_search_engines)
	   show_search_engine_names_code=' \
		#PopupSearchAutoComplete .search-panel-tree { \
		  display: block !important; \
		  width: 100% !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree *[anonid="main-box"] { \
		  width: 100%; \
		} \
		#PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item { \
		  -moz-appearance:none !important; \
		  min-width: 0 !important; \
		  width: 100% !important; \
		  border: unset !important; \
		  height: 22px !important; \
		  background-image: unset !important; \
		  -moz-padding-start: 3px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item:not([tooltiptext]) { \
		  display: none !important; \
		} \
		#PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item .button-box { \
		  position: absolute !important; \
		  -moz-padding-start: 4px !important; \
		  margin-top: 3px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-one-offs .searchbar-engine-one-off-item::after { \
		  -moz-appearance: none !important; \
		  display: inline !important; \
		  content: attr(tooltiptext) !important; \
		  position: relative !important; \
		  top: -9px !important; \
		  -moz-padding-start: 25px !important; \
		  min-width: 0 !important; \
		  width: 100% !important; \
		  white-space: nowrap !important; \
		} \
		';
		
	  if(show_search_engine_names_with_scrollbar && !hide_oneoff_search_engines && show_search_engine_names)
	   show_search_engine_names_with_scrollbar_code=' \
		#PopupSearchAutoComplete .search-one-offs { \
		  height: '+show_search_engine_names_with_scrollbar_height+' !important; \
		  max-height: '+show_search_engine_names_with_scrollbar_height+' !important; \
		  overflow-y: scroll !important; \
		  overflow-x: hidden !important; \
		} \
		\
		';
	  
	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		\
		#searchbuttonpopup {\
		  -moz-margin-start: 3px; \
		} \
		.searchbar-search-button { \
		  -moz-margin-start: -4px; \
		} \
		.searchbar-search-button .searchbar-search-icon { \
		  list-style-image: url('+document.getElementById("searchbar").currentEngine.iconURI.spec+') !important; \
		} \
		.search-go-button { \
		  list-style-image: url(chrome://browser/skin/search-glass.svg) !important; \
		  -moz-context-properties: fill, fill-opacity !important; \
		  fill-opacity: 1.0 !important; \
		  fill: #3683ba !important; \
		  transform: scaleX(-1) !important; \
		  background: unset !important; \
		} \
		.search-go-button:hover { \
		  fill: #1d518c !important; \
		} \
		.search-go-button:active { \
		  fill: #00095d !important; \
		} \
		.search-go-button[hidden="true"] { \
		  display: block !important; \
		} \
		.searchbar-search-button[addengines=true] > .searchbar-search-icon-overlay, \
		.searchbar-search-button:not([addengines=true]) > .searchbar-search-icon-overlay { \
		  list-style-image: url(chrome://global/skin/icons/arrow-dropdown-12.svg) !important; \
		  -moz-context-properties: fill !important; \
		  margin-inline-start: -6px !important; \
		  margin-inline-end: 2px !important; \
		  width: 11px !important; \
		  height: 11px !important; \
		} \
		.searchbar-search-button[addengines=true] > .searchbar-search-icon-overlay { \
		  margin-top: 0px !important; \
		} \
		.searchbar-search-button[addengines=true]::after { \
		  content: "" !important; \
		  background: url(chrome://browser/skin/search-indicator-badge-add.svg) center no-repeat !important; \
		  display: block !important; \
		  visibility: visible !important; \
		  width: 11px !important; \
		  height: 11px !important; \
		  -moz-margin-start: 18px !important; \
		  margin-top: -11px !important; \
		  position: absolute !important; \
		} \
		'+hide_oneoff_search_engines_code+' \
		'+show_search_engine_names_code+' \
		'+show_search_engine_names_with_scrollbar_code+' \
		\
	  '), null, null);
	  
	  // remove old style sheet
	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) {
		sss.unregisterSheet(uri,sss.AGENT_SHEET);
	  }
	  
	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	};
	
  } catch(e) {}
	
}());