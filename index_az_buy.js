const ig = {
BASE_URL:'https://www.amazon.com.au',
description: 'Connect to shopify, search in amazon.com.au for the barcode and puchase the product for the shopify customer',
window:null,
utils:null,
bot : null,
lodash : null,
parameters:null,
form: [{ "id": "shopify_url", "elem" : "input", "placeholder" : "shopify_url with username/password"}
	,{ "id": "card_name", "elem" : "input", "placeholder" : "Name on Credit card"}
	,{ "id": "card_nr", "elem" : "input", "placeholder" : "Credit card Number"} 
        ,{ "id": "card_expmonth", "elem" : "input", "placeholder" : "Credit card expire month MM"}
	,{ "id": "card_expyear", "elem" : "input", "placeholder" : "Credit card Expire year YYYY"}
	,{ "id": "card_cvv", "elem" : "input", "placeholder" : "Credit Card CVV"}
	,{ "id": "gift_card", "elem" : "input", "placeholder" : "Gift Card"}
	,{ "id": "gift_from", "elem" : "input", "placeholder" : "Gift From"}  ],

init: async() => {
	console.log('init...');
//	var module = await ig.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/amazon.com.au.js')
//        ig.bot = await ig.utils.requireFromString(module)
	ig.bot = require('/Users/gbacskai/done24bot/websites/amazon.com.au.js')
	ig.bot.utils = ig.utils;

	var lodash = await ig.utils.httpRequestText('https://raw.githubusercontent.com/lodash/lodash/4.17.15-npm/lodash.js');
	ig.lodash = await ig.utils.requireFromString(lodash)
	
},

process: async () => {

        var shopify = require('/Users/gbacskai/done24bot/websites/shopify.js')
	shopify.utils = ig.utils;
	shopify.initialise(ig.parameters.shopify_url);

	console.log('process');
        let log = await ig.utils.log({"filename" : "index_az_buy", "function" : "process", "url" : ig.bot.page.url(), "instagram" : ig.bot.username });

	const loginData = await ig.bot.login();

	await ig.utils.saveCookies(ig.bot).catch(function(error) {
		console.log(error);
	});

	console.log('load shopify orders')
	var since_id = 0;
    	var shopify_orders = await shopify.getOrders('limit=250&since_id='+since_id+'&status=open&fulfillment_status=unshipped');

    if(!shopify_orders.orders.length) {
        console.log('no more orders')
        return;
    }

 for(var order_nr=0;order_nr<shopify_orders.orders.length;order_nr++) {

  var order = shopify_orders.orders[order_nr];

  if (order.tags === 'amazon') {
    console.log('load google products')

    ig.parameters.order_id = order.id;
    console.log('order number', order.order_number)

    ig.parameters.products = []

    for(var o=0;o<order.line_items.length;o++) {
	var p = await shopify.getProduct(order.line_items[o].product_id)
	console.log(p)
	ig.parameters['products'].push( {"barcode" : p.products[0].variants[0].barcode , "qty" : order.line_items[o].quantity })
    }

    ig.parameters['customer'] = {}

    ig.parameters['customer']['name'] = order.shipping_address.first_name.replace(/’/,"") + " " + order.shipping_address.last_name.replace(/’/,"");
    ig.parameters['customer']['address'] = order.shipping_address.address1.replace(/\n/g,' ');
    if(!order.shipping_address.phone) {
	order.shipping_address.phone ='0'
    }


    let address_text = order.shipping_address.address1 + ", " + order.shipping_address.city + "," + order.shipping_address.zip + ", " + order.country

    let address = await ig.utils.data({ method: 'POST', data : {"address" : address_text} , endpoint : 'address'})
    // console.log('address', address)

    var picked_zip = ig.lodash.filter(address[0].address_components, { "types" : [ 'postal_code' ] } )[0].long_name.replace(/\n/g,' ');
    var picked_city = ig.lodash.filter(address[0].address_components, { "types" : [ 'locality', 'political' ] } )[0].long_name.toUpperCase().replace(/\n/g,' ');
    var picked_country = ig.lodash.filter(address[0].address_components, { "types" : [ 'country', 'political' ] } )[0].long_name.replace(/\n/g,' ');

    // console.log('found address', address[0]);

    ig.parameters['customer']['phone'] = order.shipping_address.phone.replace('+61','0');
    ig.parameters['customer']['city'] = picked_city.replace(/\n/g,' ');
    ig.parameters['customer']['state'] = order.shipping_address.province_code.replace(/\n/g,' ');
    ig.parameters['customer']['postcode'] = picked_zip;
    ig.parameters['customer']['country'] = picked_country;
    ig.parameters['giftcard'] = ig.parameters.giftcard + " Order:" + order.order_number,

    ig.parameters['buyer'] = {}
    ig.parameters['buyer']['nameOnCard'] = ig.parameters.card_name;
    ig.parameters['buyer']['cardNumber'] = ig.parameters.card_nr;
    ig.parameters['buyer']['expireMonth'] = ig.parameters.card_expmonth;
    ig.parameters['buyer']['expireYear'] = ig.parameters.card_expyear;
    ig.parameters['buyer']['cvv'] = ig.parameters.card_cvv;

    ig.parameters.giftcard = ig.parameters.gift_card + "order:" + order.order_number;
    ig.parameters.giftfrom = ig.parameters.gift_from;

    if(picked_country === 'Australia') {
    	console.log('buy', ig.parameters);
    	var url = await ig.bot.buyProducts(ig.parameters);
    	let full = await shopify.setFullfillment(ig.parameters.order_id, url);
    }
   }
  }
 }
}
module.exports = ig;
