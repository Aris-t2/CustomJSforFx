// 'Classic autocomplete popup with two lined results' script for Firefox 68+ by Aris
// CSS code based on https://github.com/Aris-t2/CustomCSSforFx/blob/master/classic/css/locationbar/ac_popup_classic_with_url_only_fx68.css
// popup width gets adjusted automatically when switching between normal, maximized and fullscreen window modes
// popup width does not get adjusted automatically when switchting between compact, normal and touch toolbar modes

// [!] option: 'Visit...' and 'Search with...' items can be hidden using 'hide_visit_search_items' variable
// [!] option: type icons like boomarks star, switch to tab etc. can be moved to the right using 'move_bookmarks_star_to_the_end' variable


var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

var fx70_workaround = true; // fixes issues with large amounts for search engines
var hide_visit_search_items = false;
var move_bookmarks_star_to_the_end = true;

setTimeout(function(){
  try{
	
	classicAcpopup();
	
	var observer = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
		setTimeout(function(){
		  classicAcpopup();
		},500);
	  });    
	});
	
	observer.observe(document.getElementById("main-window"), { attributes: true, attributeFilter: ['sizemode'] });
	
	function classicAcpopup(event){
	
	  var urlbar_width = Math.round(document.getElementById("urlbar").getBoundingClientRect().width);
	  var urlbar_results = 8;
	  
	  if(parseInt(Services.appinfo.version) >= 70)
	    urlbar_width = urlbar_width - 2;
	  
	  try{
	    urlbar_results = Services.prefs.getBranch("browser.urlbar.").getIntPref("maxRichResults");
	  } catch(e){}
	  
	  
	  var fx70_workaround_code = '';
	  
	  if(fx70_workaround && parseInt(Services.appinfo.version) == 70)
		fx70_workaround_code = ' \
			#urlbar .search-one-offs { \
			  display: block !important; \
			} \
			#urlbar .search-panel-header { \
			  display: none !important; \
			} \
			#urlbar .search-panel-one-offs { \
			  display: unset !important; \
			  padding-inline-start: unset !important; \
			  padding-inline-end: unset !important; \
			  margin-inline-start: unset !important; \
			  margin-inline-end: unset !important; \
			} \
		';
	  
	  var hide_visit_search_items_code = '';
	  
	  if(hide_visit_search_items)
		hide_visit_search_items_code = '\
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistbox { \
			  min-height: 0 !important; \
			  height: auto !important; \
			} \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem:first-of-type:-moz-any([type*="heuristic"],[actiontype="searchengine"],[actiontype="visiturl"],[actiontype="keyword"],[actiontype="switchtab"]), \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem:-moz-any([type*="heuristic"],[actiontype="searchengine"],[actiontype="visiturl"],[actiontype="keyword"],[actiontype="switchtab"]), \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem[anonid="type-icon-spacer"], \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem:first-of-type[actiontype="visiturl"] + richlistitem[actiontype="searchengine"], \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem:first-of-type:last-of-type[actiontype="searchengine"] { \
			  z-index: -1000000000 !important; \
			  position: fixed !important; \
			  opacity: 0 !important; \
			  visibility: collapse !important; \
			  min-height: 0 !important; \
			  height: 0 !important; \
			  max-height: 0 !important; \
			} \
			#urlbar-results .urlbarView-row:not([collapsed="true"]) + .urlbarView-row:-moz-any([type*="heuristic"],[type="search"],[type="visiturl"],[type="keyword"],[type="switchtab"]), \
			#urlbar-results .urlbarView-row:-moz-any([type*="heuristic"],[type="search"],[type="visiturl"],[type="keyword"],[type="switchtab"]) + .urlbarView-row:-moz-any([type*="heuristic"],[type="search"],[type="visiturl"],[type="keyword"],[type="switchtab"]), \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem:not([collapsed="true"]) + richlistitem:-moz-any([type*="heuristic"],[actiontype="searchengine"],[actiontype="visiturl"],[actiontype="keyword"],[actiontype="switchtab"]), \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem:-moz-any([type*="heuristic"],[actiontype="searchengine"],[actiontype="visiturl"],[actiontype="keyword"],[actiontype="switchtab"]) + richlistitem:-moz-any([type*="heuristic"],[actiontype="searchengine"],[actiontype="visiturl"],[actiontype="keyword"],[actiontype="switchtab"]) { \
			  display: none !important; \
			} \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] > richlistbox { \
			  overflow: auto !important; \
			} \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] > richlistbox { \
			  overflow-x: hidden !important; \
			} \
			#urlbar-results scrollbox, \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] > richlistbox, \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] scrollbox, \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] > .autocomplete-richlistbox { \
			  overflow-y: auto !important; \
			} \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem:first-of-type:-moz-any([type*="heuristic"],[actiontype="searchengine"],[actiontype="visiturl"],[actiontype="keyword"]), \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] richlistitem[anonid="type-icon-spacer"] { \
			  display: none !important; \
			} \
			#urlbar-results .urlbarView-body-outer { \
			  min-height: 0 !important; \
			  height: auto !important; \
			} \
			#urlbar-results .urlbarView-row:first-of-type:-moz-any([type*="heuristic"],[type="search"],[type="visiturl"],[type="keyword"],[type="switchtab"]), \
			#urlbar-results .urlbarView-row:-moz-any([type*="heuristic"],[type="search"],[type="visiturl"],[type="keyword"],[type="switchtab"]), \
			#urlbar-results .urlbarView-row[anonid="type-icon-spacer"], \
			#urlbar-results .urlbarView-row:first-of-type[type="visiturl"] + .urlbarView-row[type="search"], \
			#urlbar-results .urlbarView-row:first-of-type:last-of-type[type="search"] { \
			  z-index: -1000000000 !important; \
			  position: fixed !important; \
			  opacity: 0 !important; \
			  visibility: collapse !important; \
			  min-height: 0 !important; \
			  height: 0 !important; \
			  max-height: 0 !important; \
			} \
		  \
		';
	  
	  var move_bookmarks_star_to_the_end_code = '';
	  
	  if(move_bookmarks_star_to_the_end)
		 move_bookmarks_star_to_the_end_code = ' \
			/* move bookmarks star and other icon to items right */ \
			#urlbar-results .urlbarView-row .urlbarView-type-icon{ \
			  -moz-margin-start: calc( '+urlbar_width+'px - 38px ) !important; \
			} \
			 \
			/* Position of type icon (bookmark, switch-to-tab...) */ \
			#urlbar-results .urlbarView-row .urlbarView-type-icon { \
			  top: 6px !important; \
			  bottom: unset !important; \
			} \
			\
			/* Tags */ \
			#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-tags { \
			  right: 30px !important; \
			} \
			#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-tags { \
			  left: 30px !important; \
			} \
	 ';
	  
	  var item_height = 45;
	  
	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
		\
		:root { \
		  --ac_jspopup_width: '+urlbar_width+'px; \
		  --ac_jspopup_number_of_results: '+urlbar_results+'; \
		  --ac_jspopup_item_height: '+item_height+'px; \
		  --ac_jspopup_maxheight: '+(window.innerHeight-150)+'px; \
		  --ac_jspopup_height: auto; \
		} \
		#urlbar-results { \
		  --item-padding-start: 0 !important; \
		  --item-padding-end: 0 !important; \
		} \
		.urlbarView:not(.megabar) { \
		  left: unset !important; \
		  right: unset !important; \
		  border: 1px solid ThreeDShadow !important; \
		} \
		#urlbar-input-container + .urlbarView:not(.megabar){ \
		  margin-top: -6px !important; \
		} \
		#urlbar:not(.megabar) .search-one-offs { \
		  padding-inline-start: unset !important; \
		  padding-inline-end: unset !important; \
		  background: #ededed !important; \
		} \
		#urlbar-input-container { \
		  --item-padding-start: 0px !important; \
		  --item-padding-end: 0px !important; \
		} \
		#urlbar-results { \
		  left: unset !important; \
		  right: unset !important; \
		  border-block: 0px !important; \
		  padding: 0 !important; \
		  margin-top: 0px !important; \
		} \
		#urlbar-results .urlbarView-body-outer { \
		  border: 1px solid ThreeDShadow !important; \
		} \
		#urlbar-results .search-one-offs { \
		  margin-top: -1px !important; \
		  border: 1px solid ThreeDShadow !important; \
		  background-color: hsla(0,0%,100%,1.0) !important; \
		} \
		.search-setting-button-compact { \
		  margin-left: -2px !important; \
		} \
		/* popup position */ \
		#urlbar-results { \
		  -moz-margin-start: 0px !important; \
		} \
		.urlbarView-title-separator { \
		  display: none !important; \
		} \
		#urlbarView-results { \
		  padding: 0px !important; \
		} \
		 \
		#urlbarView-results { \
		  height: var(--ac_jspopup_height) !important; \
		  max-height: var(--ac_jspopup_maxheight) !important; \
		} \
		#urlbar-results{ \
		  overflow: hidden !important; \
		  overflow-y: visible !important; \
		  height: var(--ac_jspopup_height) !important; \
		  max-height: var(--ac_jspopup_maxheight) !important; \
		} \
		#urlbar-results { \
		  min-width: 0px !important; \
		  width: var(--ac_jspopup_width) !important; \
		  max-width: var(--ac_jspopup_width) !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-title,  \
		#urlbar-results .urlbarView-row .urlbarView-url { \
		  min-width: calc( var(--ac_jspopup_width) - 50px) !important; \
		  width: calc( var(--ac_jspopup_width) - 50px) !important; \
		} \
		#urlbar-results .urlbarView-row { \
		  position: relative !important; \
		  height: 36px !important; \
		  border-radius: 0px !important; \
		  border-bottom-color: transparent !important; \
		  -moz-margin-start: 0 !important; \
		  -moz-padding-start: 0 !important; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row { \
		  left: 0 !important; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row { \
		  right: 0 !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-title { \
		  position: absolute !important; \
		  top: 1px; \
		  font-size: 14px; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-title { \
		  left: 30px; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-title { \
		  right: 30px; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-url, \
		#urlbar-results .urlbarView-row .urlbarView-action { \
		  position: absolute !important; \
		  top: 24px; \
		  font-size: 12px; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-url, \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-action { \
		  left: 30px; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-url, \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-action { \
		  right: 30px; \
		} \
		 \
		#urlbar-results .urlbarView-row .urlbarView-tags { \
		  position: absolute !important; \
		  top: 3px; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-tags { \
		  right: 4px; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-tags { \
		  left: 4px; \
		} \
		 \
		#urlbar-results .urlbarView-title-separator {  \
		  display: none !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-type-icon { \
		  position: absolute !important; \
		  bottom: 8px !important; \
		  left: 4px !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-favicon { \
		  position: absolute !important; \
		  top: 4px !important; \
		  left: 4px !important; \
		} \
		#urlbar-results .urlbarView-row[selected=true] { \
		  background-color: Highlight !important; \
		} \
		#urlbarView-results .urlbarView-row[selected] .urlbarView-title,  \
		#urlbarView-results .urlbarView-title[selected], \
		#urlbarView-results .urlbarView-row[selected] .urlbarView-url,  \
		#urlbarView-results .urlbarView-url[selected], \
		#urlbarView-results .urlbarView-row[selected] .urlbarView-action, \
		#urlbarView-results .urlbarView-action[selected], \
		#urlbarView-results .urlbarView-row[selected] .ac-separator, \
		#urlbarView-results .ac-separator[selected] { \
		  color: HighlightText !important; \
		} \
		#urlbar-results .urlbarView-row[type="search"] .urlbarView-action,  \
		#urlbar-results .urlbarView-row[type="search"]:not([selected]):not(:hover) .urlbarView-action { \
		  display: block !important; \
		  visibility: visible !important; \
		} \
		#urlbar-results .urlbarView-row { \
		  border-inline-end: 0px solid transparent !important; \
		} \
		#urlbar-results > .urlbarView-body-outer { \
		  overflow-x: hidden !important; \
		} \
		 \
		#urlbar-results > .urlbarView-body-outer, \
		#urlbar-results scrollbox, \
		#urlbar-results > .urlbarView-body-outer { \
		  overflow-y: auto !important; \
		} \
		#urlbar .search-one-offs { \
		  padding-top: 0px !important; \
		  padding-bottom: 0px !important; \
		  width: var(--ac_jspopup_width) !important; \
		  max-width: var(--ac_jspopup_width) !important; \
		} \
		 \
		'+fx70_workaround_code+' \
		'+hide_visit_search_items_code+' \
		'+move_bookmarks_star_to_the_end_code+' \
	  '), null, null);
	  

	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) sss.unregisterSheet(uri,sss.AGENT_SHEET);

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	}
	  
  } catch(e){}
},1000);
