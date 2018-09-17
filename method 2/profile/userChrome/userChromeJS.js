// main.js

Cu.import("resource://gre/modules/FileUtils.jsm");

var UserChrome_js = {

  init: function() {
    Services.obs.addObserver(this, "final-ui-startup", false);
    Services.obs.addObserver(this, "domwindowopened", false);
  },

  // observer
  observe: function(aSubject, aTopic, aData) {
    switch (aTopic) {
      case "final-ui-startup":
        var ucFilePath = OS.Path.join(OS.Constants.Path.profileDir, "chrome", "userChrome.js");
        var ucFile = new FileUtils.File(ucFilePath);
        if (ucFile.exists() && ucFile.isFile()) {
          this.utilFileURI = OS.Path.toFileURI(OS.Path.join(OS.Constants.Path.profileDir, "./chrome/userChrome/userChromeJSutilities.js"));
          this.ucFileURI = OS.Path.toFileURI(ucFilePath);
        };
        Services.obs.removeObserver(this, "final-ui-startup");
        break;

      case "domwindowopened":
        aSubject.addEventListener("load", this, {capture: true, once: true});
        break;
    }
  },

  // event listener for load
  handleEvent: function(aEvent) {
    var document = aEvent.originalTarget;
    var window = document.defaultView;
    if (document.location && document.location.protocol == "chrome:") {
      try {
        Services.scriptloader.loadSubScript(this.utilFileURI, window, "UTF-8");
        Services.scriptloader.loadSubScript(this.ucFileURI, window, "UTF-8");
      }
      catch (ex) {}
    };
  }

};

UserChrome_js.init();
