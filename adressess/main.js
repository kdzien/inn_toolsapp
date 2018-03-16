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
          'appId': 'Przemysl-OD349222-PRD-08e31710d-8b141d15', 
          'SellerBusinessCodeType':"Commercial",
          //certId: 'PRD-8e31710deb9a-11e8-4b56-9f98-8ae3',
          // 'serviceName': 'Trading',
          // 'opType': 'GetItem',
          //devId: '0f1d9764-8cfa-4279-bc0c-df5b203294e8',
          // certId: 'PRD-8e31710deb9a-11e8-4b56-9f98-8ae3',
          // appId: 'Przemysl-OD349222-PRD-08e31710d-8b141d15',
           //authToken: 'AgAAAA**AQAAAA**aAAAAA**nvBMWQ**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6AElYWkAZWDpg6dj6x9nY+seQ**6soDAA**AAMAAA**rhBIyOjKQFTCN8q05KzxuBcO07shYjD3P6r1HmNummEGERgHGfXIkdDHNU0SPO/c9Wxoaox0t96UmEkfQWu7U/BeDuHPNhJmxfDgWAY8+XtbobJcYR8fjeoagc3wF6NqaAW6msW7GLvbweYXmOyY22cMeQOhYINhLHMHSZTU/T8LeEeDfcnya1KdAT0TYIru75jxi1O2ffrP5OF4+IKlUe8N3kMEyPxvVk5TY3B63gfq3BIO6fX7iExAzoRNLRebemLlNO05eRvk4h83IjlTc96Pw43NYtFRHFVWo0K2s0QQL+0xdDzPkNyzl3z6J276z41WoA1p7qpDeLVxohK5YxfJChLKBhTGvvSTeBdnGZ99zqqI0FzqAq/SLG6weMKoJvFUxVA6cI2vBlL55nfYSYQYBtIpjZ5NndGRJDsF+ZH0N2uIHUJ+z9KjE/j30xsB7GaYglghcqqcUcXRSNN0NlMyRJ7sFo16dwhDcHXCismic6AoNO1ztZzo7/fGE6zvOIVOiV9NxE8jJ/rJU5P0dICUuNwvqG91UXtE+e0NHkhY2IOorNHwCqhtsMbti42SqIT+lIYBs4NQ7Om9ewwXVwC4N94XfbcukLrLUGB1XuqyzN6E0pn+zNlEEn9jMaIy213DaC/yGU8tzrKj/9cb2+W/9hfEmJxetekI62gj6B95lYFuYg1/UNXV7JDwlLJdsUYuKmWdrEyWhfJak1xvYsepcehl7YVyjEmn78QYfTvGaXBk2R8UJCKYADKtaes8',

          params: {
            'ItemID': elements[n].auction_id,
            'IncludeSelector': 'Details'
          }
        },
        function(error, data) {
          if(error){
            console.log(" Aukcja nr: " + elements[n].auction_id.toString()+" "+error )
            n++;
            asyc();
          }
          else if(data.Item.ReturnPolicy.Description===undefined){
            var inserQuery = "insert into konradd.adresy (auction_id,terms_and_conditions,returns_policy) values ('"+elements[n].auction_id+"','undefined','undefined'"+")"
            db.connection.query(inserQuery, function (err, result) {
              if(err){throw new Error(err)}
              n++;
              asyc();
            });
          }else{
            var inserQuery = `insert into konradd.adresy (auction_id,terms_and_conditions,returns_policy) values ('${elements[n].auction_id}','${data.Item.BusinessSellerDetails.TermsAndConditions}','${data.Item.ReturnPolicy.Description}')`
            db.connection.query(inserQuery, function (err, result) {
              if(err){throw new Error(err)}
              n++;
              asyc();
            });
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
runScript("online-depot-ohg",()=>{

})
module.exports.runScript = runScript;
module.exports.getCurrentAuction = getCurrentAuction;
module.exports.getTotalAuctions = getTotalAuctions
