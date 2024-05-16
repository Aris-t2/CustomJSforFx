// Bookmarks Backup/Restore button script for Firefox 125+ by Aris
// fix by BrokenHeart

(function() {

try {
  //Components.utils.import("resource:///modules/CustomizableUI.jsm");
  ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
  var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
  var RESTORE_FILEPICKER_FILTER_EXT = "*.json;*.jsonlz4";
  
  //ChromeUtils.import("resource://gre/modules/Services.jsm");
  ChromeUtils.defineModuleGetter(this, "MigrationUtils", "resource:///modules/MigrationUtils.jsm");
  ChromeUtils.defineModuleGetter(this, "BookmarkJSONUtils", "resource://gre/modules/BookmarkJSONUtils.jsm");
  ChromeUtils.defineModuleGetter(this, "PlacesBackups", "resource://gre/modules/PlacesBackups.jsm");
  
  CustomizableUI.createWidget({
    id: "uc-bookmarks_backup", // button id
    defaultArea: CustomizableUI.AREA_NAVBAR,
    removable: true,
    label: "Bookmarks Backup", // button title
    tooltiptext: "Bookmarks Backup", // tooltip title
    onClick: function(event) {
      
      if(event.button=='0') {
        let backupsDir = Services.dirsvc.get("Desk", Ci.nsIFile);
        let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
        let fpCallback = function fpCallback_done(aResult) {
          if (aResult != Ci.nsIFilePicker.returnCancel) {
            // There is no OS.File version of the filepicker yet (Bug 937812).
            PlacesBackups.saveBookmarksToJSONFile(fp.file.path)
                         .catch(Cu.reportError);
          }
        };

		fp.init(BrowsingContext.getFromWindow(window), "json", Ci.nsIFilePicker.modeSave);
        fp.appendFilter("json",
                        RESTORE_FILEPICKER_FILTER_EXT);
        fp.defaultString = PlacesBackups.getFilenameForDate();
        fp.defaultExtension = "json";
        fp.displayDirectory = backupsDir;
        fp.open(fpCallback);
      }
    },
    onCreated: function(button) {
      return button;
    }
        
  });
  
  CustomizableUI.createWidget({
    id: "uc-bookmarks_restore", // button id
    defaultArea: CustomizableUI.AREA_NAVBAR,
    removable: true,
    label: "Bookmarks Restore", // button title
    tooltiptext: "Bookmarks Restore", // tooltip title
    onClick: function(event) {
      
      if(event.button=='0') {
        let backupsDir = Services.dirsvc.get("Desk", Ci.nsIFile);
        let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
        let fpCallback = aResult => {
          if (aResult != Ci.nsIFilePicker.returnCancel) {
            
            // check file extension
            if (!fp.file.path.toLowerCase().endsWith("json") &&
                !fp.file.path.toLowerCase().endsWith("jsonlz4")) {
              this._showErrorAlert(PlacesUIUtils.getString("bookmarksRestoreFormatError"));
              return;
            }

            // confirm ok to delete existing bookmarks
            if (!Services.prompt.confirm(null,
                   PlacesUIUtils.getString("bookmarksRestoreAlertTitle"),
                   PlacesUIUtils.getString("bookmarksRestoreAlert")))
              return;

            (async function() {
              try {
                await BookmarkJSONUtils.importFromFile(fp.file.path, {
                  replace: true,
                });
              } catch (ex) {
                PlacesOrganizer._showErrorAlert(PlacesUIUtils.getString("bookmarksRestoreParseError"));
              }
            })();
            
            
          }
        };


		fp.init(BrowsingContext.getFromWindow(window), "json", Ci.nsIFilePicker.modeOpen);
        fp.appendFilter("json",
                        RESTORE_FILEPICKER_FILTER_EXT);
        fp.appendFilters(Ci.nsIFilePicker.filterAll);
        fp.displayDirectory = backupsDir;
        fp.open(fpCallback);
      }
    },
    onCreated: function(button) {
      return button;
    }
        
  });
  
  // style button icon
  var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
    \
      #uc-bookmarks_backup .toolbarbutton-icon {\
        list-style-image: url("chrome://browser/skin/bookmark.svg"); /* icon / path to icon */ \
        fill: red; /* icon color name/code */\
      }\
      #uc-bookmarks_restore .toolbarbutton-icon {\
        list-style-image: url("chrome://browser/skin/bookmark.svg"); /* icon / path to icon */ \
        fill: green; /* icon color name/code */\
      }\
    \
  '), null, null);
  
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  
} catch (e) {
    Components.utils.reportError(e);
};

})();