async function loadCargoHold(){
  var modal = await cDI.asyncGet("components/widgets/modal.html")
  $("#cargoHold").append(modal)
}
