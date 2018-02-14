"use strict";
var db_config = require("./config.js")
var mysql = require('mysql');
var connection = mysql.createConnection(db_config.config)

connection.connect(function(err){
    if(err){
        console.log(err)
        return;
    }
    console.log("connected with DB")
})



module.exports.connection = connection;