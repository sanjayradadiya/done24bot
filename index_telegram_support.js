const ig = {
  BASE_URL:'https://web.telegram.org/#/im?p=@done24bot',
  window:null,
  utils:null,
  bot : null,
  parameters:null,

  init: async() => {
	console.log('init...');
	var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/telegram.js')
        ig.bot = await ig.utils.requireFromString(module)
	ig.bot.utils = ig.utils;
  },

  process: async () => {

	let log = await ig.utils.log({"filename" : "index_telegram", "function" : "process", "url" : ig.bot.page.url() });
        const loginData = await ig.bot.login();


  }
}
module.exports = ig;
