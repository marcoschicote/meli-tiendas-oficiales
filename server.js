var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

findSellerId = function(elem, callback) {
	var name = elem.name
	var storeUrl = elem.url

	request(storeUrl, function(error, response, html) {		
		var jQuery = cheerio.load(html);					
		var dataSrc = jQuery("img.brand-logo").attr('src');
		var slashIndex = dataSrc.lastIndexOf('/');

		var afterSlash = dataSrc.substring(slashIndex + 1);
		var bkgIndex = afterSlash.indexOf('-');

		var sellerId = afterSlash.substring(0, bkgIndex);

		var e = {store_name: name, store_id: sellerId};
		
		callback(null, e);
	});
}


var url = 'http://www.mercadolibre.com.ar/tiendas-oficiales';


request(url, function(error, response, html) {
    if(!error) {
        var $ = cheerio.load(html);

		var tiendasOficiales = [];
		$("div.brand-label.short-label.off a").map(function() { 
													tiendasOficiales.push({ 
															  name: $(this).attr('title')
															, url: $(this).attr('href')
														});
												});

		async.map(
			// [tiendasOficiales[0]]
			tiendasOficiales
			, findSellerId
			, function(err, results) {

				console.log(JSON.stringify(results));	
			}
		)
	}
});