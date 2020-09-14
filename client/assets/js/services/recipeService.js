async function getAllRecipes() {
  var callRes = await cDI.remote.remoteCall("/crud/recipe/r/", { expectMany: true })
  return cDI.utils.extrudeFlatGraph(callRes.payload, "recipe")
}
cDI.services.recipe = {
  searchUoM: async () => {
    var foo = await cDI.remote.remoteCall("/crud/UoM/r/")
    console.log(foo)
  }
}
