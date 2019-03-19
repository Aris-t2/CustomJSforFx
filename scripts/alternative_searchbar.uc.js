// 'Alternative search bar' script for Firefox 60+ by Aris
//
// Based on 'search revert' script by '2002Andreas':
// https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673&start=2010#p1099758
//
// Feature: search glass is always visible at search bars end (like with old search)
// Feature: search button shows current search engines icon (like with old search)
// Feature: search buttons dropmarker is always visible (like with old search)
//
// Option: clear search input after search
// Option: revert to first search engine in list after search
// Option: old search engine selection popup ([!] FIREFOX 64+ only [!])
// Option: hide 'add engines' '+' indicator
// Option: hide 'oneoff' search engines (engines at popups bottom)
// Option: hide placeholder text 'Search'
// Option: swap the icons of search engine button and go button
// Option: show search engine names instead of icons only
// Option: select search engine by scrolling mouse wheel over search bars button
// Option: hide popup when using 'CTRL or MOUSE WHEEL + UP&DOWN keys' to switch engine
//
// [!] Option 'old search engine selection popup': the menuitem to add new new search engine is not present!
//     Use menuitem inside default popup instead.
// [!] Default browser feature: if search bar is focused with 'CTRL + K' or 'CTRL + E', one can switch 
//     through search engines with 'CTRL + UP&DOWN keys' and 'CTRL + MOUSE WHEELs UP&DOWN scrolling'! 
// [!] Default browser feature: search engine can be changed inside default/modern popup by right-clicking
//     search icon and selecting 'Set As Default Search Engine' menuitem


// Configuration area - start
var clear_searchbar_after_search = false; // clear input after search (true) or not (false)
var revert_to_first_engine_after_search = false; // revert to first engine (true) or not (false)
var old_search_engine_selection_popup_fx64 = false; // show old search engine selection popup (true) or not (false)
var select_engine_by_scrolling_over_button = false; // select search engine by scrolling mouse wheel over search bars button (true) or not (false)
var hide_oneoff_search_engines = false; // hide 'one off' search engines (true) or not (false)
var hide_addengines_plus_indicator = false; // hide add engines '+' sign (true) or not (false)
var hide_placeholder = false; // hide placeholder (true) or not (false)
var switch_glass_and_engine_icon = false; // swap icons of search engine button and go button (true) or not (false)
var show_search_engine_names = false; // show search engine names (true) or not (false)
var show_search_engine_names_with_scrollbar = false; // show search engine names with scrollbars (true) or not (false)
var show_search_engine_names_with_scrollbar_height = '170px'; // higher values show more search engines
var searchsettingslabel = "Search Settings";
var hide_popup_when_selecting_engine_with_hotkeys = true; // hide popup when using 'CTRL or MOUSE WHEEL + UP&DOWN keys' to switch engine (true) or not (false)
// Configuration area - end


// main code
setTimeout(function(){
  try {
	var searchbar = document.getElementById("searchbar");
	var appversion = parseInt(Services.appinfo.version);

	updateStyleSheet();
	
	if(hide_placeholder)
	  hideSearchbarsPlaceholder();

	if(select_engine_by_scrolling_over_button)
	  selectEngineByScrollingOverButton();

	if(old_search_engine_selection_popup_fx64 && appversion >= 64)
	  createOldSelectionPopup();

	// select search engine by scrolling mouse wheel over search bars button
	function selectEngineByScrollingOverButton() {
	  searchbar.addEventListener("DOMMouseScroll", (event) => {
		if (event.originalTarget.classList.contains("searchbar-search-button")) {
          searchbar.selectEngine(event, event.detail > 0);
		}
	  }, true);
	};
	
	// hide placeholder
	function hideSearchbarsPlaceholder() {
	  searchbar.getElementsByClassName('searchbar-textbox')[0].removeAttribute("placeholder");
	};

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
	  
	  /* adjust popup width*/
	  setTimeout(function(){
		document.getElementById('searchbuttonpopup').setAttribute("width", document.getElementById("searchbar").firstChild.nextSibling.getBoundingClientRect().width);
	  },1000);
	  
	  var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		 try {
		  document.getElementById('searchbuttonpopup').setAttribute("width", document.getElementById("searchbar").firstChild.nextSibling.getBoundingClientRect().width );
		 } catch(e){}
		});    
	  });
	
	  try {
		observer.observe(document.getElementById('search-container'), { attributes: true, attributeFilter: ['width'] });
	  } catch(e){}
	
  	  var observer2 = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
		 try {
		  document.getElementById('searchbuttonpopup').setAttribute("width", document.getElementById("searchbar").firstChild.nextSibling.getBoundingClientRect().width );
		 } catch(e){}
		});    
	  });
	
	  try {
		observer2.observe(document.getElementById('main-window'), { attributes: true, attributeFilter: ['sizemode'] });
	  } catch(e){}
	  
	  // attach new popup to search bars search button
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

	// doSearch function taken from Firefox 60s internal 'searchbar.xml' file and added modifications
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
	// doSearch function taken from Firefox 64s internal 'searchbar.js' file and added modifications
	if(appversion >= 63) searchbar.doSearch = function(aData, aWhere, aEngine, aParams, aOneOff) {
	  let textBox = this._textbox;

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

	  const details = {
		isOneOff: aOneOff,
		isSuggestion: (!aOneOff && telemetrySearchDetails),
		selection: telemetrySearchDetails,
	  };
	  BrowserSearch.recordSearchInTelemetry(engine, "searchbar", details);

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

	// setIcon function taken from browsers internal 'searchbar.js' file and added modifications
	searchbar.setIcon = function(element, uri) {
	  element.setAttribute("src", uri);
	  updateStyleSheet();
	};
	
	// override selectEngine function and remove automatic popup opening
	if(hide_popup_when_selecting_engine_with_hotkeys) searchbar.selectEngine = function(aEvent, isNextEngine) {
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

	  var hide_oneoff_search_engines_code = '';
	  var show_search_engine_names_code = '';
	  var show_search_engine_names_with_scrollbar_code = '';
	  var hide_addengines_plus_indicator_code = '';
	  var switch_glass_and_engine_icon_code = '';
	
	  if(hide_oneoff_search_engines)
		hide_oneoff_search_engines_code=' \
		  #PopupSearchAutoComplete .search-panel-header, \
		  #PopupSearchAutoComplete .search-one-offs { \
			display: none !important; \
		  } \
		';

	  if(hide_addengines_plus_indicator)
	   hide_addengines_plus_indicator_code=' \
	     .searchbar-search-button[addengines=true]::after { \
		   visibility: hidden !important; \
		 } \
	   ';

	  if(show_search_engine_names && !hide_oneoff_search_engines && appversion < 66)
	   show_search_engine_names_code=' \
		#PopupSearchAutoComplete .search-panel-tree:not([collapsed="true"]) { \
		  display: block !important; \
		  width: 100% !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree:not([collapsed="true"]) > * { \
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
		
	  if(show_search_engine_names && !hide_oneoff_search_engines && appversion >= 66)
	   show_search_engine_names_code=' \
		#PopupSearchAutoComplete .search-panel-tree:not([collapsed="true"]) { \
		  display: block !important; \
		  width: 100% !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree:not([collapsed="true"]) > * { \
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
		#PopupSearchAutoComplete .search-panel-tree[height="21"] { \
		  min-height: 21px !important; \
		  height: 21px !important; \
		  max-height: 21px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="42"] { \
		  min-height: 42px !important; \
		  height: 42px !important; \
		  max-height: 42px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="63"] { \
		  min-height: 63px !important; \
		  height: 63px !important; \
		  max-height: 63px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="84"] { \
		  min-height: 84px !important; \
		  height: 84px !important; \
		  max-height: 84px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="105"] { \
		  min-height: 105px !important; \
		  height: 105px !important; \
		  max-height: 105px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="126"] { \
		  min-height: 126px !important; \
		  height: 126px !important; \
		  max-height: 126px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="147"] { \
		  min-height: 147px !important; \
		  height: 147px !important; \
		  max-height: 147px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="168"] { \
		  min-height: 168px !important; \
		  height: 168px !important; \
		  max-height: 168px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="189"] { \
		  min-height: 189px !important; \
		  height: 189px !important; \
		  max-height: 189px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree[height="210"] { \
		  min-height: 210px !important; \
		  height: 210px !important; \
		  max-height: 210px !important; \
		} \
		#PopupSearchAutoComplete .search-panel-tree scrollbar { \
		  display: none !important; \
		  visibility: collapse !important; \
		  opacity: 0 !important; \
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
		
	  if(switch_glass_and_engine_icon)
	   switch_glass_and_engine_icon_code=' \
		.search-go-button { \
		  list-style-image: url('+document.getElementById("searchbar").currentEngine.iconURI.spec+') !important; \
		  transform: scaleX(1) !important; \
		} \
		.searchbar-search-button .searchbar-search-icon { \
		  list-style-image: url(chrome://browser/skin/search-glass.svg) !important; \
		  -moz-context-properties: fill, fill-opacity !important; \
		  fill-opacity: 1.0 !important; \
		  fill: #3683ba !important; \
		} \
		.searchbar-search-button:hover .searchbar-search-icon { \
		  fill: #1d518c !important; \
		} \
		.searchbar-search-button:active .searchbar-search-icon { \
		  fill: #00095d !important; \
		} \
		\
		';

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(' \
		\
		#searchbuttonpopup {\
		  -moz-margin-start: -1px; \
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
		  margin-inline-end: 4px !important; \
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
		  content: " " !important; \
		  background: url(chrome://browser/skin/search-indicator-badge-add.svg) center no-repeat !important; \
		  display: block !important; \
		  visibility: visible !important; \
		  width: 11px !important; \
		  height: 11px !important; \
		  -moz-margin-start: 18px !important; \
		  margin-top: -11px !important; \
		  position: absolute !important; \
		} \
		.searchbar-search-button[addengines=true] > .searchbar-search-icon-overlay { \
		  visibility: visible !important; \
		} \
		'+hide_addengines_plus_indicator_code+' \
		'+hide_oneoff_search_engines_code+' \
		'+show_search_engine_names_code+' \
		'+show_search_engine_names_with_scrollbar_code+' \
		'+switch_glass_and_engine_icon_code+' \
		\
	  '), null, null);

	  // remove old style sheet
	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) {
		sss.unregisterSheet(uri,sss.AGENT_SHEET);
	  }

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	};

  } catch(e) {}

},1000);