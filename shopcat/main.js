var sq = require("./shopcat_query.js")
var shcf = require("../users_config/shopcat_config.js")


var generateShopcats = function(product,sku_array,callback){
    shcf.shopcat_user_config.forEach(elem=>{
        sku_string = "'" + sku_array.join("','") + "'"
        sq.setQuery(sku_string,product,elem,(shopcat_query)=>{
            callback(shopcat_query)
        })
    })
}
// generateShopcats("xd",()=>{

// })

module.exports.generateShopcats = generateShopcats