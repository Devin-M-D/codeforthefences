cDI.components.auth = {
  html: ``,
  preInit: async (DI, path) => {
    DI.html = await cDI.remote.asyncGet(`${path}.html`)
  },
  init: async () => {
    cDI.addAwaitableInput("click", $("#btnSignup"), async (e) => {
      var email = $('#txtSgnEmail').val()
      var un = $('#txtSgnUN').html()
      var dn = $('#txtSgnDisplayName').val()
      var pw = $('#txtSgnPW').val()
      var confPw = $('#txtSgnConfPW').val()
      if (pw != confPw) {
        console.log("passwords do not match!")
      }
      var data = await cDI.remote.remoteCall("/signup", {
        "email": email,
        "username": un,
        "displayname": dn,
        "password": pw,
        "confPW": confPw
      })
    if (data.status == "s"){
        user = data.payload
        await cDI.session.setSession(user.id, user.username, user.sessionId)
        await cDI.components.header.strapAuthButton()
      }
      else if (data.payload == "Unable to create new user, username is taken.") {
        $("#txtSgnUN").css("background-color", "coral")
      }
      else {
        $("#btnSignup").css("background-color", "pink")
        $("#btnSignup").css("border-color", "coral")
      }
      return data
    })

    cDI.addAwaitableInput("click", $("#btnLogin"), async (e) => {
      var un = $('#txtLoginUN').html()
      var pw = $('#txtLoginPW').val()
      var callRes = await cDI.remote.remoteCall("/login", {"username": un, "password": pw })
      return await cDI.remote.h(callRes,
        async (user) => {
          await cDI.session.setSession(user.id, un, user.token)
          await cDI.components.header.strapAuthButton()
          return callRes
        },
        async (callRes) => { console.log("login failed"); return false; }
      )
    })
  }
}
