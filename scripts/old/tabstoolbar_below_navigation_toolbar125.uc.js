// Move tabs toolbar below navigation toolbar


(function(){
  var tabbar = document.getElementById("TabsToolbar");
  tabbar.parentNode.parentNode.appendChild(tabbar);
})();
