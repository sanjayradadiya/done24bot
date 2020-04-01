const ig = {
BASE_URL:'https://www.amazon.com.au',
description: 'Dummy Script for developers, it opens the amazon.com.au website.',
window:null,
utils:null,
bot : null,
lodash : null,
parameters:null,
form: [],

init: async() => {
	console.log('init...');
	var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/amazon.com.au.js')
        ig.bot = await ig.utils.requireFromString(module)
	ig.bot.utils = ig.utils;

	var lodash = await ig.utils.httpRequestText('https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/lodash.js');
	ig.lodash = await ig.utils.requireFromString(lodash)
	
},

process: async () => {

	console.log('process');
        let log = await ig.utils.log({"filename" : "index_az_dummy", "function" : "process", "url" : ig.bot.page.url(), "instagram" : ig.bot.username });

	const loginData = await ig.bot.login();

	await ig.utils.saveCookies(ig.bot).catch(function(error) {
		console.log(error);
	});

	await ig.utils.sleep(30000000);

 }
}
module.exports = ig;
