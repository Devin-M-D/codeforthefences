cDI.services.auth = {
  signup: async (email, un, pw, confPw) => {
    var newUser = await cDI.remote.remoteCall("/signup", {
      "email": email,
      "username": un,
      "password": pw,
      "confPW": confPw
    })
    return newUser.payload
  },
  login: async (un, pw) => {
    var callRes = await cDI.remote.remoteCall("/login", {"username": un, "password": pw })
    return await cDI.remote.h(callRes,
      async (user) => {
        await cDI.session.setSession(user.id, user.username, user.sessionId)
        await cDI.components.header.strapAuthButton()
        return callRes
      },
      async (callRes) => { console.log("login failed"); return false; }
    )
  }
}
