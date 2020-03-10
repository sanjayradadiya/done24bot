const ig = {
    BASE_URL: 'https://instagram.com?utm_source=pwa_homescreen',
    description: 'Like the main feed on instagram',
    window: null,
    utils: null,
    bot: null,
    form: [{ "id": "nr_of_likes", "type" : "input", "placeholder" : "nr of likes"}],

    parameters: null,

    init: async () => {
        console.log('init...');
        var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/instagram.js');
        ig.bot = await ig.utils.requireFromString(module)
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
            await ig.bot.mainFeedLike(ig.parameters.nr_of_likes);
        } catch (e) {
            console.log(e);
        }

    },
}

module.exports = ig;
