const shopify = {
utils: null,
url : null,

initialise : async (parameters) => {
	shopify.url = "https://"+parameters.api_key+":"+parameters.password+"@"+parameters.shop+".myshopify.com/admin"
},

getOrder: async () => {
	var since_id = '2130271731808';
	var myurl = shopify.url + '/orders.json?limit=1&since_id='+since_id+'&status=open&fulfillment_status=unshipped'
	console.log(myurl)
	let res = await utils.httpRequest(myurl).catch(function(err) { console.log('error: ', err); })
	return res;
},

setFullfillment: async (order_id, url) => {
        var myurl = shopify.url + "/orders/" + order_id + "/fulfillments.json"
	var fullfillment = { "fulfillment": { "tracking_urls": [ url ], "notify_customer": true , "location_id" : 18490556512} }

	console.log('fullfillment' , fullfillment);	
	let res = await utils.httpRequestPost(myurl,  JSON.stringify(fullfillment)).catch(function(err) { console.log('error: ', err); })
	console.log(res)
	return res;
}

};

module.exports = shopify;
