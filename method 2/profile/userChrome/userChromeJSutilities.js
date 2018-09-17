// utilities.js

var userChrome = {

  path: null,
  dirToken: null,
  ignoreCache: false,

  get loadOverlayDelay () {
    if (!this._loadOverlayDelay)
      this._loadOverlayDelay = 500;
    return this._loadOverlayDelay;
  },

  set loadOverlayDelay(delay) {
    this._loadOverlayDelay = delay;
  },

  get loadOverlayDelayIncr() {
    if (!this._loadOverlayDelayIncr)
      this._loadOverlayDelayIncr = 1600;
    return this._loadOverlayDelayIncr;
  },

  set loadOverlayDelayIncr(delay) {
    this._loadOverlayDelayIncr = delay;
  },

  import: function(aPath, aRelDirToken) {
    let file;
    this.path = aPath;
    this.dirToken = aRelDirToken;

    if (aRelDirToken) {
      // Relative file
      let absDir = this.getAbsoluteFile(aRelDirToken);
      if (!absDir)
        return;
      let pathSep = absDir.path.match(/[\/\\]/)[0];
      file = absDir.path + (aPath == "*" ?
          "" : pathSep + aPath.replace(/[\/\\]/g, pathSep));
    }
    else
      // Absolute file
      file = aPath;

    file = this.getFile(file);
    if (!file)
      return;
    if (file.isFile()) {
      if (/\.js$/i.test(file.leafName))
        this.loadScript(file, aRelDirToken, null);
      else if (/\.xul$/i.test(file.leafName)) {
        let xul_files = [];
        xul_files.push(file);
        this.loadOverlay(xul_files, this.dirToken, null, this.loadOverlayDelay);
      }
      else
        this.log("File '" + this.path +
                 "' does not have a valid .js or .xul extension.", "userChrome.import");
    }
    else if (file.isDirectory())
      this.importFolder(file);
    else
      this.log("File '" + this.path +
               "' is neither a file nor a directory.", "userChrome.import");
  },

  loadScript: function(aFile, aFolder, aRelDirToken) {
    setTimeout(function() {
      Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                .getService(Components.interfaces.mozIJSSubScriptLoader)
                .loadSubScriptWithOptions(userChrome.getURLSpecFromFile(aFile),
                                          {target: window,
                                           charset: userChrome.charSet,
                                           ignoreCache: userChrome.ignoreCache});
      // log it
      userChrome.log(aRelDirToken ? ("[" + aRelDirToken + "]/" +
          (aFolder && aFolder != "*" ? aFolder + "/" : "") + aFile.leafName) :
          aFile.path, "userChrome.loadScript");
    }, 0);
  },


  loadOverlay: function(aFiles, aRelDirToken, aFolder, aDelay) {

    // Increment multiple import delay
    this.loadOverlayDelay = this.loadOverlayDelay + this.loadOverlayDelayIncr;
    setTimeout(function() {
      if (aFiles.length > 0) {

        // log it
        userChrome.log(aRelDirToken ? ("[" + aRelDirToken + "]/" +
            (aFolder && aFolder != "*" ? aFolder + "/" : "") + aFiles[0].leafName) :
            aFiles[0].path, "userChrome.loadOverlay");
        document.loadOverlay(userChrome.getURLSpecFromFile(aFiles.shift()), null);
        setTimeout(arguments.callee, userChrome.loadOverlayDelay);
      }
    }, aDelay);
  },

  // Include all files ending in .js and .xul from passed folder
  importFolder: function(aFolder) {
    let files = aFolder.directoryEntries
                       .QueryInterface(Components.interfaces.nsISimpleEnumerator);
    let xul_files = [];

    while (files.hasMoreElements()) {
      let file = files.getNext().QueryInterface(Components.interfaces.nsIFile);
      if (/\.js$/i.test(file.leafName) && file.leafName != "userChrome.js")
        this.loadScript(file, this.path, this.dirToken);
      else if (/\.xul$/i.test(file.leafName)) {
        xul_files.push(file);
      }
    }

    if (xul_files.length > 0)
      this.loadOverlay(xul_files, this.dirToken, this.path);
  },

  getFile: function(aPath, aRelDirToken) {
    try {
      let file = Components.classes["@mozilla.org/file/local;1"]
                           .createInstance(Components.interfaces.nsIFile);
      file.initWithPath(aPath);
      // Bad file doesn't throw on initWithPath, need to test
      if (file.exists())
        return file;
      this.log("Invalid file '" + this.path + (this.dirToken ?
          ("' or file not found in directory with token '" + this.dirToken) :
          "") + "' or other access error.", "userChrome.getFile");
    }
    catch (e) {
      // Bad folder throws on initWithPath
      /*this.log("Invalid folder '" + this.path + (this.dirToken ?
          ("' or folder not found in directory with token '" + this.dirToken) :
          "") + "' or other access error.", "userChrome.getFile");*/
    }
    return null;
  },

  getAbsoluteFile: function(aRelDirToken) {
    try {
      let absDir = Components.classes["@mozilla.org/file/directory_service;1"]
                             .getService(Components.interfaces.nsIProperties)
                             .get(aRelDirToken, Components.interfaces.nsIFile);
      return absDir;
    }
    catch (e) {
      /*this.log("Invalid directory name token '" + this.dirToken +
               "' or directory cannot be accessed.", "userChrome.getAbsoluteFile");*/
      return null;
    }
  },

  getURLSpecFromFile: Components.classes["@mozilla.org/network/io-service;1"]
                                .getService(Components.interfaces.nsIIOService)
                                .getProtocolHandler("file")
                                .QueryInterface(Components.interfaces.nsIFileProtocolHandler)
                                .getURLSpecFromFile,

  /* Console logger */
  log: function(aMsg, aCaller) {
    Components.classes["@mozilla.org/consoleservice;1"]
              .getService(Components.interfaces.nsIConsoleService)
              .logStringMessage(/*this.date + */" userChromeJS " +
                                (aCaller ? aCaller +": " : "") + aMsg);
  },
/*
  get dateFormat() {
    if (!this._dateFormat)
      this._dateFormat = "%Y-%m-%d %H:%M:%S";
    return this._dateFormat;
  },

  set dateFormat(format) {
    this._dateFormat = format;
  },

  get date() {
    let date = new Date();
//  return date.toLocaleFormat(this.dateFormat);
    try {
      date = date.toLocaleFormat(this.dateFormat);
    } catch(e) {
      date = date.toString();
    };    
    return date;
  },
*/
  set charSet(val) {
    this._charSet = val;
  },

  get charSet() {
    if (!this._charSet)
      this._charSet = "UTF-8"; // use "UTF-8". Defaults to ascii if null.
    return this._charSet;
  }

};
