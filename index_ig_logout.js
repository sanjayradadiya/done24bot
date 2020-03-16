const ig = {
BASE_URL:'https://instagram.com?utm_source=pwa_homescreen',
description: 'Logout from Instagram (delete the cookies on the current logged in page)',
utils:null,
parameters:{},
form: {},
init: async() => {
	var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/instagram.js')
        ig.bot = await ig.utils.requireFromString(module)
	ig.bot.utils = ig.utils;
},

process: async () => {
	console.log('process');
        let log = await ig.utils.log({"filename" : "index_ig_logout", "function" : "process", "url" : ig.bot.page.url(), "instagram" : ig.bot.username });

	await ig.utils.deleteCookies(ig.bot).catch(function(error) {
                console.log(error);
        });

	await ig.utils.saveCookies(ig.bot).catch(function(error) {
                console.log(error);
        });

}
}

module.exports = ig;
