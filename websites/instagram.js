const ig = {

  elements: {
    wait: '//body[contains(@class,"wait-60-sec")]',
    error: '//body[contains(@class,"p-error")]',
    Instagram: '//img[@alt ="Instagram"]',
    loginButton1: '//*[contains(text(), "Log In")]',
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    loginButton2: '//button/div[contains(text(), "Log In")]',
    searchButton: '//*[@aria-label="Search & Explore"]',
    activityButton: '//*[@aria-label="Activity"]/..',
    activityText: '//h1[contains(text(),"Activity")]/..',
    profileButton: '//*[@aria-label="Profile"]',
    profileText: '//h1[contains(text(),"Profile")]',
    followingText: '//main//div[contains(text(),"Following")]',
    hashtagsText: '//main//span[contains(text(),"Hashtags")]',
    searchBar: 'input[placeholder="Search"]',
    newPostButton: '//*[contains(@aria-label,"New Post")]',
    saveLoginInfo: '//*[contains(text(),"Save Info")]',
    //firstSearchResult: 'ul > li:first-child > a',
    correctSearchResult: '//a//div',
    messagegButton: '//div/button[contains(text(), "Message")]',
    textArea: 'textArea',
    sendMessage: '//div/button[contains(text(), "Send")]',
    followButton: '//button[text() = "Follow"]',
    followBackButton: '//button[text() = "Follow Back"]',
    followingButton: '//*[text() = "Following" or @aria-label="Following"]',
    unfollowButton: '//button[text() = "Unfollow"]',
    profile: '//*[contains(@aria-label,"Profile")]',
    cancelButton: '//button[contains(text(),"Cancel")]',
    xButtonFindMore: '//*[contains(@class,"glyphsSpriteGrey_Close")]',
    addPhoneNumber: '//h2[contains(text(),"Add Your Phone Number")]',
    getApp: '//h1[contains(text(),"Get the Instagram App")]',
    notNowLink: '//a[contains(text(),"Not Now")]',
    addInstagramToHome: '//*[contains(text(),"Add Instagram to your Home screen?")]',
    turnOnNotifications: '//*[contains(text(),"Turn on Notifications")]',
    notNowButton: '//button[contains(text(),"Not Now")]',
    homeButton: '//a//span[@aria-label="Home"]',
    directMsgButton: '//a//span[@aria-label="Direct"]',
    directMsgReqButton: '//*[@id="react-root"]/section/div[2]/div/div/div[2]/div/div[1]/button',
    messageRequests: '//h1[contains(text(),"Message Requests")]',
    directMsgReqLists: '//*[@id="react-root"]/section/div[2]/div/div[2]/a',
    allow: '//div[contains(text(),"Allow")]',
    backLink: '//*[@aria-label="Back"]',
    disabledAccount: '//p[contains(text(),"Your account has been disabled for violating our terms")]',
    suspiciousLoginAttempt: '//*[contains(text(), "Suspicious Login Attempt")]',
    actionBlocked: '//*[contains(text(), "Action Blocked")]',
    temporaryBlocked: '//*[contains(text(), "Temporarily Blocked")]',
    reportProblem: '//*[contains(text(), "Report a Problem")]',
    following: '//*[contains(@href, "following")]',
    followers: '//*[contains(@href, "followers")]',
    see_all_followers: '//*[contains(text(), "See All Followers")]',
    followingItem: '//a[contains(@href,"/")]',
    hashtagItem: '//a[contains(@href,"explore") and contains(@href,"tags")]',
    profileMedia: '//a[contains(@href,"/p/")]',
    postUnfilledHeart: '//*[@aria-label="Like" and contains(@height,"24")]/..',
    postFilledHeart: '//*[@aria-label="Unlike" and contains(@height,"24")]/..',
    postComment: '//*[@aria-label="Comment"]/..',
    postUser: '//article//header//a',
    textPhoto: '//h1[text()="Photo" or text()="Post" or text()="Video"]',
    textComments: '//h1[text()="Comments"]',
    commentLike: '//*[@aria-label="Like" and contains(@height,"12")]/..',
    commentViewReplies: '//*[contains(text(),"View replies")]/..',
    profileFollowUnfollowtext: '//button[contains(text(),"Follow") or contains(text(),"Following") or contains(text(),"Message") or contains(text(),"Edit Profile")]',
    profilePostsNr: '//span//span[contains(.,"posts")]/span',
    profileFollowersNr: '//span/following-sibling::text()[contains(.,"followers")]/../span',
    profileFollowingNr: '//span/following-sibling::text()[contains(.,"following")]/../span',
    profileUsername: '//nav//header//h1',
    usernameFromPost: '//*[@id="react-root"]/section/main/div/div/article/header/div[2]/div[1]/div[1]/h2/a',
    isPrivate: '//*[contains(text(),"This Account is Private")]',
    notAvailableText: '//h2[contains(text(),"Sorry, this page isn\'t available.")]',
    videoControl: '//div[@aria-label="Control"]',
    viewerJSON: '//script[contains(text(),"window._sharedData = ")]/text()'
  },

  utils: null,
  page: null,
  username: null,

  open: async (username, password) => {
    await ig.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  },

  checkLogin: async () => {

    try {
      const profile = await ig.page.waitFor(ig.elements.profile, { timeout: 10000 });
      return true
    } catch (e) {
      return false
    }

  },

  login: async () => {
    console.log('login...')
    var element = ig.elements.newPostButton

    try {
      const profile = await ig.page.waitFor(element, { timeout: 10000 });
      await ig.getViewer();
      return { "status": "Logged In" }
    } catch (e) {
      console.log('Logging in...')
    }

    ig.cancelMessage();

    try {
      console.log('waiting for:', element);
      const profile = await ig.page.waitFor(element, { timeout: 300000 });
      ig.cancelMessage();
      await ig.getViewer();
      return { "status": "Logged In" }
    } catch (e) {
      console.log("Login Failed");
      console.log(e)
      var x = ig.catchError(); if (x) { return x; }
    }
  },

  getViewer: async () => {
    var innerHTML = await ig.page.evaluate((selector) => {
      let query = document.evaluate(selector, document, null, XPathResult.ANY_TYPE, null);
      var data = query.iterateNext();
      return data.textContent
    }, ig.elements.viewerJSON);

    innerHTML = innerHTML.replace('window._sharedData = ', '');
    innerHTML = innerHTML.substr(0, innerHTML.length - 1);
    ig.username = JSON.parse(innerHTML).config.viewer.username;
    ig.elements.profileButton = '//a[@href="/' + ig.username + '/"]'
  },

  catchError: async () => {
    try {
      await ig.page.waitFor(ig.elements.addPhoneNumber, { timeout: 200 });
      await ig.utils.log({ "message": "Add Phone Number" });
      return { "status": "Add Phone Number" }
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.disabledAccount, { timeout: 200 });
      await ig.utils.log({ "message": "Disabled Account" });
      return { "status": "Disabled Account" }
    } catch (e) { }
    try {
      await ig.page.waitFor(ig.elements.suspiciousLoginAttempt, { timeout: 200 });
      await ig.utils.log({ "message": "Suspicious Login Attempt" });
      return { "status": "Suspicious Login Attempt" }
    } catch (e) {
    }

    ig.cancelMessage();
    await ig.utils.log({ "message": "Login Error" });
    return { "status": "Login Error" }
  },
  cancelMessage: async () => {

    try {
      await ig.page.waitFor(ig.elements.getApp, { timeout: 1000 });
      const notNowLink = await ig.page.$x(ig.elements.notNowLink);
      await notNowLink[0].click();
      console.log("Not Now");
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.addInstagramToHome, { timeout: 1000 });
      const cancelButton = await ig.page.$x(ig.elements.cancelButton);
      await cancelButton[0].click();
      await ig.utils.log({ "message": "Add Instagram to your Home screen?" })
      console.log("Add Instagram to your Home screen?")
      ig.utils.saveCookies(ig)

    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.turnOnNotifications, { timeout: 1000 });
      const notNowButton = await ig.page.$x(ig.elements.notNowButton);
      await notNowButton[0].click();
      console.log("Turn on Notifications");
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.xButtonFindMore, { timeout: 1000 });
      const notNowButton = await ig.page.$x(ig.elements.xButtonFindMore);
      await notNowButton[0].click();
      console.log("Close Find More");
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.saveLoginInfo, { timeout: 30000 });
      const saveLoginInfo = await ig.page.$x(ig.elements.saveLoginInfo);
      await saveLoginInfo[0].click();
      console.log("Save Login Info")
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.actionBlocked, { timeout: 1000 });
      console.log("Action Blocked")
      await ig.page.screenshot({ path: 'action-blocked.png' });
      await ig.utils.log({ "message": "Action Blocked" })
      return "Action Blocked"
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.wait, { timeout: 1000 });
      console.log("wait")
      await ig.utils.log({ "message": "wait" })
      return "wait"
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.error, { timeout: 1000 });
      console.log("wait")
      await ig.utils.log({ "message": "error" })
      return "error"
    } catch (e) { }

    try {
      await ig.page.waitFor(ig.elements.temporaryBlocked, { timeout: 1000 });
      console.log("Teamporary Blocked")
      const notNowButton = await ig.page.$x(ig.elements.reportProblem);
      await notNowButton[0].click();
      await ig.utils.log({ "message": "Temporary Blocked" })
      return "Temporary Blocked"
    } catch (e) { }

  },
  goBack: async () => {
    console.log('goBack');
    ig.cancelMessage();
    try {
      const backLink = await ig.page.$x(ig.elements.backLink);
      await backLink[0].click();
      await ig.utils.sleep(1000)
    } catch (e) { return }

  },

  goHome: async () => {
    console.log('goHome')
    const homeButton = await ig.page.waitFor(ig.elements.homeButton, { timeout: 5000 });
    await homeButton.click();
    await ig.page.waitFor(ig.elements.Instagram, { timeout: 5000 });
  },

  navigateDirectMessage: async () => {
    console.log('navigateDirectMessage')
    ig.cancelMessage();
    await ig.goBack();
    await ig.goHome()

    console.log('click Direct Message');
    const directMsgButton = await ig.page.waitFor(ig.elements.directMsgButton, { timeout: 3000 });
    await directMsgButton.click();
  },

  navigateFollowing: async () => {
    console.log('navigateFollowing')
    const followingButton = await ig.page.waitFor(ig.elements.following, { timeout: 10000 });
    await followingButton.click();
    await ig.page.waitFor(ig.elements.followingText, { timeout: 10000 });
  },

  follow: async () => {
    console.log('follow')
    const followButton = await ig.page.waitFor(ig.elements.followButton, { timeout: 300 });
    await followButton.click();
    try {
      const followingButton = await ig.page.waitFor(ig.elements.followingButton, { timeout: 3000 });
      return true
    } catch (e) {
      try {
        const followingButton = await ig.page.waitFor(ig.elements.followBackButton, { timeout: 3000 });
        return true;
      } catch (e) {
        return false;
      }
    }
  },

  unfollow: async () => {
    console.log('unfollow')
    const followingButton = await ig.page.waitFor(ig.elements.followingButton, { timeout: 3000 });
    await followingButton.click();

    try {
      const unfollowButton = await ig.page.waitFor(ig.elements.unfollowButton, { timeout: 3000 });
      await unfollowButton.click();
      console.log('unfollow clicked');
      // notify server
    } catch (e) {
      console.log("follow is missed")
      //
      return 'failed'
    }

    try {
      const followButton = await ig.page.waitFor(ig.elements.followButton, { timeout: 3000 });
      // notify server
      //unfollow success
    } catch (e) {
      console.log("unfollow is missed")
      //
      return 'failed'
    }
  },

  navigateFollowers: async () => {
    console.log('navigateFollowers')
    const followerButton = await ig.page.waitFor(ig.elements.followers, { timeout: 10000 });
    await followerButton.click();
    try {
      const followerButton = await ig.page.waitFor(ig.elements.see_all_followers, { timeout: 10000 });
      await followerButton.click();
    } catch (e) { }
    await ig.page.waitFor(2000);
  },

  commentLike: async (nr) => {
    console.log('commentLike', ig.page.url())
    await ig.page.waitFor(2000);
    ig.cancelMessage();
    links = await ig.page.evaluate((selector, nr) => {
      let query = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0, length = Math.min(nr, query.snapshotLength); i < length; ++i) {
        var elem = query.snapshotItem(i)
        elem.click()
      }
    }, ig.elements.commentLike, nr);
    await ig.utils.sleep(2000);
  },

  // ----------------------------------------
  getFollowers: async () => {
    console.log('getFollowers')
    var links = [];
    do {
      var allLinks = links;
      await ig.page.waitFor(2000);
      links = await ig.page.evaluate((selector) => {
        let results = [];
        let query = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          var elem = query.snapshotItem(i).href
          if (elem.indexOf('/following/') < 1 && elem.indexOf('/hashtag_following/') < 1) {
            elem = elem.replace(/https:\/\/www.ig.com\//g, '')
            elem = elem.replace(/\//g, '')
            elem !== 'accountsactivity' && elem !== '' && elem !== 'explore' && results.indexOf(elem) === -1 ? results.push(elem) : console.log("This item already exists");
          }

        }
        return results;
      }, ig.elements.followingItem);
      console.log("links", links.length, "allLinks", allLinks.length);
    } while (allLinks.length != links.length)
    console.log("all followed total:", allLinks.length);
    return allLinks;
  },

  openHashtags: async (nr) => {
    console.log('openHashtags')
    await ig.openProfile();
    await ig.navigateFollowing();

    const button = await ig.page.waitFor(ig.elements.hashtagsText, { timeout: 6000 });
    await Promise.all([
      button.click(),
      ig.page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await ig.utils.sleep(2000)
    const tags = await ig.getHashtags();
    console.log(tags)

    var url = '//a[contains(@href,"' + tags[Math.min(nr, tags.length)] + '")]/img/.';
    console.log('url', url)

    const button2 = await ig.page.waitFor(url, { timeout: 6000 });

    await Promise.all([
      button2.click(),
      ig.page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await ig.waitProfilePage();
    await ig.utils.sleep(2000)
  },

  getHashtags: async () => {
    console.log('getHashtags')
    var links = [];
    do {
      var allLinks = links;
      await ig.page.waitFor(2000);
      links = await ig.page.evaluate((selector) => {
        let results = [];
        let query = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          //var elem = query.snapshotItem(i)
          //results.indexOf(elem) === -1 ? results.push(elem) : console.log("This item already exists");

          var elem = query.snapshotItem(i).href
          if (elem.indexOf('/following/') < 1 && elem.indexOf('/hashtag_following/') < 1) {
            elem = elem.replace(/https:\/\/www.instagram.com\//g, '')
            elem = elem.replace(/explore\/tags/g, '')
            elem = elem.replace(/\//g, '')
            elem !== 'accountsactivity' && elem !== '' && elem !== 'explore' && results.indexOf(elem) === -1 ? results.push(elem) : console.log("This item already exists");
          }
        }
        return results;
      }, ig.elements.hashtagItem);
      console.log("links", links.length, "allLinks", allLinks.length);
    } while (allLinks.length != links.length)

    for (var x = links.length - 1; x > -1; x--) {
      if (links[x].indexOf('%') > -1) {
        links.splice(x, 1);
      }
      if (links[x].indexOf(ig.session) > -1) {
        links.splice(x, 1);
      }
    }

    return links
  },


  openPost: async (nr) => {
    console.log('openPost', nr)
    await ig.page.waitFor(2000);
    links = []
    try {
      const linkHandlers = await ig.page.$x(ig.elements.profileMedia);
      await linkHandlers[Math.min(linkHandlers.length, nr - 1)].click();
      return await ig.waitPostPage();
    } catch (e) {
      await ig.utils.log({ "error": "openPost", "url": ig.page.url() })
      console.log('error openPost', e)
      return false;
    }
  },

  openProfile: async (nr) => {
    console.log('openProfile');
    try {
      const button = await ig.page.waitFor(ig.elements.profileButton, { timeout: 12000 });
      await button.click(),
        await ig.waitProfilePage();
    } catch (e) {
      await ig.utils.log({ "error": "openProfile", "url": ig.page.url() })

      console.log("openProfile Error", e)
    }
  },

  waitProfilePage: async () => {
    console.log('waitProfilePage')
    try {
      await ig.page.waitFor(ig.elements.profileFollowUnfollowtext, { timeout: 15000 });
      try {
        await ig.page.waitFor(ig.elements.isPrivate, { timeout: 100 });
        return 'private';
      } catch (e) {
        return true;
      }
    } catch (e) {
      console.log('waitProfilePage Error', e)
      return false;
    }
  },

  waitPostPage: async () => {
    try {
      await ig.page.waitFor(ig.elements.textPhoto, { timeout: 6000 });
      return true;
    } catch (e) {
      await ig.utils.log({ "error": "waitPostPage", "url": ig.page.url() })

      return false;
    }
  },

  openActivity: async (nr) => {
    console.log('openActivity');
    try {
      const button = await ig.page.waitFor(ig.elements.activityButton, { timeout: 30000 });
      await button.click(),
        await ig.waitActivityPage();
    } catch (e) {
      await ig.utils.log({ "error": "openActivity", "url": ig.page.url() })
      console.log("openActivity Error", e)
    }
  },

  waitActivityPage: async () => {
    console.log('waitActivityPage')
    try {
      await ig.page.waitFor(ig.elements.activityText, { timeout: 6000 });
    } catch (e) {
      await ig.utils.log({ "error": "waitActivityPage", "url": ig.page.url() })
      console.log('waitActivityPage Error', e, ig.page.url())
    }
  },

  likePost: async () => {

    return new Promise((resolve, reject) => {

    ig.cancelMessage();
    console.log('likePost', ig.page.url());

    ig.page.waitFor(ig.elements.postFilledHeart, { timeout: 100 })
	.then( () => {
	      console.log('Already been liked');
      	      resolve();
	}).catch ( async () => {
    try {
        const likeButton = await ig.page.waitFor(ig.elements.postUnfilledHeart, { timeout: 3000 });
        await likeButton.click();
        await ig.utils.sleep(500);
        await ig.page.waitFor(ig.elements.postFilledHeart, { timeout: 3000 });
        await ig.utils.saveCookies(ig);
	let log = await ig.utils.log({"message" : "like" , "instagram" : ig.username, "url" : ig.page.url()} )
        resolve(log);
    } catch (e) {
	console.log('likePost error', e)
        await ig.utils.log({ "error": "likePost", "url": ig.page.url(), "error message": e })
        reject(false);
    }
    })

   })
  },

  openComments: async () => {
    ig.cancelMessage();
    console.log('openComments', ig.page.url());
    try {
      const commentButton = await ig.page.waitFor(ig.elements.postComment, { timeout: 3000 });
      await commentButton.click();
      await ig.page.waitFor(ig.elements.textComments, { timeout: 3000 });
      return true;
    } catch (e) {
      await ig.utils.log({ "error": "openComments", "url": ig.page.url() })
      console.log('openComments', e, ig.page.url());
      return false;
    }
  },

  openPostUser: async () => {
    ig.cancelMessage();
    console.log('openPostUser');
    try {
      const commentButton = await ig.page.waitFor(ig.elements.postUser, { timeout: 3000 });
      await commentButton.click();
      await ig.waitProfilePage();
      return true;
    } catch (e) {
      await ig.utils.log({ "error": "openPostUser", "url": ig.page.url() })
      console.log(e, ig.page.url());
      return false;
    }
  },


  navigateDirectMessageRequests: async () => {
    try {
      await ig.page.reload();
      ig.cancelMessage();
      const directMsgReqButton = await ig.page.waitFor(ig.elements.directMsgReqButton, { timeout: 3000 });
      directMsgReqButton.click();
      console.log('Message Requests');
      try {
        await ig.page.waitFor(ig.elements.messageRequests, { timeout: 3000 });
        const directMsgReqLists = await ig.page.$x(ig.elements.directMsgReqLists);
        await directMsgReqLists[0].click();
        const allow = await ig.page.waitFor(ig.elements.allow, { timeout: 2000 });
        allow.click();
      } catch (e) {
      }
    } catch (e) {
    }
  },

  openSearch: async () => {

    const searchButton = await ig.page.waitFor(ig.elements.searchButton, { timeout: 5000 });
    await Promise.all([
      searchButton.click(),
      ig.page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await ig.page.waitFor(ig.elements.searchBar, { timeout: 5000 });
    await ig.utils.sleep(2000);

  },

  navigateToExampleProfile: async (userhandle) => {
    console.log('navigateToExampleProfile')
    //ig.cancelMessage();
    try {

      await ig.openSearch();

      await ig.page.type(ig.elements.searchBar, userhandle);

      const searchResult = await ig.page.waitFor(`${ig.elements.correctSearchResult}[contains(text(), "${userhandle}")]`, { timeout: 10000 });
      await searchResult.click();

      return await ig.waitProfilePage()
    } catch (e) {
      console.log(e)
      return { "status": "No Profile" }
    }
  },

  getUsernameFromPost: async () => {
    var result = '';
    console.log('getUsernameFromPost');
    try {
      result = await ig.page.evaluate((selector) => {
        const username = document.evaluate(selector.usernameFromPost, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        try {
          for (let i = 0, length = username.snapshotLength; i < length; ++i) {
            var elem = username.snapshotItem(i).href
            elem = elem.match(/(?:(?:http|https):\/\/)?(?:www.)?(?:ig.com|instagr.am)\/([A-Za-z0-9-_]+)/im)
            return elem.length > 1 ? elem[1] : null;
          }
        } catch (e) {
          console.log('getUsernameFromPost', e);
        }
      }, ig.elements);
    } catch (e) {
      console.log(e);
    }
    return result;
  },

  getProfileData: async () => {
    var result = [];
    await ig.page.evaluate(async (elements) => {
      var username = await document.evaluate(ig.elements.profileUsername, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = username.snapshotLength; i < length; ++i) {
        results.push(username.snapshotItem(i));
      }
      var posts = await document.evaluate(ig.elements.profilePostsNr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = posts.snapshotLength; i < length; ++i) {
        results.push(posts.snapshotItem(i));
      }
      var followers = await document.evaluate(ig.elements.profileFollowersNr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0, length = followers.snapshotLength; i < length; ++i) {
        results.push(followers.snapshotItem(i));
      }

      var following = await document.evaluate(ig.elements.profileFollowingNr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0, length = following.snapshotLength; i < length; ++i) {
        results.push(following.snapshotItem(i));
      }

      return { "status": "profile was found", "result": result }
    }, ig.elements);

    return result;
  },


  follow: async text => {
    console.log('follow');
    try {
      const followButton = await ig.page.waitFor(ig.elements.followButton, { timeout: 5000 });
      await followButton.click();
      await ig.page.waitFor(ig.elements.followingButton, { timeout: 5000 });
      return true;
    } catch (e) {
      console.log('already been followed');
      return false;
    }
  },

  sendSampleMessage: async text => {
    try {
      await ig.page.waitFor(1000);
      const messageButton = await ig.page.waitFor(ig.elements.messageButton);
      await messageButton.click();

      await ig.page.waitFor(3000);
      await ig.page.type(ig.elements.textArea, text, { delay: 10 });
      const sendButton = await ig.page.$x(ig.elements.sendMessage);
      await sendButton[0].click();
      await ig.page.waitFor(1000);
    } catch (e) {
      await ig.utils.log({ "error": "sendSampleMessage", "url": ig.page.url() })
      console.log("can't send message");
      return { "status": "Can't send message. You might be blocked." }
    }
  },

  turnOffNotification: async () => {
    try {
      await ig.page.waitFor(ig.elements.turnOnNotifications, { timeout: 100 });
      const notNowButton = await ig.page.$x(ig.elements.notNowButton);
      await notNowButton[0].click();
      console.log("Turn on Notifications");
    } catch (e) {
    }
  },

  mainFeedLike: async (viewStoriesCount) => {
    await ig.page.waitFor(2000);
    await ig.cancelMessage();
    try {

      let article = null;
      let count = 0;
      while (viewStoriesCount > count) {
        console.log(count + 1);

        await ig.turnOffNotification();

        if (count === 0) {
          article = await ig.page.$('article');

          await ig.page.evaluate((ele) => {
            ele.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }, article);

          await ig.likePostByArticleNode(article);
          count++;
        } else {

          article = await ig.page.evaluateHandle(el => el.nextElementSibling, article);

          const type = await article.evaluate(node => node.tagName);

          if (type === 'ARTICLE') {
            await ig.page.evaluate((ele) => {
              ele.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
              });
            }, article);

            await ig.likePostByArticleNode(article);

            count++;
          } else {
            console.log('skip node other then article');
          }
        }

        await ig.utils.sleep(2000);
      }

    } catch (e) { console.log(e); }
    await ig.utils.sleep(2000);
  },

  likePostByArticleNode: async (element) => {
    try {
      await ig.utils.sleep(1500);
      const likeButtonXpath = await ig.createXPathFromElement(element) + '/div[2]/section[1]/span[1]/button';
      await ig.page.evaluate((element) => {
        const likeButtonEle = document.evaluate(element, document, null, XPathResult.ANY_TYPE, null);
        const likeButton = likeButtonEle.iterateNext();
        likeButton && likeButton.click();
      }, likeButtonXpath);
      let log = await ig.utils.log({"message" : "like" , "instagram" : ig.username, "url" : ig.page.url()} )
      return(log)
    } catch (e) {
      await ig.utils.log({ "error": "likePostByArticleNode", "url": ig.page.url(), "error" : e })
    }
  },

  createXPathFromElement: async (ele) => {
    return await ig.page.evaluate((element) => {
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

module.exports = ig;
