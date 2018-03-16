"use strict";
var miniatures = require("../miniatures/main.js")
var https = require("../https_checker/main.js")
var adressess = require("../adressess/main.js")
var shopcats = require("../shopcat/main.js")
var watermark = require("../watermark/nakladacz_znaku.js")

//sprawdzenie httpsow
document.getElementById("httpsButtonStart").addEventListener("click",function(){
    var button = this;
    button.disabled=true;
    var e = document.getElementById("httpsUserSelect");
    var text = e.options[e.selectedIndex].text;
    https.runScript(text,()=>{
        clearInterval(httpsInterval);
        button.disabled=false;
    })
    var httpsInterval = setInterval(()=>{
        console.log(https.getCurrentAuction())
        document.getElementById("httpsInfo").innerHTML= `Aktualna aukcja ${https.getCurrentAuction()} ze wszystkich ${https.getTotalElements()}` 
        document.getElementById("httpsFound").innerHTML=`Znaleziono ${https.getFounded}`
    },1000)
})

//sprawdzenie miniaturek
document.getElementById("runMiniatures").addEventListener("click",function(){
    var button = this;
    button.disabled=true;
    miniatures.runScript(()=>{
        clearInterval(miniaturesInterval);
        button.disabled=false;
    })
    var miniaturesInterval = setInterval(()=>{
        document.getElementById("miniaturesUserInfo").innerHTML=  `user: ${miniatures.getCurrentUser()}`
        document.getElementById("currentMiniatures").innerHTML= `${miniatures.getCurrentPage()} z ${miniatures.getTotalPages()}`
    },10000)
})

//sprawdzenie adresow
document.getElementById("runAdresses").addEventListener("click",function(){
    var button = this;
    button.disabled=true;
    var e = document.getElementById("adressUserSelect");
    var text = e.options[e.selectedIndex].text;
    console.log(text)
    adressess.runScript(text,()=>{
        clearInterval(adressesInterval);
        button.disabled=false;
    })
    var adressesInterval = setInterval(()=>{
        document.getElementById("adressInfo").innerHTML=`${adressess.getCurrentAuction()} z ${adressess.getTotalAuctions()}`
    },1000)
})

//generowanie shopcatow
document.getElementById("runShopcat").addEventListener("click",function(){
    //var button = this;
    //button.disabled=true;
    var es = document.getElementById("shopcatProductSelect");
    var product = es.options[es.selectedIndex].text;
    var e = document.getElementById("shopcatArea");
    var sku_array = e.value.split("\n");
    shopcats.generateShopcats(product,sku_array,result=>{
        console.log(result)
    })
})


var image = document.getElementById("watermarkimg")
var selectedpath;
var opacity;
var size;
//znak wodny
document.getElementById('fileInput').onchange = function () {
    selectedpath=this.value
	image.src=this.value
};

document.getElementById("opacityRange").addEventListener("input",function(){
	opacity=this.value
	image.style.opacity=this.value/100
})
document.getElementById("selectWatermark").addEventListener("click", function(){
    var e = document.getElementById("positionSelect");
    var text = e.options[e.selectedIndex].text;
    console.log(`${selectedpath},${opacity},${size},${text}`)
    watermark.generatePhotos(selectedpath,opacity,size,text,()=>{
        console.log("gotowe")
    })
})
document.getElementById("sizeRange").addEventListener("input",function(){
    size=this.value;
})

