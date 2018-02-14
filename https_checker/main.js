"use strict";
var options = require("../users_config/https_config")
var ebay = require('ebay-api');
var db = require("../db_connect/db_connection.js")

var currentAuction=0;
var totalElements=0;
var founded = 0;

var getCurrentAuction = ()=>{
	return currentAuction;
}
var getTotalElements = ()=>{
	return totalElements
}
var getFoundedElements = ()=>{
	return founded;
}

var runScript = function(user,callback){
	db.connection.query(options[user].query, function (err, result, fields) {
		checkAuctions(result,callback)
	});
}

var checkAuctions = function(elements,callback){
	var n = 0;
	(function asyc(){
		totalElements=elements.length-1;
		if(n<=elements.length-1){
			currentAuction=n;
			console.log("teraz: " + elements[n].auction_id +" iterator: " + n)
			ebay.xmlRequest({
			  'serviceName': 'Shopping',
			  'opType': 'GetSingleItem',
			  'appId': 'mateuszp-westgate-PRD-95d74fc8f-82c993be', 
			  
			  params: {
			    'ItemID': elements[n].auction_id.toString(),
			    'IncludeSelector': 'Description'
			  }
			},
			function(error, data) {
				if(error){
					console.log(" Aukcja nr: " + elements[n].auction_id.toString()+" "+error )
					n++;
					asyc();
				}
				else if((data.Item.Description).indexOf("http://")!==-1){
					founded++;
					var inserQuery = "insert into konradd.brak_https (auction_id,user_id) values ('"+elements[n].auction_id+"','NA'"+")"
					db.connection.query(inserQuery, function (err, result) {
						n++;
						asyc()
					});
				}else{
					n++;
					asyc()
				}
			});
		}else{
			callback()
			console.log("koniec")
		}
	})()
}

module.exports.runScript = runScript
module.exports.getCurrentAuction = getCurrentAuction
module.exports.getTotalElements = getTotalElements