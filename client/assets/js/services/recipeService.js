async function getAllRecipes() {
  var callRes = await cDI.remoteCall("/crud/recipe/r/", { expectMany: true })
  console.log("callRes", callRes)
  var retVal = cDI.utils.extrudeFlatGraph(callRes.payload)
  return retVal
}
async function buildRecipeCard(){

}
