
let options = require("../users_config/https_config")
let Compatibility = require("./Compatibility")
let ebay = require('ebay-api');
let db = require("../db_connect/db_connection.js")



function insertData(compabilites,auction_id,callback){
  
  var query = 'insert into konradd.dopasowania_rimmers values '
  compabilites.forEach((elem,i)=>{
    query += `('${auction_id}',${elem.getInsertQuery()}),`
    if(i==compabilites.length-1){
      db.connection.query(query.slice(0,-1),(err,result)=>{
        callback()
      })
    }
  })
}
let proby = 0;
function getCompabilities(auction_id,callback){
  
  ebay.xmlRequest({
    'serviceName': 'Shopping',
    'opType': 'GetSingleItem',
    'appId': 'mati0503-token-PRD-0df6191d9-9054ac23', 
    
    params: {
      'ItemID': auction_id,
      "IncludeSelector": "Compatibility",
    }
  },(error,data)=>{
    if(error){
        console.log(error)
    }
    else{
      if(data.Item.ItemCompatibilityList===undefined){
        proby++;
        console.log(`${proby} problem: ${auction_id}`)
        if(proby==5){
          db.connection.query(`insert into konradd.dopasowania_rimmers_brak_comp values ('${auction_id}')`,(err,result)=>{
            proby=0;callback()
          })
        }else{
          callback(true)
        }
      }
      else{
        proby=0;
        console.log(auction_id)
        let result = data.Item.ItemCompatibilityList[0].Compatibility;
        let compabilites = [];
        if(result.NameValueList){
          compabilites.push(new Compatibility(result.NameValueList[1].Value,result.NameValueList[2].Value,result.NameValueList[3].Value,result.NameValueList[4].Value,result.NameValueList[5].Value,result.NameValueList[6].Value));
          insertData(compabilites,auction_id,()=>{
            compabilities=[];
            callback()
          })
        }else{
          result.forEach((elem,i)=>{
            compabilites.push(new Compatibility(elem.NameValueList[1].Value,elem.NameValueList[2].Value,elem.NameValueList[3].Value,elem.NameValueList[4].Value,elem.NameValueList[5].Value,elem.NameValueList[6].Value));
            if(i==result.length-1){
              insertData(compabilites,auction_id,()=>{
                compabilities=[];
                callback()
              })
            }
          })
        }
        
      }
    }
  })
}

function run(){
  db.connection.query(`select auction_id from ebay_api_calls.active_auction where user_id='rimers11' and auction_id not in (select auction_id from konradd.rimmers_zrobione )`,(err,result)=>{
    let n = 0;
    (function asyc(){
      if(n<=result.length-1){
        getCompabilities(result[n].auction_id,badresponse=>{
          if(badresponse){
            asyc();
          }else{
            n++;
            asyc();}
        })
      }else{
        console.log("koniec")
      }
    })()
  })
}

run()