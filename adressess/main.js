var ebay = require('ebay-api');
var db = require("../db_connect/db_connection.js")
var options_adresses = require("../users_config/adresses_config.js")

var currentAuction;
var totalAuctions;

var getCurrentAuction = ()=>{
    return currentAuction
}
var getTotalAuctions = ()=>{
    return totalAuctions
}
 
  var checkAuctions = function(elements,user,callback){
    totalAuctions=elements.length;
    var n = 0;
    (function asyc(){
      if(n<=elements.length-1){
          console.log(elements[n].auction_id)
        ebay.xmlRequest({
          'serviceName': 'Shopping',
          'opType': 'GetSingleItem',
          'appId': 'mateuszp-westgate-PRD-95d74fc8f-82c993be', 
          
          params: {
            'ItemID': elements[n].auction_id.toString(),
            'IncludeSelector': 'Details'
          }
        },
        function(error, data) {
          if(error){
            console.log(" Aukcja nr: " + elements[n].auction_id.toString()+" "+error )
            n++;
            asyc();
          }
          else if(data.Item.ReturnPolicy.Description.indexOf(user.foundAddress)==-1){
            var inserQuery = "insert into konradd.zly_adres (auction_id,user_id) values ('"+elements[n].auction_id+"','nie ma'"+")"
            db.connection.query(inserQuery, function (err, result) {
              n++;
              asyc()
            });
          }else{
              n++;
              asyc()
          }
          currentAuction=n;
        });
      }else{
          callback()
      }
    })()
  }

var runScript = function(user,callback){
    db.connection.query(options_adresses[user].query, function (err, result, fields) {
        checkAuctions(result,options_adresses[user],callback)
    });
}

module.exports.runScript = runScript;
module.exports.getCurrentAuction = getCurrentAuction;
module.exports.getTotalAuctions = getTotalAuctions
