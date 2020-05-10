// async function utRunAllTests() {
//   await utRunAllAuth()
//   await utRunAllCreateRecipe()
// }
async function utCurrentTestScenario() {
  //await utRunAllCreateRecipe()
}
//
// //#region tests/
//   //#region auth tests
//   async function utRunAllAuth() {
//     await utSignup()
//     await utLogin()
//   }
//   async function utInitAuthTest(fn){
//     return $.when($("#btnPopMdlAuth").triggerHandler("click")).then(async () => {
//       return fn()
//     })
//   }
//   async function utSignup(){
//     await utInitAuthTest(async () => await $("#btnSingup").triggerHandler("click"))
//   }
//   async function utLogin(){
//     await utInitAuthTest(async () => await $("#btnLogin").triggerHandler("click"))
//   }
//   //#endregion
//
//   //#region create new recipe
//   async function utRunAllCreateRecipe() {
//     utCreateNewRecipe()
//   }
//
//   async function utInitNewRecipe(fn) {
//     return $.when($("#addNew").triggerHandler("click")).then(async () => {
//       return fn()
//     })
//   }
//
//   async function utCreateNewRecipe() {
//     await utInitNewRecipe(async () => console.log('Adding new recipe, spawned blank recipe card', $("#tmpRecipeCardId")))
//   }
//   //#endregion
// //#endregion
