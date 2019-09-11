// 'Classic autocomplete popup with two lined results' script for Firefox 60-67 by Aris
// CSS code based on https://github.com/Aris-t2/CustomCSSforFx/blob/master/classic/css/locationbar/ac_popup_classic_with_url_only_fx64.css
// popup width gets adjusted automatically when switching between normal, maximized and fullscreen window modes
// popup width does not get adjusted automatically when switchting between compact, normal and touch toolbar modes

// [!] option: 'Visit...' and 'Search with...' items can be hidden using 'hide_visit_search_items' variable
// [!] option: type icons like boomarks star, switch to tab etc. can be moved to the right using 'move_bookmarks_star_to_the_end' variable


var {Services} = Components.utils.import("resource://gre/modules/Services.jsm", {});
var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

var hide_visit_search_items = false;
var move_bookmarks_star_to_the_end = true;

setTimeout(function(){
  try{
	
	classicAcpopup();
	
	var observer = new MutationObserver(function(mutations) {
	  mutations.forEach(function(mutation) {
		classicAcpopup();
	  });    
	});
	
	observer.observe(document.getElementById("main-window"), { attributes: true, attributeFilter: ['sizemode'] });
	
	function classicAcpopup(event){
	
	  var urlbar_width = Math.round(document.getElementById("urlbar").getBoundingClientRect().width);
	  var urlbar_results = 8;
  
	  try{
	    urlbar_results = Services.prefs.getBranch("browser.urlbar.").getIntPref("maxRichResults");
	  } catch(e){}
	  
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
			#urlbar-results .urlbarView-row .urlbarView-type-icon, \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-type-icon { \
			  -moz-margin-start: '+ (urlbar_width-40) +'px !important; \
			} \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-site-icon { \
			  -moz-margin-start: -'+ (urlbar_width-10) +'px !important; \
			} \
			#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-type-icon { \
			  margin-bottom: 20px !important; \
			} \
			#urlbar-results .urlbarView-row .urlbarView-type-icon { \
			  top: 6px !important; \
			  bottom: unset !important; \
			} \
	 ';
	 
	  var item_height = '47.5';
	  
	  if(parseInt(Services.appinfo.version) >= 69) item_height = '36';

	  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
		\
		#urlbar-results, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] { \
		  --item-padding-start: 0 !important; \
		  --item-padding-end: 0 !important; \
		} \
		#urlbar-results { \
		  -moz-margin-start: 0px !important; \
		  margin-top: -4px !important; \
		  border-block: 0px !important; \
		} \
		#urlbar-results, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] { \
		  min-width: '+urlbar_width+'px !important; \
		  width: '+urlbar_width+'px !important; \
		  max-width: '+urlbar_width+'px !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-title, \
		#urlbar-results .urlbarView-row .urlbarView-url, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-title-text, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-url-text { \
		  min-width: calc( '+urlbar_width+' - 50px) !important; \
		  width: calc( '+urlbar_width+' - 50px) !important; \
		  max-width: calc( '+urlbar_width+' - 50px) !important; \
		} \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] { \
		  -moz-margin-start: 0 !important; \
		  margin-top: -5px !important; \
		} \
		#urlbarView-results, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistbox { \
		  padding: 0 !important; \
		} \
		#urlbarView-results, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistbox { \
		  height: auto !important; \
		  max-height: calc(47.5px * '+urlbar_results+') !important; \
		} \
		#urlbar-results { \
		  max-height: calc(47.5px * '+urlbar_results+') !important; \
		} \
		#urlbar-results .urlbarView-row, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem { \
		  position: relative !important; \
		  height: '+item_height+'px !important; \
		  border-radius: 0px !important; \
		  border-bottom-color: transparent !important; \
		  -moz-margin-start: 0 !important; \
		  -moz-padding-start: 0 !important; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(ltr) .autocomplete-richlistitem { \
		  left: 0 !important; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(rtl) .autocomplete-richlistitem { \
		  right: 0 !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-title,  \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-title { \
		  position: absolute !important; \
		  top: 1px; \
		  font-size: 14px; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-title, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(ltr) .autocomplete-richlistitem .ac-title { \
		  left: 30px; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-title, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(rtl) .autocomplete-richlistitem .ac-title { \
		  right: 30px; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-url, \
		#urlbar-results .urlbarView-row .urlbarView-action, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-url, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-action { \
		  position: absolute !important; \
		  top: 24px; \
		  font-size: 12px; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-url, \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-action, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(ltr) .autocomplete-richlistitem .ac-url, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(ltr) .autocomplete-richlistitem .ac-action { \
		  left: 30px; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-url, \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-action, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(rtl) .autocomplete-richlistitem .ac-url, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(rtl) .autocomplete-richlistitem .ac-action { \
		  right: 30px; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-tags, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-tags { \
		  position: absolute !important; \
		  top: 3px; \
		} \
		#urlbar-results:-moz-locale-dir(ltr) .urlbarView-row .urlbarView-tags, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(ltr) .autocomplete-richlistitem .ac-tags { \
		  right: 40px; \
		} \
		#urlbar-results:-moz-locale-dir(rtl) .urlbarView-row .urlbarView-tags, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"]:-moz-locale-dir(rtl) .autocomplete-richlistitem .ac-tags { \
		  left: 40px; \
		} \
		#urlbar-results .urlbarView-title-separator, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem spacer, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-separator {  \
		  display: none !important; \
		} \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-type-icon { \
		  margin-bottom: -20px !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-type-icon { \
		  position: absolute !important; \
		  bottom: 12px !important; \
		  left: 4px !important; \
		} \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem .ac-site-icon { \
		  -moz-margin-start: -22px !important; \
		  margin-top: -20px !important; \
		} \
		#urlbar-results .urlbarView-row .urlbarView-favicon { \
		  position: absolute !important; \
		  top: 6px !important; \
		  left: 4px !important; \
		} \
		#urlbar-results .urlbarView-row[selected=true], \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem[selected=true] { \
		  background-color: Highlight !important; \
		} \
		#urlbarView-results .urlbarView-row[selected] .urlbarView-title,  \
		#urlbarView-results .urlbarView-title[selected], \
		#urlbarView-results .urlbarView-row[selected] .urlbarView-url,  \
		#urlbarView-results .urlbarView-url[selected], \
		#urlbarView-results .urlbarView-row[selected] .urlbarView-action, \
		#urlbarView-results .urlbarView-action[selected], \
		#urlbarView-results .urlbarView-row[selected] .ac-separator, \
		#urlbarView-results .ac-separator[selected], \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem[selected=true] .ac-action-text, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem[selected=true] .ac-title,  \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .ac-title[selected], \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem[selected=true] .ac-url,  \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .ac-url[selected], \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem[selected=true] .ac-action, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .ac-action[selected], \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem[selected=true] .ac-separator, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .ac-separator[selected] { \
		  color: HighlightText !important; \
		} \
		#urlbar-results .urlbarView-row[type="search"] .urlbarView-action,  \
		#urlbar-results .urlbarView-row[type="search"]:not([selected]):not(:hover) .urlbarView-action, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem:not([selected]):not(:hover) > .ac-action[actiontype=searchengine] { \
		  display: block !important; \
		  visibility: visible !important; \
		} \
		#urlbar-results .urlbarView-row , \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] .autocomplete-richlistitem { \
		  border-inline-end: 0px solid transparent !important; \
		} \
		#urlbar-results > .urlbarView-body-outer, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] > richlistbox { \
		  overflow-x: hidden !important; \
		} \
		#urlbar-results > .urlbarView-body-outer, \
		#urlbar-results scrollbox, \
		#urlbar-results > .urlbarView-body-outer, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] > richlistbox, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] scrollbox, \
		#PopupAutoCompleteRichResult[autocompleteinput="urlbar"] > .autocomplete-richlistbox { \
		  overflow-y: auto !important; \
		} \
		'+hide_visit_search_items_code+' \
		'+move_bookmarks_star_to_the_end_code+' \
	  '), null, null);
	  

	  if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) sss.unregisterSheet(uri,sss.AGENT_SHEET);

	  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	}
	  
  } catch(e){}
},1000);
