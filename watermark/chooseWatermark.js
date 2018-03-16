var path = require('path');
var fs = require('fs');
var Jimp = require("jimp");

var selectedPath;
var targetPath = "./watermark.png"
var opacityValue;

function setSelectedPath(value){
  selectedPath=value;
}
function setOpacityValue(value){
  opacityValue=value;
}
function run(callback){
  copyFile(selectedPath, targetPath, function(err) {
    if (err) throw err;
    setWatermark();
    callback();
  });
}
var setWatermark = function(){
	Jimp.read(targetPath, function (err, watermark) {
	    if (err) throw err;
	    watermark.opacity(opacityValue/100)
      .write(targetPath); 
	});
}

var copyFile = function(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
module.exports.setSelectedPath = setSelectedPath
module.exports.setOpacityValue = setOpacityValue
module.exports.run = run