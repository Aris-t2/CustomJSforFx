// 'Alternative search bar' script for Firefox 64+ by Aris
// (script does not work with Firefox versions lower than 64)
//
// Based on 'search revert' script by 2002Andreas:
// https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673&start=2010#p1099758
//
// Search glass always visible at search bars end (like with old search)
// Search button shows current search engines icon (like with old search)
// Search buttons dropmarker always visible (like with old search)
//
// option: clear search input after search
// option: revert to first search engine in list after search
// option: hide oneoff search engines
// option: select search engine by scrolling mouse wheel over searchbars button
//
// Not present: old popup to switch engines !
//
// Note: 'Ctrl + Up&Down keys' and 'Ctrl + Mouse wheel up&down' combos switch through search engines

var clear_searchbar_after_search = false; // clear input after search (true) or not (false)
var revert_to_first_engine_after_search = false; // revert to first engine (true) or not (false)
var hide_oneoff_search_engines = false; // hide 'one off' search engines (true) or not (false)
var select_engine_by_scrolling_over_button = false; // select search engine by scrolling mouse wheel over searchbars button (true) or not (false)

(function() {
	var searchbar = document.getElementById("searchbar");
	
	updateStyleSheet();
	
    // select search engine by scrolling mouse wheel over searchbars button
	if(select_engine_by_scrolling_over_button)
	  searchbar.addEventListener("DOMMouseScroll", (event) => {
		if (event.originalTarget.classList.contains("searchbar-search-button")) {
          searchbar.selectEngine(event, event.detail > 0);
		}
	  }, true);
	
	// doSearch function taken from browsers internal 'searchbar.js' file and modified
	searchbar.doSearch = function(aData, aWhere, aEngine, aParams, aOneOff) {
			
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
	}
	
	// main style sheet
	function updateStyleSheet() {
	  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	  
	  var hide_oneoff_search_engines_code='';
	
	  if(hide_oneoff_search_engines)
		hide_oneoff_search_engines_code=' \
		  #PopupSearchAutoComplete .search-panel-header, \
		  #PopupSearchAutoComplete .search-one-offs { \
			display: none !important; \
		  } \
		';
	  
	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		\
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
		.searchbar-search-button:not([addengines=true]) > .searchbar-search-icon-overlay { \
		  list-style-image: url(chrome://global/skin/icons/arrow-dropdown-12.svg) !important; \
		  -moz-context-properties: fill !important; \
		  margin-inline-start: -6px !important; \
		  margin-inline-end: 2px !important; \
		  width: 8px !important; \
		  height: 8px !important; \
		} \
		'+hide_oneoff_search_engines_code+' \
		\
	  '), null, null);
	  
	  // remove old style sheet
	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) {
		sss.unregisterSheet(uri,sss.AGENT_SHEET);
	  }
	  
	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	};
	
}());