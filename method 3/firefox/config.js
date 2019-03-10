// config.js
try {

  Components.utils.import('resource://gre/modules/osfile.jsm');
  Components.utils.import(OS.Path.toFileURI(OS.Constants.Path.profileDir)+ '/chrome/utils/boot.jsm');
  
} catch(e) {};
