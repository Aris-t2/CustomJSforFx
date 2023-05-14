<h1>Custom JS scripts for Firefox and Thunderbird</h1>
The <a href='https://github.com/Aris-t2/CustomJSforFx/wiki'>Wiki</a> contains a feature list (with screenshots).  
<h1>Unlock custom CSS usage in Firefox 69 and newer</h1>  
<code>about:config</code> > <code>toolkit.legacyUserProfileCustomizations.stylesheets</code> > <code>true</code>  
<h1>Unlock custom CSS usage in Thunderbird 69 and newer</h1>  
<code>Settings/Options</code> > <code>Advanced</code> > <code>General</code> > <code>Config Editor...</code> </br>
<code>toolkit.legacyUserProfileCustomizations.stylesheets</code> > <code>true</code>  
<h2>Script Loader</h2>
Based on this project by ardiman: https://github.com/ardiman/userChrome.js </br>
Additionally based on the modified files by Endor8: https://github.com/Endor8/userChrome.js/ </br>
</br>
Copy from this projects <code>\script_loader\profile\</code> folder <code>userChrome</code> folder and <code>userChrome.js</code> file to <code>\ PROFILENAME \chrome\</code> folder.</br>
</br>
Copy from this projects <code>\script_loader\firefox\</code> folder <code>defaults</code> folder and <code>config.js</code> file into Firefox main directory (where the Firefox executable is; or on macOS, <b>inside</b> the main executable, at <code>/Applications/Firefox.app/Contents/Resources/</code>). </br>
</br>
<b>Edit <code>userChrome.js</code> file to add custom scripts!</b></br>
</br>
With Firefox 62+ and Thunderbird 68+ an additional preference <code>pref("general.config.sandbox_enabled", false);</code> has to be set inside <code>config-prefs.js</code> file. This is considered less secure by Mozilla and is only a temporary workaround, but at the moment it is the only way to run custom scripts using "method 2". 
</br>
<h2>Script/startup cache must be deleted after every change!</h2>
Where to find Firefox <code>startupCache</code> folder?</br>
<code>about:profiles > Local Directory > Open Folder</code>, close Firefox and delete all files in <code>startupCache</code> folder.</br>
</br>
This is not the same 'profile' folder custom scripts and styles are stored in!</br>
Where to find Thunderbird <code>startupCache</code> folder?</br>
<b>Windows</b></br>
<code>C:\Users\ USERNAME \AppData\Local\Mozilla\Thunderbird\Profiles\ PROFILE FOLDER NAME \</code></br>
<b>Linux/macOS</b></br>
Search for <code>startupCache</code> folder on your hard drive.</br>
</br>
More info about startup cache removal (in German): https://github.com/ardiman/userChrome.js/wiki/Skriptcache </br>
<h2>Where to find Firefox folder with main executable?</h2>
<code>about:support > Application Binary</code> (Path on your system) </br>
</br>
<h2>Where to find Firefox profile folder?</h2>
<code>about:profiles > Root Directory > Open Folder</code> or </br>
<code>about:support > Profile Folder > Open Folder</code></br>
</br>
<h2>Where to find Thunderbird profile folder?</h2>
<b>Windows</b></br>
<code>C:\Users\ USERNAME \AppData\Roaming\Mozilla\Thunderbird\Profiles\ PROFILE FOLDER NAME \</code></br>
Hidden files must be visible to see <code>AppData</code> folder. Alternatively open <code>%APPDATA%\Mozilla\Firefox\Profiles\</code> from explorers location bar.</br></br>
<b>Linux</b></br>
<code>/home/ username /.mozilla/thunderbird/ profile folder name /</code></br>
Hidden files must be visible to see <code>.mozilla</code> folder.</br></br>
<b>Mac OS X</b></br>
<code>~\Library\Mozilla\Thunderbird\Profiles\ PROFILE FOLDER NAME \</code> or</br>
<code>~\Library\Application Support\Mozilla\Thunderbird\Profiles\ PROFILE FOLDER NAME \</code></br>
<code>\Users\ USERNAME \Library\Application\Support\Thunderbird\Profiles\</code></br>
</br>
<h2>Script collections</h2>
Script collection by ardiman: https://github.com/ardiman/userChrome.js</br>
Script collection by Endor8: https://github.com/Endor8/userChrome.js</br>
Script collection by xiaoxiaoflood: https://github.com/xiaoxiaoflood/firefox-scripts/tree/master/chrome</br>
</br>
