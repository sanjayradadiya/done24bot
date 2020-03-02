const bot = {
  utils: null,
  page: null,
  session: null,
  user_id: null,
  password: null,
  elements: {
	searchIcon: '//*[contains(@class,"icon-search")]',
  	navBar: '//*[contains(@class,"navbar-toggle")]',
  	messageBox: 'div[class="composer_rich_textarea"]',
  	messageText: 'textarea[ng-model="draftMessage.text"]',
  	sendMessage: '//button[@type="submit"]',
  	usernamePassword: '//*[contains(text(),"#username#")][last()]',
},
  BASE_URL:'https://web.telegram.org',

  login: async () => {

    try {
      await bot.page.waitFor(bot.elements.navBar, { timeout: 300000 });
    } catch (e) {
      console.log("Login Failed");
      console.log(e)
      return null;
    }
},
  up_load: async (url) => {

      await bot.page.goto(url);
      await bot.utils.sleep(3000);
      await bot.sendMessage('/start')
      await bot.utils.sleep(5000);
      var up = await bot.getUsernamePassword();
      console.log("username, password:", up);
      return up;

},

  sendMessage: async (text) => {
	console.log('sendMessage', text)
	try {
	  await bot.page.click(bot.elements.messageBox);
	  await bot.utils.sleep(500);
	  await bot.page.type(bot.elements.messageText, text, { delay: 10 });
      	  const sendButton = await bot.page.$x(bot.elements.sendMessage);
	  await sendButton[0].click();
	} catch (e) {
	      console.log("SendMessage error",e);
    }

  },
  getUsernamePassword: async () => {
	const [usernamepass] = await bot.page.$x(bot.elements.usernamePassword)
	const message = await bot.page.evaluate(link => link.innerText, usernamepass);
	var u_m = message.substring(message.indexOf('#username#')+10, 100);
	var user_id = u_m.substring(0,u_m.indexOf('#'));

	var p_m = message.substring(message.indexOf('#password#')+10, 100);
        var password = p_m.substring(0,p_m.indexOf('#'));
	return {"user_id" :  user_id, "password" : password }
  }
}

module.exports = bot;
