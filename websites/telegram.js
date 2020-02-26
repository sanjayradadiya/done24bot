var utils = require('../common/utils');

const elements = {
  searchIcon: '//*[contains(@class,"icon-search")]',
  navBar: '//*[contains(@class,"navbar-toggle")]',
  messageBox: 'div[class="composer_rich_textarea"]',
  messageText: 'textarea[ng-model="draftMessage.text"]',
  sendMessage: '//button[@type="submit"]',
  usernamePassword: '//*[contains(text(),"#username#")][last()]',
  
};

const bot = {
  page: null,
  session: null,
  user_id: null,
  password: null,
  elements: elements,
  BASE_URL:'https://web.telegram.org',

  login: async () => {

    try {
      await bot.page.waitFor(elements.navBar, { timeout: 300000 });
    } catch (e) {
      console.log("Login Failed");
      console.log(e)
      return null;
    }
},
  up_load: async (url) => {

      await bot.page.goto(url);
      await utils.sleep(3000);
      await bot.sendMessage('/start')
      await utils.sleep(5000);
      var up = await bot.getUsernamePassword();
      console.log("username, password:", up);
      return up;

},

  sendMessage: async (text) => {
	console.log('sendMessage', text)
	try {
	  await bot.page.click(elements.messageBox);
	  await utils.sleep(500);
	  await bot.page.type(elements.messageText, text, { delay: 10 });
      	  const sendButton = await bot.page.$x(elements.sendMessage);
	  await sendButton[0].click();
	} catch (e) {
	      console.log("SendMessage error",e);
    }

  },
  getUsernamePassword: async () => {
	const [usernamepass] = await bot.page.$x(elements.usernamePassword)
	const message = await bot.page.evaluate(link => link.innerText, usernamepass);
	var u_m = message.substring(message.indexOf('#username#')+10, 100);
	var user_id = u_m.substring(0,u_m.indexOf('#'));

	var p_m = message.substring(message.indexOf('#password#')+10, 100);
        var password = p_m.substring(0,p_m.indexOf('#'));
	return {"user_id" :  user_id, "password" : password }
  }
}

module.exports = bot;
