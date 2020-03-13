const ig = {
BASE_URL:'https://instagram.com?utm_source=pwa_homescreen',
description: 'Log in with username/password to instagram',
utils:null,
parameters:{},
form: [{ "id": "v_username", "type" : "input", "placeholder" : "Username"}, { "id": "v_password", "type" : "input", "placeholder" : "Password"}],
init: async() => {
	console.log('init.......new');
	var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/instagram.js')
        ig.bot = await ig.utils.requireFromString(module)
	ig.bot.utils = ig.utils;
},

process: async () => {
	console.log('process');
        let log = await ig.utils.log({"filename" : "index_ig_login", "function" : "process", "url" : ig.bot.page.url(), "instagram" : ig.bot.username });

	const loginData = await ig.bot.login();
	console.log('logged in ...', ig.urls.length)
}
}

module.exports = ig;
