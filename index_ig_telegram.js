const ig = {
BASE_URL:'https://instagram.com?utm_source=pwa_homescreen',
description: 'From telegram groups likes all links from the last 24h where the account been seen, use the user_id been given in telegram @done24bot after you type /start',
utils:null,
parameters:{},
form: [{ "id": "v_user_id", "elem" : "input", "placeholder" : "user_id from telegram @done24boti (type /start there)"}],
urls:null,
init: async() => {
	console.log('init.......new');
	var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/instagram.js')
        ig.bot = await ig.utils.requireFromString(module)
	ig.bot.utils = ig.utils;

	console.log('....loading urls');
	ig.urls = await utils.data ({"method" : "GET", "endpoint" : 'tglist',  "headers" : { "telegram_id" : ig.parameters.v_user_id} })
	ig.urls = ig.urls.urls;
	console.log('urls:', ig.urls);
},

like_posts: async () => {

	for (var i = 0; i < ig.urls.length; i++) { /// loop on my posts 
                await ig.bot.page.goto('https://www.instagram.com/p/' + ig.urls[i] + '/');
                
                var log = await ig.bot.likePost();
                if (log.wait > 0) {
		    console.log(log);
                    console.log('wait ' + log.wait)
                    await ig.utils.sleep(log.wait);
                }
                await ig.utils.sleep(3000);
        }
},

process: async () => {
	console.log('process');
        let log = await ig.utils.log({"filename" : "index_ig_like", "function" : "process", "url" : ig.bot.page.url(), "instagram" : ig.bot.username, "telegram_id" : ig.parameters.v_user_id });

	const loginData = await ig.bot.login();
	console.log('logged in ...', ig.urls.length)
	while(ig.urls.length > 0) {
		console.log('urls:', ig.urls)
		await ig.utils.saveCookies(ig.bot).catch(function(error) {
            	    console.log(error);
        	});  

		ig.urls = await utils.data ({"method" : "GET", "endpoint" : 'tglist',  "headers" : { "telegram_id" : ig.parameters.v_user_id} })
        	ig.urls = ig.urls.urls;
		console.log('start loop');
		await ig.like_posts();
	}

}
}

module.exports = ig;
