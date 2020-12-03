cDI.services.recipe = {
  getAllRecipes: async () => {
    var callRes = await cDI.remote.remoteCall("/crud/recipe/r/", { expectMany: true })
    return cDI.utils.extrudeFlatGraph(callRes.payload, "recipe")
  },
  searchUoM: async () => {
    var foo = await cDI.remote.remoteCall("/crud/UoM/r/")
    console.log(foo)
  },
  save: async (recipe) => {
    var foo = await cDI.remote.remoteCall("/crud/recipe/u/")
    console.log(foo)
  }
}
