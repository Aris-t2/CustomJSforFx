//

var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

/* Tabs toolbar position */
var tabs_toolbar_position = 1;
// 0 = 'tabs on top' - default
// 1 = "tabs below top toolbars"
// 2 = "tabs below browser content"
var multirow_tabs = true;
var multirow_tabs_max_lines = 3;
var multirow_tabs_tab_min_width = '100px';
var multirow_tabs_tab_max_width = '250px';

var Tabstoolbar = {
  init: function() {
	  
	try {
	  
	  if(tabs_toolbar_position == 1) {
		document.getElementById("main-window").setAttribute("tabsnotontop","true");
		document.getElementById("navigator-toolbox").appendChild(document.getElementById("TabsToolbar"));
	  }
	  else if(tabs_toolbar_position == 2) {
	    document.getElementById("main-window").setAttribute("tabsnotontop","true");
	    document.getElementById("browser-bottombox").appendChild(document.getElementById("TabsToolbar"));
	  }

	} catch(e) {}
	
	if(multirow_tabs) this.zzzz_MultiRowTabLite();
	
	var multirow_tabs_code = '';
	
	if(multirow_tabs)
	  multirow_tabs_code ='\
	  \
		:root{ \
		  --tabs-lines: '+multirow_tabs_max_lines+'; \
		  --tab_min_width_mlt: '+multirow_tabs_tab_min_width+'; \
		  --tab_max_width_mlt: '+multirow_tabs_tab_max_width+'; \
		  --tab-min-height_mlt: var(--tab-min-height,32px); /* set own value here, if used without configuration files */ \
		} \
		#tabbrowser-tabs{ \
		  min-height: unset !important; \
		  padding-inline-start: 0px !important \
		} \
		/* Test for Firefox > 66 */ \
		@supports (inset-block:auto){ \
		  #tabbrowser-tabs > .tabbrowser-arrowscrollbox > .arrowscrollbox-scrollbox { \
			display: flex; \
			flex-wrap: wrap; \
			overflow-y: auto; \
			max-height: calc(var(--tab-min-height_mlt) * var(--tabs-lines)); \
		  } \
		  #tabbrowser-tabs > .tabbrowser-arrowscrollbox { \
			overflow: -moz-hidden-unscrollable; \
			display: block; \
			margin-bottom:-1px !important; \
		  } \
		} \
		/* Test for Firefox < 66 */ \
		@supports not (inset-block:auto){ \
		  #tabbrowser-tabs > .tabbrowser-arrowscrollbox { \
			min-height: unset !important; \
		  } \
		  #tabbrowser-tabs .scrollbox-innerbox { \
			display: flex; \
			flex-wrap: wrap; \
		  } \
		  #tabbrowser-tabs .arrowscrollbox-scrollbox { \
			overflow: -moz-hidden-unscrollable; \
			display: block; \
		  } \
		} \
		.tabbrowser-tab{ \
		  height: var(--tab-min-height_mlt); \
		} \
		#tabbrowser-tabs .tabbrowser-tab[pinned]{ \
		  position: static !important; \
		  margin-inline-start: 0px !important; \
		} \
		.tabbrowser-tab[fadein]:not([pinned]) { \
		  flex-grow: 1; \
		  min-width: var(--tab_min_width_mlt) !important; \
		  max-width: var(--tab_max_width_mlt) !important; \
		} \
		.tabbrowser-tab > stack{ \
		  width: 100%; \
		  height: 100%; \
		} \
		#tabbrowser-tabs .scrollbutton-up, \
		#tabbrowser-tabs .scrollbutton-down, \
		#alltabs-button, \
		:root:not([customizing]) #TabsToolbar #new-tab-button, \
		#tabbrowser-tabs spacer, \
		.tabbrowser-tab::after{ \
		  display: none !important; \
		} \
		#tabbrowser-tabs[overflow="true"] > .tabbrowser-arrowscrollbox > .tabs-newtab-button, \
		#tabbrowser-tabs:not([hasadjacentnewtabbutton]) > .tabbrowser-arrowscrollbox > .tabs-newtab-button, \
		#TabsToolbar[customizing="true"] #tabbrowser-tabs > .tabbrowser-arrowscrollbox > .tabs-newtab-button { \
		  visibility: hidden !important; \
		} \
		/* hide private window indicator, window controls and titlebar placeholders */ \
		#main-window[tabsintitlebar] #TabsToolbar .private-browsing-indicator, \
		#main-window[tabsintitlebar] #TabsToolbar #window-controls, \
		#main-window[tabsintitlebar] #TabsToolbar .titlebar-spacer[type="pre-tabs"], \
		#main-window[tabsintitlebar] #TabsToolbar .titlebar-spacer[type="post-tabs"] { \
		  display: none !important; \
		} \
		#TabsToolbar .titlebar-placeholder[type="pre-tabs"], \
		#TabsToolbar .titlebar-placeholder[type="post-tabs"] { \
		  opacity: 0 !important; \
		} \
		.tabbrowser-tab::after, \
		.tabbrowser-tab::before { \
		  border-left: unset !important; \
		  border-image: unset !important; \
		  border-image-slice: unset !important; \
		  border: 0 !important; \
		} \
		/* Fx66+ tab close fix */ \
		#TabsToolbar #tabbrowser-tabs .tabbrowser-tab:not([pinned]) .tab-close-button { \
		  visibility: visible !important; \
		  display: block !important; \
		} \
		#TabsToolbar #tabbrowser-tabs .tabbrowser-tab[pinned] .tab-close-button { \
		  visibility: hidden !important; \
		  display: block !important; \
		  -moz-margin-start: -18px !important; \
		} \
		/* fix scrollbar */ \
		#main-window[tabsintitlebar] #tabbrowser-tabs { \
		  -moz-window-dragging: no-drag !important; \
		} \
		/*lw theme fix */ \
		#main-window:-moz-lwtheme { \
		  background: var(--lwt-header-image) !important; \
		  background-repeat: repeat-y !important; \
		} \
	  \
	  ';
	
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
		\
		#main-window[tabsnotontop="true"] #toolbar-menubar .titlebar-buttonbox-container, \
		#main-window[tabsnotontop="true"] #TabsToolbar .titlebar-spacer[type="pre-tabs"], \
		#main-window[tabsnotontop="true"] #TabsToolbar .titlebar-spacer[type="post-tabs"] { \
		  display: none !important; \
		} \
		#main-window[tabsnotontop="true"][tabsintitlebar]:not([sizemode="fullscreen"]):not([inDOMFullscreen="true"]) #TabsToolbar .titlebar-buttonbox-container { \
		  position: fixed !important; \
		  top: 0 !important; \
		  right: 0 !important; \
		  visibility: visible !important; \
		  display: block !important; \
		}\
		#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"] #TabsToolbar #window-controls { \
		  position: absolute !important; \
		  display: block !important; \
		  top: 0 !important; \
		  right: 0 !important; \
		  z-index: 1000 !important; \
		} \
		#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"] #nav-bar { \
		  -moz-padding-end: 42px !important; \
		} \
		#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"] #TabsToolbar #window-controls toolbarbutton, \
		#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"] #TabsToolbar #window-controls toolbarbutton .toolbarbutton-icon { \
		  padding: 0 !important; \
		  margin: 0 !important; \
		} \
		#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"] #TabsToolbar #window-controls toolbarbutton:hover .toolbarbutton-icon { \
		  background: rgba(0,0,0,.2) !important; \
		} \
		@media (-moz-os-version: windows-win10) { \
			#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"] #TabsToolbar #window-controls *, \
			#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"]:-moz-lwtheme:-moz-lwtheme-darktext #TabsToolbar #window-controls * { \
			  color: black !important; \
			  fill: black !important; \
			} \
			#main-window[tabsnotontop="true"]:not([inDOMFullscreen="true"])[sizemode="fullscreen"]:-moz-lwtheme #TabsToolbar #window-controls * { \
			  color: white !important; \
			  fill: white !important; \
			} \
		} \
		#main-window[tabsnotontop="true"] #nav-bar, \
		#main-window[tabsnotontop="true"] #navigator-toolbox { \
		  border-top: 0 !important; \
		  box-shadow: unset !important; \
		} \
		#main-window[tabsnotontop="true"] #navigator-toolbox:-moz-lwtheme toolbar { \
		  background-color: unset !important; \
		} \
		#main-window[tabsnotontop="true"] #TabsToolbar:not(:-moz-lwtheme) { \
		  background-color: var(--toolbar-non-lwt-bgcolor) !important; \
		} \
		\
		#main-window[tabsnotontop="true"] #TabsToolbar:not(:-moz-lwtheme) #TabsToolbar-customization-target * { \
		  color: var(--toolbar-non-lwt-textcolor) !important; \
		} \
		#main-window[tabsnotontop="true"] #TabsToolbar:not(:-moz-lwtheme) .tabbrowser-tab:hover > .tab-stack > .tab-background:not([selected=true]) { \
		  background-color: var(--toolbarbutton-hover-background) !important; \
		} \
		'+multirow_tabs_code+'\
	'), null, null);
	  
	// remove old style sheet, before registering the new one
	if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) { sss.unregisterSheet(uri,sss.AGENT_SHEET); }
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

  },
  
  
	zzzz_MultiRowTabLite: function() {

		gBrowser.tabContainer._getDropIndex = function(event, isLink) {
			var tabs = this.childNodes;
			var tab = this._getDragTargetTab(event, isLink);
			if (window.getComputedStyle(this).direction == "ltr") {
				for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
					let boxObject = tabs[i].boxObject;
					if (event.screenX < boxObject.screenX + boxObject.width / 2
					 && event.screenY < boxObject.screenY + boxObject.height) // multirow fix
						return i;
				}
			} else {
				for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
					let boxObject = tabs[i].boxObject;
					if (event.screenX > boxObject.screenX + boxObject.width / 2
					 && event.screenY < boxObject.screenY + boxObject.height) // multirow fix
						return i;
				}
			}
			return tabs.length;
		};
		// This sets when to apply the fix (by default a new row starts after the 23th open tab, unless you changed the min-size of tabs)
		gBrowser.tabContainer.ondragstart = function(){if(gBrowser.tabContainer.childNodes.length >= (window.innerWidth - 200) / 75) {

		gBrowser.tabContainer._getDropEffectForTabDrag = function(event){return "";}; // multirow fix: to make the default "dragover" handler does nothing
		gBrowser.tabContainer._onDragOver = function(event) {
			event.preventDefault();
			event.stopPropagation();

			var ind = this._tabDropIndicator;

			var effects = orig_getDropEffectForTabDrag(event);
			if (effects == "link") {
				let tab = this._getDragTargetTab(event, true);
				if (tab) {
					if (!this._dragTime)
						this._dragTime = Date.now();
					if (!tab.hasAttribute("pending") && // annoying fix
						Date.now() >= this._dragTime + this._dragOverDelay)
						this.selectedItem = tab;
					ind.collapsed = true;
					return;
				}
			}

			var newIndex = this._getDropIndex(event, effects == "link");
			if (newIndex == null)
				return;

			var ltr = (window.getComputedStyle(this).direction == "ltr");
			var rect = this.arrowScrollbox.getBoundingClientRect();
			var newMarginX, newMarginY;
			if (newIndex == this.childNodes.length) {
				let tabRect = this.childNodes[newIndex - 1].getBoundingClientRect();
				if (ltr)
					newMarginX = tabRect.right - rect.left;
				else
					newMarginX = rect.right - tabRect.left;
				newMarginY = tabRect.top + tabRect.height - rect.top - rect.height; // multirow fix
			} else {
				let tabRect = this.childNodes[newIndex].getBoundingClientRect();
				if (ltr)
					newMarginX = tabRect.left - rect.left;
				else
					newMarginX = rect.right - tabRect.right;
				newMarginY = tabRect.top + tabRect.height - rect.top - rect.height; // multirow fix
			}

			ind.collapsed = false;

			newMarginX += ind.clientWidth / 2;
			if (!ltr)
				newMarginX *= -1;

			ind.style.transform = "translate(" + Math.round(newMarginX) + "px," + Math.round(newMarginY) + "px)"; // multirow fix
			ind.style.marginInlineStart = (-ind.clientWidth) + "px";
		};
		gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, true);

		gBrowser.tabContainer.onDrop = function(event) {
			var newIndex;
			var dt = event.dataTransfer;
			var draggedTab;
			if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
				draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
				if (!draggedTab)
					return;
			}
			var dropEffect = dt.dropEffect;
			if (draggedTab && dropEffect == "copy") {}
			else if (draggedTab && draggedTab.parentNode == this) {
				newIndex = this._getDropIndex(event, false);
				if (newIndex > draggedTab._tPos)
					newIndex--;
				gBrowser.moveTabTo(draggedTab, newIndex);
			}
		};
		gBrowser.tabContainer.addEventListener("drop", function(event){this.onDrop(event);}, true);
	}}},

	// copy of the original and overrided _getDropEffectForTabDrag method
	orig_getDropEffectForTabDrag: function(event) {
		var dt = event.dataTransfer;
		if (dt.mozItemCount == 1) {
			var types = dt.mozTypesAt(0);
			// tabs are always added as the first type
			if (types[0] == TAB_DROP_TYPE) {
				let sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
				if (sourceNode instanceof XULElement &&
					sourceNode.localName == "tab" &&
					sourceNode.ownerGlobal.isChromeWindow &&
					sourceNode.ownerDocument.documentElement.getAttribute("windowtype") == "navigator:browser" &&
					sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.parentNode) {
					// Do not allow transfering a private tab to a non-private window
					// and vice versa.
					if (PrivateBrowsingUtils.isWindowPrivate(window) !=
						PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal))
						return "none";

					if (window.gMultiProcessBrowser !=
						sourceNode.ownerGlobal.gMultiProcessBrowser)
						return "none";

					return dt.dropEffect == "copy" ? "copy" : "move";
				}
			}
		}

		if (browserDragAndDrop.canDropLink(event)) {
			return "link";
		}
		return "none";
	}


}

document.addEventListener("DOMContentLoaded", Tabstoolbar.init(), false);
