const db = require("../db_connect/db_connection.js")
const file_downloader=require("./saveImage.js")
const request = require('request');
const cheerio = require('cheerio');
const allHekoQuery = `select * from konradd.owiewki_brakujace_zdjecia_heko where art_id='15149' order by art_id`
const SKUPage_url = `http://www.e-heko.com/pl/Szukaj/?search=product&cg_2=&cg_3=&cg_4=&string=`
const base_url=`http://www.e-heko.com/`
const options = {
    headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
  }
db.connection.query(allHekoQuery,(err,result)=>{

    var n = 0;
    (function asyc(){
        if(n<=result.length-1){
            findSKUPage(result[n].art_id,result[n].marka)
            .then(sku_page=>findImgUrl(sku_page))
            .then(img_url=>{
                file_downloader.download(img_url,`H${result[n].art_id}00.jpg`).then(()=>{
                    console.log(`${result[n].art_id} pobrano`)
                    n++;asyc();
                })
            })
            .catch(sku=>{
                console.log(`${sku} brak zdjęcia`)
                n++;asyc();
            })
        }else{
            console.log("koniec")
        }
    })()

})

function findSKUPage(sku,marka){
    return new Promise(function(resolve, reject) {
        request(SKUPage_url+sku,options, function(error, response, html){
            let $ = cheerio.load(html);
            let sku_page='';
            let is_image = false;
            $(".prod_name_row").each((i,elem)=>{
                let sku_string = $(elem).find("strong").text()
                if(sku_string.indexOf(marka)!==-1){
                    console.log(sku_string)
                }
            })
            is_image === true ? resolve(sku_page) : reject(sku);
        })
    });
}

function findImgUrl(skupage){
    return new Promise(function(resolve, reject) {
        request(base_url+skupage,options, function(error, response, html){
            let $ = cheerio.load(html);
            let img_url = $("#product_foto_big").find('a').attr('href')
            resolve(base_url+img_url)
        })
    });
}
