async function getAllRecipes() {
  var callRes = await cDI.remote.remoteCall("/crud/recipe/r/", { expectMany: true })
  return cDI.utils.extrudeFlatGraph(callRes.payload, "recipe")
}
