var gm = require('gm');
var fs = require('fs');
var Jimp = require("jimp");

var selectedPath;
var targetPath = "./watermark.png";
var opacityValue;
var sizeValue;
var directory='\\\\192.168.1.166\\photo_base\\konrad_apka'
var positiontext;

function generatePhotos(selectedpath,opacity,size,text,callback){
	positiontext=text;
	selectedPath=selectedpath;
	opacityValue=opacity;
	sizeValue=size
	run(()=>{
		callback()
	})
	
}

var convertImage = function(imageToConvert,callback){
	gm(directory+'\\input_znaki\\'+imageToConvert)
	.size(function (err, size) {
		if(err){
			console.log(err)
		}
	  if (!err) {
	  	var watermarkSize = "1."+sizeValue;
	  	watermarkSize=Number(watermarkSize)
	    var watermarkWidth = size.width/watermarkSize;

	    var imageWidth=size.width;
	    var imageHeight=size.height;

		    gm("./watermark.png").resize(watermarkWidth,null).write('./currentWatermark.png',function(e){
		    	gm('./currentWatermark.png').size(function(err,sizeW){
		    		var currentWatermarkWidth = sizeW.width;
		    		var currentWatermarkHeight = sizeW.height;
		    		var totalPosition = getWatermarkPosition(imageWidth,imageHeight,currentWatermarkWidth,currentWatermarkHeight);
						gm(directory+'\\input_znaki\\'+imageToConvert)
						.draw(['image over '+totalPosition+' 0,0 "./currentWatermark.png"'])
					.write(directory+'\\output_znaki\\'+imageToConvert, function(e){

					 callback()
					});
				})
		    })

	  }
	});
}
var getAllImages = function(dir,callback){
	fs.readdir(dir, function(error, files) {
		if(error){
			throw new Error('Nie masz dostępu do dysku lub podana ściezka nie istnieje');
		}
		else{
			callback(files);
		}
	});
}


var convertAllImages = function(callback){
	setWatermark(function(){
		getAllImages(directory+'\\input_znaki\\',function(files){	
			console.log(files)
		var nth = 0;
		(function loopElements(){
			if(nth<=files.length-1){
				if(files[nth]=="Thumbs.db"){
					console.log("thumbs")
					nth++
					loopElements();
				}else{
					convertImage(files[nth],function(){
						console.log("udalo sie")
						nth++;
						loopElements();
					});
				}
			}
			else{
				callback()
			}
		})();
		})	
	})

}

var setWatermark = function(callback){
	Jimp.read(targetPath, function (err, watermark) {
	    if (err) throw err;
	    watermark.opacity(opacityValue/100).write(targetPath,function(){
	    	callback()
	    }); 
	    
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

var getWatermarkPosition = function(imageW,imageH,watermarkW,watermarkH){
	var position,posX,posY;
	
	switch(positiontext) {
	    case "srodek":
	        posX = (imageW/2)-(watermarkW/2);
    		posY = (imageH/2)-(watermarkH/2);
	        break;
	    case "gora-lewo":
	        posX = 0;
    		posY = 0;
	        break;
	    case "gora-prawo":
	        posX = imageW-watermarkW;
    		posY = 0;
	        break;
	    case "dol-lewo":
	        posX = 0;
    		posY = imageH-watermarkH;
	        break;
        case "dol-prawo":
	        posX = imageW-watermarkW;
    		posY = imageH-watermarkH;
	        break;
	    default:
	        position = '0,0'
	}
	posX=posX.toString()
	posY=posY.toString()
	position = posX+","+posY;
	return position;
}

function run(callback){
	copyFile(selectedPath, targetPath, function(err) {
		if (err) throw err;
		convertAllImages(()=>{
			callback()
		});
	});
}
module.exports.generatePhotos = generatePhotos