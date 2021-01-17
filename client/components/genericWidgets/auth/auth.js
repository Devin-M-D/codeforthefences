cDI.components.auth = {
  init: async () => {
    cDI.addAwaitableInput("click", $("#btnSignup"), async (res) => {
      var email = $('#txtSgnEmail').val()
      var un = $('#txtSgnUN').val()
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
      cDI.closeModal()
    })

    cDI.addAwaitableInput("click", $("#btnLogin"), async (res) => {
      var un = $('#txtLoginUN').val()
      var pw = $('#txtLoginPW').val()
      var callRes = await cDI.remote.remoteCall("/login", {"username": un, "password": pw })
      console.log("callRes", callRes)
      await cDI.remote.h(callRes,
        async (token) => {
          cDI.persist("cookbook.username", un)
          cDI.persist("cookbook.token", token)
          cDI.session.username = un
          cDI.session.token = token
          cDI.components.modal.raiseCurtain()
          await cDI.components.header.strapAuthButton()
          return callRes
        },
        async (callRes) => { console.log("login failed"); return false; }
      )
    })
  }
}
