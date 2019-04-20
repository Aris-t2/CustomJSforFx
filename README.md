<h1>Custom JS scripts for Firefox Quantum</h1>
The <a href='https://github.com/Aris-t2/CustomJSforFx/wiki'>Wiki</a> contains a feature list (with screenshots).  
<h2>Method 1 - files for Firefox profile folder only</h2>
M1 is based on this project by nuchi: https://github.com/nuchi/firefox-quantum-userchromejs </br>
M1 will stop working when Mozilla drops XBL support.</br>
</br>
From this projects <code>\method 1\</code> folder copy <code>userChrome</code> folder and <code>userChrome.css</code> file to <code>\ PROFILENAME \chrome\</code> or add code from <code>userChrome.css</code> file to an existing <code>userChrome.css</code> file.</br>
</br>
<b>Edit <code>userChrome\userChrome.xml</code> file to add custom scripts.</b>
</br>
<h2>Method 2 - files for Firefox installation folder and Firefox profile folder</h2>
M2 is based on this project by ardiman: https://github.com/ardiman/userChrome.js </br>
M2 is also based on the modified files by Endor8: https://github.com/Endor8/userChrome.js/ </br>
</br>
From this projects <code>\method 2\profile\</code> folder copy <code>userChrome</code> folder and <code>userChrome.js</code> file to <code>\ PROFILENAME \chrome\</code> folder.</br>
</br>
From this projects <code>\method 2\firefox\</code> folder copy <code>defaults</code> folder and <code>config.js</code> file to Firefox main directory (where the Firefox executable is). </br>
</br>
<b>Edit <code>userChrome.js</code> file to add custom scripts.</b></br>
</br>
With beta and release versions of Firefox 62+ an additional preference <code>pref("general.config.sandbox_enabled", false);</code> has to be set inside <code>config-prefs.js</code> file. This is considered less secure by Mozilla and is only a temporary workaround, but at the moment it is the only way to run custom scripts using "method 2". 
</br>
<h2>Method 3 - files for Firefox installation folder and Firefox profile folder</h2>
M3 is based on this project by xiaoxiaoflood: https://github.com/xiaoxiaoflood/firefox-scripts </br>
</br>
From this projects <code>\method 3\profile\</code> folder copy <code>userChrome</code> folder, <code>utils</code> folder and <code>userChrome.uc.js</code> file to <code>\ PROFILENAME \chrome\</code> folder.</br>
</br>
From this projects <code>\method 3\firefox\</code> folder copy <code>defaults</code> folder and <code>config.js</code> file to Firefox main directory (where the Firefox executable is). </br>
</br>
<b>Edit <code>userChrome.uc.js</code> file to add custom scripts or delete <code>userChrome.uc.js</code> file and add scripts directly into <code> /chrome/ </code> folder.</b>
</br>
<h2>Script/startup cache must be deleted after every change!</h2>
Where to find <code>startupCache</code> folder?</br>
<code>about:profiles > Local Directory > Open Folder</code>, close Firefox and delete all files in <code>startupCache</code> folder.</br>
</br>
This is not the same 'profile' folder custom scripts and styles are stored in!</br>
</br>
More info about startup cache removal (in German): https://github.com/ardiman/userChrome.js/wiki/Skriptcache </br>
More info about startup cache removal (in English [Google translation]): https://translate.googleusercontent.com/translate_c?act=url&depth=1&ie=UTF8&prev=_t&rurl=translate.google.com&sl=auto&sp=nmt4&tl=en&u=https://github.com/ardiman/userChrome.js/wiki/Skriptcache </br>
<h2>Where to find Firefox profile folder?</h2>
<code>about:profiles > Root Directory > Open Folder</code> or </br>
<code>about:support > Profile Folder > Open Folder</code></br>
</br>
<h2>Script collections</h2>
Script collection by ardiman: https://github.com/ardiman/userChrome.js</br>
Script collection by Endor8: https://github.com/Endor8/userChrome.js</br>
Script collection by xiaoxiaoflood: https://github.com/xiaoxiaoflood/firefox-scripts/tree/master/chrome</br>
Script collection by Patchonn: https://github.com/Patchonn/firefox-theme/tree/master/userChrome</br>
</br>
