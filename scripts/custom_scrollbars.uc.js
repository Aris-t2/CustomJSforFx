"use strict";

/* Firefox userChrome.js tweaks - 'Custom Scrollbars' for Firefox
   https://github.com/Aris-t2/CustomJSforFx/blob/master/scripts/custom_scrollbars.uc.js

   Version: 2.0.5 for Firefox 115+
   
   NOTE: 'non-compatible options' from earlier versions were removed

   README
  
   about:config >
       widget.windows.overlay-scrollbars.enabled > false (Windows)
       widget.gtk.overlay-scrollbars.enabled > false (Linux)
   [!] The above preferences have to be set to 'false' for this code to work
 
   [!] STARTUP CACHE HAS TO BE DELETED AFTER EVERY CHANGE!
   -> finding 'startupCache' folder: address bar > about:profiles > Local Directory > Open Folder > startupCache
   -> close Firefox
   -> delete 'startupCache' folders content
 
   Modifying appearance > change values
   - enable/disable options: true <-> false
   - color
     - name: red, blue, transparent 
     - hex code: #33CCFF, #FFF
     - rgb(a): rgba(0,0,255,0.8)
     - hsl(a): hsla(240,100%,50%,0.8)
   - numbers: 1, 2, 3 ... 10, 11, 12 ...
   - opacity: 0.0 to 1.0 e.g. 1.4, 1,75
   - gradients: linear-gradient(direction, color, color, color)
   - gradients example: linear-gradient(to right, blue, #33CCFF, rgba(0,0,255,0.8))
   - predefined gradients: transparent,rgba(255,255,255,0.5),transparent -> transparent,rgba(255,255,255,0.0),transparent
   - no color or no color value -> use "unset"
   - arrow icons
	  - files have to be downloaded from https://github.com/Aris-t2/CustomJSforFx/tree/master/icons
	  - files have to be placed inside 'icons' (sub)folder --> 'chrome\icons'
	  - own svg files can also be used, if they are named up.svg, down.svg, left.svg, right.svg
 
*/

(function() {


  /* General scrollbar settings *******************************************************/

  // default: hide_scrollbars = false
  const hide_scrollbars = false;

  // default: hide_scrollbar_buttons = false
  const hide_scrollbar_buttons = false;

  // default: thin_scrollbars = false / browsers own way to show thin scrollbars
  const thin_scrollbars = false;

  // default: custom_scrollbar_opacity = false
  const custom_scrollbar_opacity = false;

  // default: custom_opacity_value = "1.0"
  const custom_opacity_value = "1.0";


  /* Custom scrollbar settings ("custom_scrollbar_" --> "cs_") ************************/
  
  // default: custom_scrollbars = true
  const custom_scrollbars = true;
  
  // default: custom_scrollbar_arrows = true
  const custom_scrollbar_arrows = true;
  
  // default: custom_scrollbar_arrows_version = 1
  //  1 ==> SVG arrows as code: might not work on some pages
  //  2 ==> SVG arrows as files: files have to be downloaded from
  //        https://github.com/Aris-t2/CustomJSforFx/tree/master/icons
  //        and placed inside 'chrome\icons' folder
  const custom_scrollbar_arrows_version = 1;
  
  // default: custom_scrollbar_arrows_color = "grey"; / # ==> %23 e.g. #33CCFF ==> %2333CCFF
  // only for 'custom_scrollbar_arrows_version = 1'
  const custom_scrollbar_arrows_color = "grey";
  
  // default: cs_thumb_border = 0 / in px
  const cs_thumb_border = 0;
  
  // default: cs_thumb_roundness = 0 / in px
  const cs_thumb_roundness = 0;
 
  // default: cs_buttons_border = 0 / in px
  const cs_buttons_border = 0;

  // default: cs_buttons_roundness = 0 / in px
  const cs_buttons_roundness = 0;

  // default: cs_ignore_color_gradients = false / 'flat' scrollbars
  const cs_ignore_color_gradients = false; 
  

  /* Custom scrollbar colors and gradients ********************************************/
  
  // default: cs_background_color = "#DDDDDD"
  const cs_background_color = "#DDDDDD";

  // default: cs_background_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_background_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_background_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_background_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_corner_background_color = "#DDDDDD" / - corner
  const cs_corner_background_color = "#DDDDDD";
  
  // default: cs_corner_background_image = "linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%),linear-gradient(-45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%)"
  let cs_corner_background_image = "linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%),linear-gradient(-45deg,transparent 30%,rgba(255,255,255,0.5) 50%,transparent 70%)";

  // default: cs_thumb_color = "#33CCFF" / thumb/slider
  const cs_thumb_color = "#33CCFF";
  
  // default: cs_thumb_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"; 
  
  // default: cs_thumb_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"; 
  
  // default: cs_thumb_hover_color = "#66FFFF"
  const cs_thumb_hover_color = "#66FFFF";
  
  // default: cs_thumb_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_thumb_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_thumb_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_thumb_border_color = "#33CCFF"
  const cs_thumb_border_color = "#33CCFF";
  
  // default: cs_buttons_color = "#66FFFF" / buttons
  const cs_buttons_color = "#66FFFF";
  
  // default: cs_buttons_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)";

  // default: cs_buttons_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_buttons_hover_color = "#33CCFF"
  const cs_buttons_hover_color = "#33CCFF";
  
  // default: cs_buttons_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_hover_image_vertical = "linear-gradient(to right,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_buttons_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)"
  let cs_buttons_hover_image_horizontal = "linear-gradient(to bottom,transparent,rgba(255,255,255,0.5),transparent)";
  
  // default: cs_buttons_border_color = "#33CCFF"
  const cs_buttons_border_color = "#33CCFF";


/* ******************************************************************************************** */
/* ******************************************************************************************** */

  let ProfilePathChrome = PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir, 'chrome'));

  // unset background image color gradients -> flat scrollbars
  if(cs_ignore_color_gradients === true)
	cs_background_image_vertical
	= cs_background_image_horizontal
	= cs_corner_background_image
	= cs_thumb_image_vertical
	= cs_thumb_image_horizontal
	= cs_thumb_hover_image_vertical
	= cs_thumb_hover_image_horizontal
	= cs_buttons_image_vertical
	= cs_buttons_image_horizontal
	= cs_buttons_hover_image_vertical
	= cs_buttons_hover_image_horizontal
	= "unset";


  let custom_scrollbars_code='';
  let custom_scrollbar_arrows_code='';
  let hide_scrollbar_buttons_code='';
  let custom_scrollbar_opacity_code='';
  let hide_scrollbars_code='';
  let thin_scrollbars_code='';
  
  if(custom_scrollbars === true)
	custom_scrollbars_code=`
		slider, scrollcorner, scrollbar thumb, scrollbar scrollbarbutton {
		  appearance: auto;
		  -moz-default-appearance: none !important;
		}
		slider {
		  background-color: ${cs_background_color} !important;
		}
		scrollbar[orient="vertical"] slider {
		  background-image: ${cs_background_image_vertical} !important;
		}
		scrollbar[orient="horizontal"] slider {
		  background-image: ${cs_background_image_horizontal} !important;
		}
		scrollcorner {
		  background-color: ${cs_corner_background_color} !important;
		  background-image: ${cs_corner_background_image} !important;
		}
		scrollbar thumb {
		  background-color: ${cs_thumb_color} !important;
		  border-radius: ${cs_thumb_roundness}px !important;
		  box-shadow: inset 0 0 0 ${cs_thumb_border}px ${cs_thumb_border_color} !important;
		}
		scrollbar thumb[orient="vertical"] {
		  background-image: ${cs_thumb_image_vertical} !important;
		  min-height: 17px !important;
		}
		scrollbar thumb[orient="horizontal"] {
		  background-image: ${cs_thumb_image_horizontal} !important;
		  min-width: 17px !important;
		}
		scrollbar thumb:hover, scrollbar thumb:active {
		  background-color: ${cs_thumb_hover_color} !important;
		}
		scrollbar thumb[orient="vertical"]:hover, scrollbar thumb[orient="vertical"]:active {
		  background-image: ${cs_thumb_hover_image_vertical} !important;
		}
		scrollbar thumb[orient="horizontal"]:hover, scrollbar thumb[orient="horizontal"]:active {
		  background-image: ${cs_thumb_hover_image_horizontal} !important;
		}
		scrollbar scrollbarbutton {
		  background-color: ${cs_buttons_color} !important;
		  border-radius: ${cs_buttons_roundness}px !important;
		  box-shadow: inset 0 0 0 ${cs_buttons_border}px ${cs_buttons_border_color} !important;
		  height: 17px !important;
		  width: 17px !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton {
		  background-image: ${cs_buttons_image_vertical} !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton {
		  background-image: ${cs_buttons_image_horizontal} !important;
		}
		scrollbar scrollbarbutton:hover {
		  background-color: ${cs_buttons_hover_color} !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton:hover {
		  background-image: ${cs_buttons_hover_image_vertical} !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton:hover {
		  background-image: ${cs_buttons_hover_image_horizontal} !important;
		}
	`;
	
  if(custom_scrollbar_arrows === true && custom_scrollbar_arrows_version === 1)
	custom_scrollbar_arrows_code=`
		scrollbar scrollbarbutton {
		  background-repeat: no-repeat !important;
		  background-position: center center !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton[type="decrement"] {
		  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${custom_scrollbar_arrows_color}' %3E%3Cpath d='m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z'/%3E%3C/svg%3E ") !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton[type="increment"] {
		  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${custom_scrollbar_arrows_color}' %3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E ") !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton[type="decrement"] {
		  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${custom_scrollbar_arrows_color}' %3E%3Cpath d='m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z'/%3E%3C/svg%3E ") !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton[type="increment"] {
		  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='${custom_scrollbar_arrows_color}' %3E%3Cpath d='m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z'/%3E%3C/svg%3E ") !important;
		}

	`;
  else if(custom_scrollbar_arrows === true && custom_scrollbar_arrows_version === 2)
	custom_scrollbar_arrows_code=`
		scrollbar scrollbarbutton {
		  background-repeat: no-repeat !important;
		  background-position: center center !important;
		}
		scrollbar[orient="vertical"] > scrollbarbutton[type="decrement"] {
		  background-image: url("${ProfilePathChrome}/icons/up.svg") !important;
		}
		scrollbar[orient="vertical"] > scrollbarbutton[type="increment"] {
		  background-image: url("${ProfilePathChrome}/icons/down.svg") !important;
		}
		scrollbar[orient="horizontal"] > scrollbarbutton[type="decrement"] {
		  background-image: url("${ProfilePathChrome}/icons/left.svg") !important;
		}
		scrollbar[orient="horizontal"] > scrollbarbutton[type="increment"] {
		  background-image: url("${ProfilePathChrome}/icons/right.svg") !important;
		}
	`;

  if(hide_scrollbar_buttons === true)
	hide_scrollbar_buttons_code=`
		scrollbar scrollbarbutton {
		  opacity: 0 !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton {
		  min-height: 1px !important;
		  height: 1px !important;
		  max-height: 1px !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton {
		  min-width: 1px !important;
		  width: 1px !important;
		  max-width: 1px !important;
		}
	`;
	
  if(custom_scrollbar_opacity === true)
	custom_scrollbar_opacity_code=`
		scrollbar {
		  opacity: ${custom_opacity_value} !important;
		}
	`;
  
  if(hide_scrollbars === true)
	hide_scrollbars_code=`
		scrollbar, scrollcorner {
		  display: none !important;
		  visibility: collapse !important;
		}
	`;
  
  if(thin_scrollbars === true)
	thin_scrollbars_code=`
		:root{
		  scrollbar-width: thin !important;
		}
		scrollbar[orient="vertical"] scrollbarbutton {
		  height: 14px !important;
		  width: 7px !important;
		}
		scrollbar[orient="horizontal"] scrollbarbutton {
		  height: 7px !important;
		  width: 14px !important;
		}
	`;

  Components.classes["@mozilla.org/content/style-sheet-service;1"]
    .getService(Components.interfaces.nsIStyleSheetService)
	  .loadAndRegisterSheet(Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
		${custom_scrollbars_code}
		${custom_scrollbar_arrows_code}
		${hide_scrollbar_buttons_code}
		${custom_scrollbar_opacity_code}
		${hide_scrollbars_code}
		${thin_scrollbars_code}
  `), null, null),
  Components.classes["@mozilla.org/content/style-sheet-service;1"]
    .getService(Components.interfaces.nsIStyleSheetService).AGENT_SHEET);


})();
