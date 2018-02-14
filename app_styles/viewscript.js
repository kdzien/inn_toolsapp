var gui = require('nw.gui'); 
var win = gui.Window.get();

document.getElementById("minimalizeWindow").addEventListener("click",function(err){
	win.minimize()
})

document.getElementById("closeWindow").addEventListener("click",function(err){
	win.close()
})




var content = new Array()

var headerButtons = document.getElementById("header")
var children = headerButtons.childNodes;
children.forEach(function(elem,i){
	if(elem.nodeName=="BUTTON"){
		content.push(elem)
		elem.addEventListener("click",function(){
			currentView(content,this)
			hideElements(content);
			document.getElementById(this.dataset.id).className+=" show"
			elem.className+=" buttonOpacity";
		})
	}
})

var hideElements = function(array){
	array.forEach(function(elem,i){
		document.getElementById(elem.dataset.id).classList.remove("show")
	})
}
var currentView = function(all,current){
	all.forEach(function(elem,i){
		elem.classList.remove("buttonOpacity")
	})
	current.className+=" buttonOpacity"
}

function getfolder(e) {
    var files = e.target.files;
    var path = files[0].webkitRelativePath;
    var Folder = path.split("/");
    alert(path);
}