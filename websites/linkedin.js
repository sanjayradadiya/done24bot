const li = {

	elements: {
		signInButton: '//*[@id="app__container"]/main/div/div[2]/form/div[3]/button',
		newPostButton: '//*[@id="share-prompt-link"]',
		likeButton: '//*[@id="reactions-list"]/div[1]/button',
		username: 'input[id="username"]',
		password: 'input[id="password"]'
	},

	utils: null,
	page: null,
	username: null,

	open: async () => {
		await li.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
	},

	checkLogin: async () => {
		try {
			await li.page.waitFor(li.elements.profile, { timeout: 10000 });
			return true
		} catch (e) {
			return false
		}
	},

	login: async (username, password) => {
		console.log('login...')
		var element = li.elements.newPostButton

		try {
			await li.page.waitFor(element, { timeout: 10000 });
			return { "status": "Logged In" }
		} catch (e) {
			console.log('Logging in...')
		}

		try {
			console.log('waiting for:', element);

			if (username && password) {
				try {
					const loginButton = await li.page.$x(li.elements.signInButton);
					await loginButton[0].click();
				} catch (e) {
					var x = li.catchError(); if (x) { return x; }
				}
				await li.page.waitFor(1000);

				await li.page.type(li.elements.username, username, { delay: 50 });
				await li.page.type(li.elements.password, password, { delay: 50 });

				const loginButton2 = await li.page.$x(elements.loginButton2);
				await loginButton2[0].click();
				try {
					await li.page.waitFor(element, { timeout: 300000 });
					return { "status": "Logged In" }
				} catch (e) {
					return 'Does not logged in';
				}
			}

			await li.page.waitFor(element, { timeout: 300000 });
			return { "status": "Logged In" }
		} catch (e) {
			console.log("Login Failed");
			console.log(e)
			var x = li.catchError(); if (x) { return x; }
		}
	},

	catchError: async () => {
		await li.utils.log({ "message": "Login Error" });
		return { "status": "Login Error" }
	},

	mainFeedLike: async (viewStoriesCount) => {
		await li.page.waitFor(2000);
		try {

			let article = null;
			let count = 0;
			while (viewStoriesCount > count) {
				console.log(count + 1);

				if (count === 0) {
					article = await li.page.$('ol#feed-container > li.feed-item');

					await li.page.evaluate((ele) => {
						ele.scrollIntoView({
							behavior: 'smooth',
							block: 'start'
						});
					}, article);

					await li.likePostByArticleNode(article);
					count++;
				} else {

					article = await li.page.evaluateHandle(el => el.nextElementSibling, article);

					const type = await article.evaluate(node => node.tagName);

					if (type === 'LI') {
						await li.page.evaluate((ele) => {
							ele.scrollIntoView({
								behavior: 'smooth',
								block: 'start'
							});
						}, article);

						await li.likePostByArticleNode(article);

						count++;
					} else {
						console.log('skip node other then li element');
					}
				}

				await li.utils.sleep(2000);
			}

		} catch (e) { console.log(e); }
		await li.utils.sleep(2000);
	},

	likePostByArticleNode: async (element) => {
		try {
			await li.utils.sleep(1500);
			const likeButtonXpath = await li.createXPathFromElement(element) + '/section/div[2]/button[1]';
			const [likeButtonOuter] = await li.page.$x(likeButtonXpath);
			if (likeButtonOuter) {
				await likeButtonOuter.click();
				await li.utils.sleep(1200);
				const [likeButtonInner] = await li.page.$x(li.elements.likeButton);
				if (likeButtonInner) {
					await likeButtonInner.click();
				}
			}
			let log = await li.utils.log({ "message": "like", "linkedin": li.username, "url": li.page.url() });
			return (log);
		} catch (e) {
			await li.utils.log({ "error": "likePostByArticleNode", "url": li.page.url(), "error": e });
		}
	},

	createXPathFromElement: async (ele) => {
		return await li.page.evaluate((element) => {
			const idx = (sib, name) => sib
				? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name)
				: 1;
			const segs = elm => !elm || elm.nodeType !== 1
				? ['']
				: elm.id && document.getElementById(elm.id) === elm
					? [`id("${elm.id}")`]
					: [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
			return segs(element).join('/');
		}, ele);
	}

};

module.exports = li;
