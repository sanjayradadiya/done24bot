const ig = {
BASE_URL:'https://instagram.com?utm_source=pwa_homescreen',
description: 'Just a dummy script for development/testing. It just wait with the login ....',
window:null,
utils:null,
bot : null,
parameters:null,

init: async() => {
	console.log('init...');
	var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/instagram.js')
        ig.bot = await ig.utils.requireFromString(module)
	ig.bot.utils = ig.utils;
},

process: async () => {
	console.log('process');
        let log = await ig.utils.log({"filename" : "index_ig_dummy", "function" : "process", "url" : ig.bot.page.url(), "instagram" : ig.bot.username });

	const loginData = await ig.bot.login();

	await ig.utils.saveCookies(ig.bot).catch(function(error) {
		console.log(error);
	});

	await ig.utils.sleep(30000000);

}
}

module.exports = ig;
