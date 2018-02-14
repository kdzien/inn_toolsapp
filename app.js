"use strict";
var miniatures = require("../miniatures/main.js")
var https = require("../https_checker/main.js")
var adressess = require("../adressess/main.js")

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
    adressess.runScript(text,()=>{
        clearInterval(adressesInterval);
        button.disabled=false;
    })
    var adressesInterval = setInterval(()=>{
        document.getElementById("adressInfo").innerHTML=`${adressess.getCurrentAuction()} z ${adressess.getTotalAuctions()}`
    },1000)
})