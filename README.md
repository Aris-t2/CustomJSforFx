<h1>Custom JS scripts for Firefox Quantum</h1>
<b><a href=https://github.com/Aris-t2/Scrollbars/releases>[ Download ]</a></b></br></br>
<h2>Method 1 - files for Firefox profile folder only</h2>
M1 is based on this project by nuchi: https://github.com/nuchi/firefox-quantum-userchromejs </br>
M1 will stop working when Mozilla drops XBL support.</br>
</br>
From this projects <code>\method 1\</code> folder copy <code>userChrome</code> folder and <code>userChrome.css</code> file to <code>\ PROFILENAME \chrome\ </code> or add code from <code>userChrome.css</code> file to an existing <code>userChrome.css</code> file.</br>
</br>
<h2>Method 2 - files for Firefox installation folder and Firefox profile folder</h2>
M2 is based on this project by ardiman: https://github.com/ardiman/userChrome.js </br>
M2 is also based on the modified files by Endor8: https://github.com/Endor8/userChrome.js/ </br>
</br>
From this projects <code>\method 2\profile\</code> folder copy <code>userChrome</code> folder and <code>userChrome.js</code> file to <code>\ PROFILENAME \chrome\</code> folder.</br>
</br>
From this projects <code>\method 2\firefox\</code> folder copy <code>defaults</code> folder and <code>config.js</code> file to Firefox main directory (where the Firefox executable is). </br>
</br>
With beta and release versions of Firefox 62+ an additional preferences <code>pref("general.config.sandbox_enabled", false);</code> has to be set inside <code>config-prefs.js</code> file. This is considered less secure by Mozilla and is only a temporary workaround, but at the moment it is the only way to run custom scripts using "methode 2". </br>
</br>
<h2>Script/startup cache must be deleted after every change!</h2>
M2 method (now) uses <code>userChrome.ignoreCache = true;</code> inside <code>userChrome.js</code> file and clears the script/startup cache automatically.</br>
Where to find <code>startupCache</code> folder?</br>
<code>about:profiles > Local Directory > Open Folder</code>, close Firefox and delete all files in <code>startupCache</code> folder.</br>
</br>
Location on WINDOWS: <code>C:\Users\ NAME \AppData\Local\Mozilla\Firefox\Profiles\ PROFILE \startupCache</code></br>
Location on LINUX location: <code>\home\ NAME \.cache\mozilla\firefox\ PROFILE \startupCache</code></br>
</br>
This is not the same profile folder custom scripts and styles are stored!</br>
</br>
More info about startup cache removal (in German): https://github.com/ardiman/userChrome.js/wiki/Skriptcache </br>
More info about startup cache removal (in English [Google translation]): https://translate.googleusercontent.com/translate_c?act=url&depth=1&ie=UTF8&prev=_t&rurl=translate.google.com&sl=auto&sp=nmt4&tl=en&u=https://github.com/ardiman/userChrome.js/wiki/Skriptcache </br>
<h2>Where to find Firefox profile folder for styles and scripts?</h2>
<b>1.</b> Find your profile folder.</br>
<code>about:profiles > Root Directory > Open Folder</code></br>
or <code>about:support > Profile Folder > Open Folder</code></br>
or <code>Shift+F2</code> to open Firefox's command line, then enter the command <code>folder openprofile</code></br>
</br>
<b>2.</b> User styles belong into <code>\chrome\</code> folder. Create it, if there is none yet.</br>
<code>\ PROFILENAME \chrome\ </code></br>
</br>
<b>3.</b> Copy files and folders into <code>\chrome\</code> sub-folder so the results look like this:</br>
<code>\ PROFILENAME \chrome\userChrome\</code> (method 1 and 2)</br>
<code>\ PROFILENAME \chrome\userChrome.css</code> (method 1)</br>
<code>\ PROFILENAME \chrome\userChrome.js</code> (method 2)</br>
</br>
<b>3.</b> Copy files and folders into <code>\chrome\</code> sub-folder so the results look like this:</br>
Script collection by ardiman: https://github.com/ardiman/userChrome.js</br>
Script collection by Endor8: https://github.com/Endor8/userChrome.js/</br>
</br>