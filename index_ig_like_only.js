const ig = {
    BASE_URL: 'https://instagram.com?utm_source=pwa_homescreen',
    name: 'instagram hashtag liker',
    description: '1) open instagram 2) open your last opst 3) get the hashtags 4) open the recent hashtag list 5) start like the posts and post comments',
    window: null,
    utils: null,
    bot: null,
    parameters: null,

    init: async () => {
        console.log('init...');
        var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/instagram.js');
        // ig.bot = await ig.utils.requireFromString(module)
        ig.bot = require('./websites/instagram');
        ig.bot.utils = ig.utils;
    },

    process: async () => {
        console.log('process');
        let log = await ig.utils.log({ "filename": "index_ig_like_only", "function": "process", "url": ig.bot.page.url(), "instagram": ig.bot.username });


        const loginData = await ig.bot.login();

        await ig.utils.saveCookies(ig.bot).catch(function (error) {
            console.log(error);
        });

        if (loginData.status === 'Add Phone Number' || loginData.status === 'Disabled Account' || loginData.status === 'Suspicious Login Attempt' || loginData.status === 'Error') {
            console.log(ig.utils.session, "login Error");
            await ig.utils.data(ig.bot, loginData).catch(function (err) { console.log('error: ', err); });
            await ig.utils.data({ "method": 'POST', "endpoint": 'log', "headers": { "session": data.session, "url": ig.bot.page.url() }, "data": loginData.status })
            await ig.bot.browser.close();
            cb(null);
        }

        await ig.utils.sleep(1000);

        try {
            await ig.bot.viewStories(10);
        } catch (e) {
            console.log(e);
        }

    },
}

module.exports = ig;
