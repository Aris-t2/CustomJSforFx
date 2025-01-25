// this moves tabs toolbar below navigation toolbar without tweaking any cosmetics
// for OS titlebar only
// works with Firefox 134+


(function(){
  var tabbar = document.getElementById("TabsToolbar");
  tabbar.parentNode.appendChild(tabbar);
})();
