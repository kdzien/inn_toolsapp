var shcf = require("../users_config/shopcat_config.js")

var setQuery = function(skus,produkt,user,callback){
    var options = shcf.shopcat_config[produkt]
    var shopcat_query = `
    UPDATE
      ${options.krosy_tab} t2,
      (
        SELECT
          a.*,
          b.Marka,
          c.nr_kategorii,concat('${options.sign}',Art_ID) as sku
        FROM
        ${options.krosy_tab} as a
          inner join ${options.zgodne_tab} as b on a.Zgodny_ID = b.ID
          inner join ee_all.kategorie_sklepowe_ebay as c on CASE WHEN c.marka = 'VOLKSWAGEN' THEN b.Marka = 'VW' WHEN c.marka = 'VAUXHALL' THEN b.Marka = 'OPEL' WHEN c.marka = 'MERCEDES-BENZ' THEN b.Marka = 'MERCEDES' ELSE b.Marka = c.marka END
          inner join ${options.aukcja_tab} aw on a.produkt_id=aw.produkt_id and a.profil_id=aw.profil_id and a.zgodny_id=aw.zgodny_id
          where
          c.user = '${user.name}'
          and c.produkt LIKE '%${options.nazwa}%'
          and a.Profil_ID = ${user.profil_id}
          and c.kraj = '${user.country}'
          having sku in (
            ${skus}
          )
      ) t1
    SET
      t2.` +"`shopcat_"+user.name+"`"+ `= t1.nr_kategorii
    WHERE
      t2.Produkt_ID = t1.Produkt_ID
      and t2.Zgodny_ID = t1.Zgodny_ID
      and t2.Profil_ID = t1.Profil_ID;
    `
    callback(shopcat_query)
}


module.exports.setQuery = setQuery