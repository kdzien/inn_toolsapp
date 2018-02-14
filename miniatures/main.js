"use strict";
var request = require('request');
var cheerio = require('cheerio');
var gm = require('gm');
var db = require("../db_connect/db_connection.js")
var miniatures_config = require("../users_config/miniatures_config.js")

var allElements = new Array();
var badElements = new Array();
var options = miniatures_config.config;

var currentUser;
var currentPage;
var totalPages;

var getCurrentUser = () =>{
	return currentUser
}
var getCurrentPage = () =>{
	return currentPage
}
var getTotalPages = () =>{
	return totalPages
}

var getAllElements = function(options,callback){
	request(options.url+1, function(error, response, html){
		if(error){
			console.log(error)
			callback()
		}else{
			var $ = cheerio.load(html);
			var pageClass='.dynpg'
		 	var pagesText = $(pageClass).find($('.page')).text()
		 	var ext="von ";
		 	if(pagesText.indexOf("of ")!==-1) ext="of "
	 		if(pagesText.indexOf("/")!==-1) ext="/"
			 var pagesNumber = pagesText.slice(pagesText.indexOf(ext) + ext.length);
			 totalPages=pagesNumber;
		 	pagesNumber=Number(pagesNumber);
		 	if(pagesNumber==0){
		 		console.log("błąd: "+options.url)
		 		callback()
		 	}
		 	var n = 1;
		 	(function getElementsOnPage(){
				currentUser=options.user;
		 		if(n<=pagesNumber){
					 currentPage=n;
			 		request(options.url+n,function(error,response,html){
			 			if(error){
			 				console.log(error)
			 				console.log("błąd: "+options.url+n)
			 				n++
			 				getElementsOnPage()
			 			}
			 			else{
				 			var $ = cheerio.load(html);
				 			var findID='#v4-21';
				 			if(options.user=='grenico-fr'){
				 				findID='#v4-22'
				 			}
				 			$(findID).find($('#lvc')).find($('table')).find($('tbody')).find($('tr')).each(function(i,elem){
								var currentUrlx = elem.children[0].children[0].children[0].attribs.src;
								var currentTitlex = elem.children[0].children[0].children[0].attribs.alt;
								var currentAuctionx = elem.children[1].children[0].children[0].attribs.href;
								currentAuctionx = currentAuctionx.substring(0,currentAuctionx.length-(currentAuctionx.length-currentAuctionx.indexOf('?hash')));
								currentAuctionx = currentAuctionx.substring(currentAuctionx.length-12)
								currentTitlex = currentTitlex.replace(/'/g, "\\'");
								var jsonY={currentUrl:currentUrlx,title:currentTitlex,auction_id:currentAuctionx,user:options.user}
                                allElements.push(jsonY)
							})
							n++;
							getElementsOnPage()
			 			}
			 			
			 		})

		 		}else{
		 			callback()
		 		}
		 	})()
		}
	})
}
var checkElement = function(elem,options,callback){

	gm(elem.currentUrl)
		.identify(function (err, info) {
		if (!err) {
			if(info.size.width==80 && info.size.height==80 && info.Type=='grayscale'){
				badElements.push(elem)
				callback()
			}else{
				callback()
			}
		}
	});
}

var insertToDB = function(options,callback){
	console.log(badElements)

	if(badElements.length==0){
		console.log("Nie ma złych na userze : " +options.user)
		callback()
		return;
	}

	var allQuery = "insert into konradd.brak_zdjec_listing (auction_id,title,user_id) values "

			badElements.forEach(function(elem,i){
				
				if(badElements.length-1==i){
					allQuery+=" ("+elem.auction_id+",'"+elem.title+"','"+elem.user+"') "
                    db.connection.query(allQuery, function (err, result) {
							if (err) throw err;
								callback()
						});
				}else{
					allQuery+=" ("+elem.auction_id+",'"+elem.title+"','"+elem.user+"'), "
				}
			})		


}

var run = function(options, callback){
	getAllElements(options,function(){
		var tablength=allElements.length;
		allElements.forEach(function(elem,i){
			if(tablength-1==i){
				checkElement(elem,options,function(){
					callback()
				})
			}else{
				checkElement(elem,options,function(){
				})	
			}
		})
	})
}

var runScript = function(callback){
	var n = 0;
    (function tempf(){
        if(n<options.length-1){
            run(options[n],function(){
                insertToDB(options[n],function(){
                    allElements = new Array();
                    badElements = new Array();
                    n++;
                    tempf()
                })
            })
        }else if(n==options.length-1){
            run(options[n],function(){
                insertToDB(options[n],function(){
                    allElements = new Array();
                    badElements = new Array();
					console.log(new Date())
					callback()
				})
            })
        }
    })()	
}
module.exports.runScript = runScript
module.exports.getCurrentUser = getCurrentUser
module.exports.getCurrentPage = getCurrentPage
module.exports.getTotalPages = getTotalPages