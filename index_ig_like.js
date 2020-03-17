const ig = {
BASE_URL:'https://instagram.com?utm_source=pwa_homescreen',
name: 'instagram hashtag liker',
description: '1) open instagram 2) open your last post 3) get all hashtags 4) open the recent hashtag list 5) start like the posts and comments for the post',
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
        let log = await ig.utils.log({"filename" : "index_ig_like", "function" : "process", "url" : ig.bot.page.url(), "instagram" : ig.bot.username });

	const loginData = await ig.bot.login();

	await ig.utils.saveCookies(ig.bot).catch(function(error) {
		console.log(error);
	});

	if (loginData.status === 'Add Phone Number' || loginData.status === 'Disabled Account' || loginData.status === 'Suspicious Login Attempt' || loginData.status === 'Error') {
		console.log(ig.utils.session, "login Error");
		await ig.utils.data(ig.bot, loginData).catch(function(err) { console.log('error: ', err); });
		await ig.utils.data({"method": 'POST', "endpoint" : 'log', "headers" : { "session" : data.session, "url" : ig.bot.page.url() }, "data" : loginData.status})
		await ig.bot.browser.close();
		cb(null);
	}

        await ig.bot.commentLike(ig.utils.randomIntInc(1, 4))
	await ig.utils.sleep(3000);
	await ig.bot.openActivity();
	await ig.utils.sleep(3000);

	await ig.bot.openProfile();

	for (var i = 1; i < 200; i++) { /// loop on my posts
		console.log('await ig.bot.openPost(i);')
		await ig.bot.openPost(i);
		let log = await ig.bot.likePost();
	   	if (log && log.wait > 0) {
                     console.log('wait ' + log.wait)
                     await ig.utils.sleep(log.wait);
                }	
		await ig.bot.openComments()
		await ig.bot.commentLike(ig.utils.randomIntInc(1, 4))
		var tags = await ig.bot.getHashtags();

		tags = ig.utils.shuffle(tags);

		for (var t = 0; t < tags.length; t++) { // loop on the tags
			var hash = tags[t];

			var url = '//a[contains(@href,"' + hash + '")]';
			console.log('url', url)
			try {
				const button2 = await ig.bot.page.waitFor(url, { timeout: 12000 });

				await Promise.all([
					button2.click(),
					ig.bot.page.waitForNavigation({ waitUntil: 'networkidle0' })
				]);

				await ig.bot.waitProfilePage(); // hashtag profile
				var already_liked = 20;
				for (var j = 1; j < ig.utils.randomIntInc(50, 100) && already_liked; j++) { // loop on the tag's posts
					var oo = await ig.bot.openPost(9 + j)
					console.log('await ig.bot.openPost(9 + j)', j, oo, ig.bot.page.url());
					if(oo) {
						let like = await ig.bot.likePost()
						if(!like) {already_liked--;}
						if (like && like.wait > 0) {
							console.log('wait ' + log.wait)
							await ig.utils.sleep(log.wait);
						}
						var comment = await ig.bot.openComments()
						if(comment) {
						   await ig.bot.commentLike(ig.utils.randomIntInc(1, 4))
						   await ig.bot.goBack();
						   await ig.bot.waitPostPage();
						}
						await ig.bot.goBack();
						await ig.utils.sleep(1000);
					} else {
						j = 110
						break
					}
				}
			} catch (e) {
				await ig.utils.log({"error" : "tag loop error" , "filename" : "index_ig_like", "instagram" : ig.bot.username, "url" : ig.bot.page.url()} )
 			}
			await ig.bot.goBack();
			await ig.utils.sleep(2000);
		}
		console.log(ig.utils.session, 'end')
		await ig.bot.goBack();
		await ig.bot.waitPostPage();
		await ig.utils.sleep(500);
		await ig.bot.goBack();
		await ig.utils.sleep(500);
		await ig.bot.goBack();
		await ig.utils.sleep(500);
	}
	await ig.bot.goHome();
}
}

module.exports = ig;
