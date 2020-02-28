var lodash = require('lodash');

const az = {
	BASE_URL:'https://www.amazon.com.au',
	window:null,
	utils:null,
	bot:null,
	parameters:null,
	google:null,
	shopify:null,
	lodash:require('lodash'),

	init: async () => {

        console.log('index_az.js init...');
        var module = await az.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/amazon.js') 
		.catch(function(error) { console.log(error) });
        az.bot = await az.utils.requireFromString(module) 
		.catch(function(error) { console.log(error); });
        az.bot.utils = az.utils;

	module = await az.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/google.js') 
		.catch(function(error) { console.log(error) });
        az.google = await az.utils.requireFromString(module) 
		.catch(function(error) { console.log(error); });
	az.google.utils = az.utils;

	module = await az.utils.httpRequestText('https://raw.githubusercontent.com/xshopper/done24bot/master/websites/shopify.js') 
		.catch(function(error) { console.log(error) });
        az.shopify = await az.utils.requireFromString(module) 
		.catch(function(error) { console.log(error); });
	az.shopify.utils = az.utils;

	},

	process: async () => {
            let log = await az.utils.log({"filename" : "index_az.js" , "message" : "process"} )
	    az.shopify.initialise(az.parameters.shop);
	    
	    console.log('load shopify orders')
	    var shopify_order = await az.shopify.getOrder();

    	if(!shopify_order.orders.length) {
        	console.log('no more orders')
        	return;
    	}

    	console.log(shopify_order)

    	console.log('load google products')
    	var products_google = await az.google.read(az.parameters.google.spreadsheet_id, 'Products!A1:Z');
    	var products = az.utils.getJsonArrayFromData(products_google.data.values);
    	az.parameters.products = []

	az.parameters.order_id = shopify_order.orders[0].id;
	console.log('order number', shopify_order.orders[0].order_number)

    	for(var o=0;o<shopify_order.orders[0].line_items.length;o++) {
		var picked = lodash.filter(products, { "Description": shopify_order.orders[0].line_items[o].title } )[0];
		az.parameters['products'].push( {"amazon" : picked["Amazon ASIN"], "qty" : shopify_order.orders[0].line_items[o].quantity })
    	}

    	az.parameters['customer']['name'] = shopify_order.orders[0].shipping_address.first_name + " " + shopify_order.orders[0].shipping_address.last_name;
    	az.parameters['customer']['address'] = shopify_order.orders[0].shipping_address.address1.replace(/\n/g,' ');
    		if(!shopify_order.orders[0].shipping_address.phone) {
			shopify_order.orders[0].shipping_address.phone ='0'
    	}

    	let address = await az.google.autocomplete(shopify_order.orders[0].shipping_address.address1 + ", " + shopify_order.orders[0].shipping_address.city + "," + shopify_order.orders[0].shipping_address.zip + ", " + shopify_order.orders[0].country).catch(function(err) { console.log('error: ', err); });

    	var picked_zip = lodash.filter(address[0].address_components, { "types" : [ 'postal_code' ] } )[0].long_name.replace(/\n/g,' ');
    	var picked_city = lodash.filter(address[0].address_components, { "types" : [ 'locality', 'political' ] } )[0].long_name.toUpperCase().replace(/\n/g,' ');

    	console.log('found address', address[0]);

    	az.parameters['customer']['phone'] = shopify_order.orders[0].shipping_address.phone.replace('+61','0');
	if(az.parameters['customer']['phone'] == '0') {
		az.parameters['customer']['phone'] = '0449598795'
	}

    	az.parameters['customer']['city'] = picked_city.replace(/\n/g,' ');
    	az.parameters['customer']['state'] = shopify_order.orders[0].shipping_address.province_code.replace(/\n/g,' ');
    	az.parameters['customer']['postcode'] = picked_zip;
    	az.parameters['customer']['country'] = shopify_order.orders[0].country;
    	az.parameters['giftcard'] = "Hi There, Please make an Instagram story, post @treathuntersau to promote our healthy Australian treats. Discount code INSTA2020. Order:" + shopify_order.orders[0].order_number,
    	console.log(az.parameters);
	console.log('---------------------------------')

    	az.bot.parameters = az.parameters;

    	var loggedIn = await az.bot.checkLogin(300000, az.bot);

    	console.log('loggedin', loggedIn)
	 
    	await az.utils.saveCookies(az.bot);

    	var url = await az.bot.searchProducts();
    	let full = await az.shopify.setFullfillment(az.parameters.order_id, url);
	process.exit();
}

}

module.exports = az;
