async function createDrawerPane(target){
  var pane = $("#cargoHold > .drawerPane").clone()
  $(target).append(pane)
  return $(target).find(".drawerPane")
}

async function populateDrawerPane(pane, content) {
  $(pane).append(content)
}

async function openDrawerPane(pane) {
  $(pane).addClass("open")
}

async function closeDrawerPane(pane) {
  $(pane).removeClass("open")
}
