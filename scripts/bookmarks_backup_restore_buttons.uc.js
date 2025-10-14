// Bookmarks Backup/Restore button script for Firefox 125+ by Aris
// fix by BrokenHeart

(function() {
  try {
    const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    const RESTORE_FILEPICKER_FILTER_EXT = "*.json;*.jsonlz4";

    const { BookmarkJSONUtils } = ChromeUtils.importESModule("resource://gre/modules/BookmarkJSONUtils.sys.mjs");
    const { PlacesBackups } = ChromeUtils.importESModule("resource://gre/modules/PlacesBackups.sys.mjs");
    const { PlacesUIUtils } = ChromeUtils.importESModule("moz-src:///browser/components/places/PlacesUIUtils.sys.mjs");

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
          fp.appendFilter("json", RESTORE_FILEPICKER_FILTER_EXT);
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
                const [title, msg] = PlacesUIUtils.promptLocalization.formatValuesSync([
                  "places-error-title",
                  "places-bookmarks-restore-format-error"
                ]);
                Services.prompt.alert(null, title, msg);
                return;
              }

              // confirm ok to delete existing bookmarks
              const [title, body] = PlacesUIUtils.promptLocalization.formatValuesSync([
                "places-bookmarks-restore-alert-title",
                "places-bookmarks-restore-alert"
              ]);
              if (!Services.prompt.confirm(null, title, body)) {
                return;
              }

              (async function() {
                try {
                  await BookmarkJSONUtils.importFromFile(fp.file.path, {
                    replace: true,
                  });
                } catch (ex) {
                  const [title, msg] = PlacesUIUtils.promptLocalization.formatValuesSync([
                    "places-error-title",
                    "places-bookmarks-restore-parse-error"
                  ]);
                  Services.prompt.alert(null, title, msg);
                }
              })();
            }
          };

  		  fp.init(BrowsingContext.getFromWindow(window), "json", Ci.nsIFilePicker.modeOpen);
          fp.appendFilter("json", RESTORE_FILEPICKER_FILTER_EXT);
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
    const uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
      #uc-bookmarks_backup .toolbarbutton-icon {
        list-style-image: url("chrome://browser/skin/bookmark.svg"); /* icon / path to icon */
        fill: red; /* icon color name/code */
      }
      #uc-bookmarks_restore .toolbarbutton-icon {
        list-style-image: url("chrome://browser/skin/bookmark.svg"); /* icon / path to icon */
        fill: green; /* icon color name/code */
      }
    `), null, null);
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
  } catch (e) {
    Components.utils.reportError(e);
  };
})();