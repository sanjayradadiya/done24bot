const shopify = {
utils: null,
url : null,

initialise : async (url) => {
	shopify.url = url + "/admin"
},

getOrders: async (filters) => {
	if(filters) {filters = '?' + filters};
	var myurl = shopify.url + '/orders.json' + filters
	console.log(myurl)
	let res = await shopify.utils.httpRequest(myurl).catch(function(err) { console.log('error: ', err); })
	return res;
},

getProduct: async (product_id) => {
        var myurl = shopify.url + '/products.json?ids='+product_id
        console.log(myurl)
        let res = await shopify.utils.httpRequest(myurl).catch(function(err) { console.log('error: ', err); })
        return res;
},

setFullfillment: async (order_id, url) => {
        var myurl = shopify.url + "/orders/" + order_id + "/fulfillments.json"
	var fullfillment = { "fulfillment": { "tracking_urls": [ url ], "notify_customer": true , "location_id" : 18490556512} }

	console.log('fullfillment' , fullfillment);	
	let res = await shopify.utils.httpRequestPost(myurl,  JSON.stringify(fullfillment)).catch(function(err) { console.log('error: ', err); })
	console.log(res)
	return res;
}

};

module.exports = shopify;
