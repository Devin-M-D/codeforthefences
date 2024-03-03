cDI.components.authMenu = {
  drawAuthMenu: async () => {
    var authMenu = $(`
    <span id="authMenu">
      <span id="signupUN">
        <span>Username:</span>
        <span id="txtSgnUN" class="centerContents" type="text" contenteditable="true" value=""></span>
      </span>
      <span id="loginUN">
        <span class="">Username/Email:</span>
        <span id="txtLoginUN" class="centerContents" type="text" contenteditable="true" placeholder="username/email" value=""></span>
      </span>
      <span id="signupPW">
        <span class="">Password:</span>
        <input id="txtSgnPW" class="centerContents" type="password" placeholder="password" value="" />
      </span>
      <span id="loginPW">
        <span class="">Password:</span>
        <input id="txtLoginPW" class="centerContents" type="password" placeholder="password" value="" />
      </span>
      <span id="signupConfPW">
        <span class="">Confirm password:</span>
        <input id="txtSgnConfPW" class="centerContents" type="password" placeholder="confirm password" value="" />
      </span>
      <span></span>
      <span id="authMenuVRule" class="rule vert"></span>
      <span id="btnSignup" class="btnStd centerContents">Signup</span>
      <span id="btnLogin" class="btnStd centerContents">Login</span>
    </span>`)
    ftbAddInput("click.signup", authMenu.find("#btnSignup"), async (e) => {
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

    ftbAddInput("click.login", authMenu.find("#btnLogin"), async (e) => {
      var un = $('#txtLoginUN').html()
      var pw = $('#txtLoginPW').val()
      var loginRes = await cDI.session.login(un, pw)
      return loginRes
    })
    return authMenu
  }
}
