var utils = require('../common/utils');

const elements = {
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
  viewerJSON :'//script[contains(text(),"window._sharedData = ")]/text()'
};

const instagram = {
  page: null,
  elements: elements,
  username: null,

  open: async (username, password) => {
    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  },

  checkLogin: async() => {

   try {
      const profile = await instagram.page.waitFor(elements.profile, { timeout: 10000 });
      return true
   } catch (e) {
      return false
   }	

  },

  login: async () => {
    console.log('login...')
    var element = elements.newPostButton

    try {
      const profile = await instagram.page.waitFor(element, { timeout: 10000 });
      await instagram.getViewer();
      return { "status": "Logged In" }
    } catch (e) {
      console.log('Logging in...')
    }

    instagram.cancelMessage();

    try {
      console.log('waiting for:', element);
      const profile = await instagram.page.waitFor(element, { timeout: 300000 });
      instagram.cancelMessage();
      await instagram.getViewer();
      return { "status": "Logged In" }
    } catch (e) {
      console.log("Login Failed");
      console.log(e)
      var x = instagram.catchError(); if (x) { return x; }
    }
  },

  getViewer: async () => {
	var innerHTML = await instagram.page.evaluate((selector) => {
      		let query = document.evaluate(selector, document, null, XPathResult.ANY_TYPE, null);
		var data = query.iterateNext();
		return data.textContent
    	}, elements.viewerJSON);

	innerHTML = innerHTML.replace('window._sharedData = ','');
	innerHTML = innerHTML.substr(0,innerHTML.length-1)	;
	instagram.username = JSON.parse(innerHTML).config.viewer.username;
	elements.profileButton = '//a[@href="/'+instagram.username+'/"]'
  },

  catchError: async () => {
    try {
      await instagram.page.waitFor(elements.addPhoneNumber, { timeout: 200 });
      await utils.log({"message" : "Add Phone Number"});
      return { "status": "Add Phone Number" }
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.disabledAccount, { timeout: 200 });
      await utils.log({"message" : "Disabled Account"});
      return { "status": "Disabled Account" }
    } catch (e) { }
    try {
      await instagram.page.waitFor(elements.suspiciousLoginAttempt, { timeout: 200 });
      await utils.log({"message" : "Suspicious Login Attempt"});
      return { "status": "Suspicious Login Attempt" }
    } catch (e) {
    }

    instagram.cancelMessage();
    await utils.log({"message" : "Login Error"});
    return { "status": "Login Error" }
  },
  cancelMessage: async () => {

    try {
      await instagram.page.waitFor(elements.getApp, { timeout: 1000 });
      const notNowLink = await instagram.page.$x(elements.notNowLink);
      await notNowLink[0].click();
      console.log("Not Now");
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.addInstagramToHome, { timeout: 1000 });
      const cancelButton = await instagram.page.$x(elements.cancelButton);
      await cancelButton[0].click();
      await utils.log({"message" : "Add Instagram to your Home screen?"} )
      console.log("Add Instagram to your Home screen?")
      utils.saveCookies(instagram)

    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.turnOnNotifications, { timeout: 1000 });
      const notNowButton = await instagram.page.$x(elements.notNowButton);
      await notNowButton[0].click();
      console.log("Turn on Notifications");
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.xButtonFindMore, { timeout: 1000 });
      const notNowButton = await instagram.page.$x(elements.xButtonFindMore);
      await notNowButton[0].click();
      console.log("Close Find More");
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.saveLoginInfo, { timeout: 30000 });
      const saveLoginInfo = await instagram.page.$x(elements.saveLoginInfo);
      await saveLoginInfo[0].click();
      console.log("Save Login Info")
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.actionBlocked, { timeout: 1000 });
      console.log("Action Blocked")
      await instagram.page.screenshot({path: 'action-blocked.png'});
      await utils.log({"message" : "Action Blocked"} )
      return "Action Blocked"
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.wait, { timeout: 1000 });
      console.log("wait")
      await utils.log({"message" : "wait"} )
      return "wait"
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.error, { timeout: 1000 });
      console.log("wait")
      await utils.log({"message" : "error"} )
      return "error"
    } catch (e) { }

    try {
      await instagram.page.waitFor(elements.temporaryBlocked, { timeout: 1000 });
      console.log("Teamporary Blocked")
      const notNowButton = await instagram.page.$x(elements.reportProblem);
      await notNowButton[0].click();
      await utils.log({"message" : "Temporary Blocked"} )
      return "Temporary Blocked"
    } catch (e) { }

  },
  goBack: async () => {
    console.log('goBack');
    instagram.cancelMessage();
    try {
      const backLink = await instagram.page.$x(elements.backLink);
      await backLink[0].click();
      await utils.sleep(1000)
    } catch (e) { return }

  },

  goHome: async () => {
    console.log('goHome')
    const homeButton = await instagram.page.waitFor(elements.homeButton, { timeout: 5000 });
    await homeButton.click();
    await instagram.page.waitFor(elements.Instagram, { timeout: 5000 });
  },

  navigateDirectMessage: async () => {
    console.log('navigateDirectMessage')
    instagram.cancelMessage();
    await instagram.goBack();
    await instagram.goHome()

    console.log('click Direct Message');
    const directMsgButton = await instagram.page.waitFor(elements.directMsgButton, { timeout: 3000 });
    await directMsgButton.click();
  },

  navigateFollowing: async () => {
    console.log('navigateFollowing')
    const followingButton = await instagram.page.waitFor(elements.following, { timeout: 10000 });
    await followingButton.click();
    await instagram.page.waitFor(elements.followingText, { timeout: 10000 });
  },

  follow: async () => {
    console.log('follow')
    const followButton = await instagram.page.waitFor(elements.followButton, { timeout: 300 });
    await followButton.click();
    try {
      const followingButton = await instagram.page.waitFor(elements.followingButton, { timeout: 3000 });
      return true
    } catch (e) {
	try {
		const followingButton = await instagram.page.waitFor(elements.followBackButton, { timeout: 3000 });	
		return true;
	} catch (e) {
		return false;
	}
    }
  },

  unfollow: async () => {
    console.log('unfollow')
    const followingButton = await instagram.page.waitFor(elements.followingButton, { timeout: 3000 });
    await followingButton.click();

    try {
      const unfollowButton = await instagram.page.waitFor(elements.unfollowButton, { timeout: 3000 });
      await unfollowButton.click();
      console.log('unfollow clicked');
      // notify server
    } catch (e) {
      console.log("follow is missed")
      //
      return 'failed'
    }

    try {
      const followButton = await instagram.page.waitFor(elements.followButton, { timeout: 3000 });
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
    const followerButton = await instagram.page.waitFor(elements.followers, { timeout: 10000 });
    await followerButton.click();
    try {
      const followerButton = await instagram.page.waitFor(elements.see_all_followers, { timeout: 10000 });
      await followerButton.click();
    } catch (e) { }
    await instagram.page.waitFor(2000);
  },

  commentLike: async (nr) => {
    console.log('commentLike', instagram.page.url())
    await instagram.page.waitFor(2000);
    instagram.cancelMessage();
    links = await instagram.page.evaluate((selector, nr) => {
      let query = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0, length = Math.min(nr, query.snapshotLength); i < length; ++i) {
        var elem = query.snapshotItem(i)
        elem.click()
      }
    }, elements.commentLike, nr);
    await utils.sleep(2000);
  },

  // ----------------------------------------
  getFollowers: async () => {
    console.log('getFollowers')
    var links = [];
    do {
      var allLinks = links;
      await instagram.page.waitFor(2000);
      links = await instagram.page.evaluate((selector) => {
        let results = [];
        let query = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          var elem = query.snapshotItem(i).href
          if (elem.indexOf('/following/') < 1 && elem.indexOf('/hashtag_following/') < 1) {
            elem = elem.replace(/https:\/\/www.instagram.com\//g, '')
            elem = elem.replace(/\//g, '')
            elem !== 'accountsactivity' && elem !== '' && elem !== 'explore' && results.indexOf(elem) === -1 ? results.push(elem) : console.log("This item already exists");
          }

        }
        return results;
      }, elements.followingItem);
      console.log("links", links.length, "allLinks", allLinks.length);
    } while (allLinks.length != links.length)
    console.log("all followed total:", allLinks.length);
    return allLinks;
  },

  openHashtags: async (nr) => {
    console.log('openHashtags')
    await instagram.openProfile();
    await instagram.navigateFollowing();

    const button = await instagram.page.waitFor(elements.hashtagsText, { timeout: 6000 });
    await Promise.all([
      button.click(),
      instagram.page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await utils.sleep(2000)
    const tags = await instagram.getHashtags();
    console.log(tags)

    var url = '//a[contains(@href,"' + tags[Math.min(nr, tags.length)] + '")]/img/.';
    console.log('url', url)

    const button2 = await instagram.page.waitFor(url, { timeout: 6000 });

    await Promise.all([
      button2.click(),
      instagram.page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await instagram.waitProfilePage();
    await utils.sleep(2000)
  },

  getHashtags: async () => {
    console.log('getHashtags')
    var links = [];
    do {
      var allLinks = links;
      await instagram.page.waitFor(2000);
      links = await instagram.page.evaluate((selector) => {
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
      }, elements.hashtagItem);
      console.log("links", links.length, "allLinks", allLinks.length);
    } while (allLinks.length != links.length)

    for (var x = links.length - 1; x > -1; x--) {
      if (links[x].indexOf('%') > -1) {
        links.splice(x, 1);
      }
      if (links[x].indexOf(instagram.session) > -1) {
        links.splice(x, 1);
      }
    }

    return links
  },


  openPost: async (nr) => {
    console.log('openPost', nr)
    await instagram.page.waitFor(2000);
    links = []
    try {
      const linkHandlers = await instagram.page.$x(elements.profileMedia);
      await linkHandlers[Math.min(linkHandlers.length, nr - 1)].click();
      return await instagram.waitPostPage();
    } catch (e) {
      await utils.log({"error" : "openPost", "url" : instagram.page.url()} )
      console.log('error openPost', e)
      return false;
    }
  },

  openProfile: async (nr) => {
    console.log('openProfile');
    try {
      const button = await instagram.page.waitFor(elements.profileButton, { timeout: 12000 });
      await button.click(),
        await instagram.waitProfilePage();
    } catch (e) {
      await utils.log({"error" : "openProfile", "url" : instagram.page.url()} )

      console.log("openProfile Error", e)
    }
  },

  waitProfilePage: async () => {
    console.log('waitProfilePage')
    try {
      await instagram.page.waitFor(elements.profileFollowUnfollowtext, { timeout: 15000 });
      try {
        await instagram.page.waitFor(elements.isPrivate, { timeout: 100 });
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
      await instagram.page.waitFor(elements.textPhoto, { timeout: 6000 });
      return true;
    } catch (e) {
      await utils.log({"error" : "waitPostPage", "url" : instagram.page.url()} )

      return false;
    }
  },

  openActivity: async (nr) => {
    console.log('openActivity');
    try {
      const button = await instagram.page.waitFor(elements.activityButton, { timeout: 30000 });
      await button.click(),
        await instagram.waitActivityPage();
    } catch (e) {
      await utils.log({"error" : "openActivity", "url" : instagram.page.url()} )
      console.log("openActivity Error", e)
    }
  },

  waitActivityPage: async () => {
    console.log('waitActivityPage')
    try {
      await instagram.page.waitFor(elements.activityText, { timeout: 6000 });
    } catch (e) {
      await utils.log({"error" : "waitActivityPage", "url" : instagram.page.url()} )
      console.log('waitActivityPage Error', e, instagram.page.url())
    }
  },

  likePost: async () => {
    instagram.cancelMessage();
    console.log('likePost', instagram.page.url());

    try {
      const likeButton = await instagram.page.waitFor(elements.postFilledHeart, { timeout: 100 });
      return false; // already been liked
    } catch (e) {
      try {
        const likeButton = await instagram.page.waitFor(elements.postUnfilledHeart, { timeout: 3000 });
        await likeButton.click();
        await utils.sleep(500);
        await instagram.page.waitFor(elements.postFilledHeart, { timeout: 3000 });
        await utils.saveCookies(instagram)
        return true;
      } catch (e) {
        await utils.log({"error" : "likePost", "url" : instagram.page.url(), "error message" : e} )
        return false;
      }
   }
  },

  openComments: async () => {
    instagram.cancelMessage();
    console.log('openComments', instagram.page.url());
    try {
      const commentButton = await instagram.page.waitFor(elements.postComment, { timeout: 3000 });
      await commentButton.click();
      await instagram.page.waitFor(elements.textComments, { timeout: 3000 });
      return true;
    } catch (e) {
      await utils.log({"error" : "openComments", "url" : instagram.page.url()} )
      console.log('openComments', e, instagram.page.url());
      return false;
    }
  },

  openPostUser: async () => {
    instagram.cancelMessage();
    console.log('openPostUser');
    try {
      const commentButton = await instagram.page.waitFor(elements.postUser, { timeout: 3000 });
      await commentButton.click();
      await instagram.waitProfilePage();
      return true;
    } catch (e) {
      await utils.log({"error" : "openPostUser", "url" : instagram.page.url()} )
      console.log(e, instagram.page.url());
      return false;
    }
  },


  navigateDirectMessageRequests: async () => {
    try {
      await instagram.page.reload();
      instagram.cancelMessage();
      const directMsgReqButton = await instagram.page.waitFor(elements.directMsgReqButton, { timeout: 3000 });
      directMsgReqButton.click();
      console.log('Message Requests');
      try {
        await instagram.page.waitFor(elements.messageRequests, { timeout: 3000 });
        const directMsgReqLists = await instagram.page.$x(elements.directMsgReqLists);
        await directMsgReqLists[0].click();
        const allow = await instagram.page.waitFor(elements.allow, { timeout: 2000 });
        allow.click();
      } catch (e) {
      }
    } catch (e) {
    }
  },

  openSearch: async () => {

    const searchButton = await instagram.page.waitFor(elements.searchButton, { timeout: 5000 });
    await Promise.all([
      searchButton.click(),
      instagram.page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    await instagram.page.waitFor(elements.searchBar, { timeout: 5000 });
    await utils.sleep(2000);

  },

  navigateToExampleProfile: async (userhandle) => {
    console.log('navigateToExampleProfile')
    //instagram.cancelMessage();
    try {

      await instagram.openSearch();

      await instagram.page.type(elements.searchBar, userhandle);

      const searchResult = await instagram.page.waitFor(`${elements.correctSearchResult}[contains(text(), "${userhandle}")]`, { timeout: 10000 });
      await searchResult.click();

      return await instagram.waitProfilePage()
    } catch (e) {
      console.log(e)
      return { "status": "No Profile" }
    }
  },

  getUsernameFromPost: async () => {
    var result = '';
    console.log('getUsernameFromPost');
    try {
      result = await instagram.page.evaluate((selector) => {
        const username = document.evaluate(selector.usernameFromPost, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        try {
          for (let i = 0, length = username.snapshotLength; i < length; ++i) {
            var elem = username.snapshotItem(i).href
            elem = elem.match(/(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am)\/([A-Za-z0-9-_]+)/im)
            return elem.length > 1 ? elem[1] : null;
          }
        } catch (e) {
          console.log('getUsernameFromPost', e);
        }
      }, instagram.elements);
    } catch (e) {
      console.log(e);
    }
    return result;
  },

  getProfileData: async () => {
    var result = [];
    await instagram.page.evaluate(async (elements) => {
      var username = await document.evaluate(elements.profileUsername, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = username.snapshotLength; i < length; ++i) {
        results.push(username.snapshotItem(i));
      }
      var posts = await document.evaluate(elements.profilePostsNr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = posts.snapshotLength; i < length; ++i) {
        results.push(posts.snapshotItem(i));
      }
      var followers = await document.evaluate(elements.profileFollowersNr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0, length = followers.snapshotLength; i < length; ++i) {
        results.push(followers.snapshotItem(i));
      }

      var following = await document.evaluate(elements.profileFollowingNr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      for (let i = 0, length = following.snapshotLength; i < length; ++i) {
        results.push(following.snapshotItem(i));
      }

      return { "status": "profile was found", "result": result }
    }, instagram.elements);

    return result;
  },


  follow: async text => {
    console.log('follow');
    try {
      const followButton = await instagram.page.waitFor(elements.followButton, { timeout: 5000 });
      await followButton.click();
      await instagram.page.waitFor(elements.followingButton, { timeout: 5000 });
      return true;
    } catch (e) {
      console.log('already been followed');
      return false;
    }
  },

  sendSampleMessage: async text => {
    try {
      await instagram.page.waitFor(1000);
      const messageButton = await instagram.page.waitFor(elements.messageButton);
      await messageButton.click();

      await instagram.page.waitFor(3000);
      await instagram.page.type(elements.textArea, text, { delay: 10 });
      const sendButton = await instagram.page.$x(elements.sendMessage);
      await sendButton[0].click();
      await instagram.page.waitFor(1000);
    } catch (e) {
      await utils.log({"error" : "sendSampleMessage", "url" : instagram.page.url()} )
      console.log("can't send message");
      return { "status": "Can't send message. You might be blocked." }
    }
  }

};

module.exports = instagram;
