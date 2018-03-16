const fs = require('fs');
const request = require('request');
const options = {
    headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
  }
function download(url, filename){
    return new Promise(function(resolve, reject) {
        request(url,options).pipe(fs.createWriteStream(`pobrane/${filename}`)).on('close', resolve());
    });
}

module.exports.download=download;