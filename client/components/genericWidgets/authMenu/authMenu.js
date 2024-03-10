cDI.components.authMenu = {
  drawAuthMenu: async () => {
    var authMenu = $(`
    <span id="authMenu">
      <span id="signupUN">
        <span>Username:</span>
        <span tabindex="1" id="txtSgnUN" class="hardCenter" type="text" contenteditable="true" value=""></span>
      </span>
      <span id="loginUN">
        <span class="">Username/Email:</span>
        <span tabindex="5" id="txtLoginUN" class="hardCenter" type="text" contenteditable="true" placeholder="username/email" value=""></span>
      </span>
      <span id="signupPW">
        <span class="">Password:</span>
        <input tabindex="2" id="txtSgnPW" class="hardCenter" type="password" placeholder="password" value="" />
      </span>
      <span id="loginPW">
        <span class="">Password:</span>
        <input tabindex="6" id="txtLoginPW" class="hardCenter" type="password" placeholder="password" value="" />
      </span>
      <span id="signupConfPW">
        <span class="">Confirm password:</span>
        <input tabindex="3" id="txtSgnConfPW" class="hardCenter" type="password" placeholder="confirm password" value="" />
      </span>
      <span></span>
      <span id="authMenuVRule" class="rule vert"></span>
      <span tabindex="4" id="btnSignup" class="btnStd hardCenter">Signup</span>
      <span tabindex="7" id="btnLogin" class="btnStd hardCenter">Login</span>
    </span>`)
    ftbAddInput("click.signup", authMenu.find("#btnSignup"), async (e) => {
      var email = $('#txtSgnEmail').val()
      var un = $('#txtSgnUN').html()
      var pw = $('#txtSgnPW').val()
      var confPw = $('#txtSgnConfPW').val()
      if (pw != confPw) {
        console.log("passwords do not match!")
      }
      var result = await cDI.services.auth.signup(email, un, pw, confPw)
      console.log("result",result)
      console.log("un",un)
      if (result == "Unable to create new user, username is taken."){
        $("#txtSgnUN").css("background-color", "coral")
      }
      else if (result.username == un) {
        await cDI.session.setSession(result.id, result.username, result.sessionId)
        await ftbCmp("header").strapAuthButton()
      }
      else {
        $("#btnSignup").css("background-color", "pink")
        $("#btnSignup").css("border-color", "coral")
      }
      return result
    })

    ftbAddInput("click.login", authMenu.find("#btnLogin"), async (e) => {
      var un = $('#txtLoginUN').html()
      var pw = $('#txtLoginPW').val()
      var loginRes = await cDI.services.auth.login(un, pw)
      return loginRes
    })
    return authMenu
  }
}
