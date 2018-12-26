// 'Alternative search bar' script for Firefox 60+ by Aris
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
// option: checke for search engine changes and update search bars icon
//
// Not present: old popup to switch engines !
//
// Note: 'Ctrl + Up/Down key' combo switches through search engines

var clear_searchbar_after_search = false; // clear input after search (true) or not (false)
var revert_to_first_engine_after_search = false; // revert to first engine (true) or not (false)
var hide_oneoff_search_engines = false; // hide 'one off' search engines (true) or not (false)
var check_for_engine_changes = true; // update search engine icon on the fly (true) or on restart (false)

(function() {
	var searchbar = document.getElementById("searchbar");
	
	updateStyleSheet();
	
	if(check_for_engine_changes)
	  checkEngineChange();
	
	searchbar._doSearchInternal = searchbar.doSearch;
	searchbar.doSearch = function(aData, aInNewTab) {
	  this._doSearchInternal(aData, aInNewTab);

	  if(clear_searchbar_after_search)
		this.value = '';
	  
	  if(revert_to_first_engine_after_search) {
		this.currentEngine = this.engines ? this.engines[0] : this._engines[0];
		updateStyleSheet();
	  }

	};
	
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
	
	// looks for search engine changes to update style sheet
	function checkEngineChange() {
	  var current_search_engine = document.getElementById("searchbar").currentEngine.name;
	  setInterval(function() {
		var current_search_engine2 = document.getElementById("searchbar").currentEngine.name;
		if(current_search_engine != current_search_engine2) {
		  current_search_engine = current_search_engine2;
		  updateStyleSheet();
		}
	  }, 1000);
		
	};
}());