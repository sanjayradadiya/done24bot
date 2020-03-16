const li = {
    BASE_URL: 'https://www.linkedin.com',
    description: 'Like the main feed on linkedin',
    window: null,
    utils: null,
    bot: null,
    form: [{ "id": "nr_of_likes", "elem" : "input", "placeholder" : "nr of likes"}],

    parameters: null,

    init: async () => {
        console.log('init...');
        var module = await li.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/linkedin.js');
        li.bot = await li.utils.requireFromString(module);
        li.bot.utils = li.utils;
    },

    process: async () => {
        console.log('process');
        let log = await li.utils.log({ "filename": "index_in_like_only", "function": "process", "url": li.bot.page.url(), "linkedin": li.bot.username });


        const loginData = await li.bot.login();

        await li.utils.saveCookies(li.bot).catch(function (error) {
            console.log(error);
        });

        await li.utils.sleep(1000);

        try {
            await li.bot.mainFeedLike(li.parameters.nr_of_likes);
        } catch (e) {
            console.log(e);
        }

    },
}

module.exports = li;
