// this moves tabs toolbar below navigation toolbar without tweaking any cosmetics
// for OS titlebar only
// works with Firefox 153+


(function() {
  let tabbar = document.getElementById('TabsToolbar');
  let notifbar = document.getElementById('notifications-toolbar');
  if (tabbar && notifbar && !tabbar.collapsed) {
    notifbar.parentNode.insertBefore(tabbar, notifbar);
  }
})();
