require('polyinherit');
var fs = require('fs'),
colors = require('colors'),
Watcher = require('file-watch'),
mixin = (function() {
  var mixinup = function(a,b) { 
  	for(var i in b) { 
  		
  		if (b.hasOwnProperty(i)) { 
              
  			a[i]=b[i]; 
  		} 
  	} 
  	return a; 
  } 
  
  return function(a) { 
  	var i=1; 
  	for (;i<arguments.length;i++) { 
  		if ("object"===typeof arguments[i]) {
  			mixinup(a,arguments[i]); 
  		} 
  	} 
  	return a;
  }
})(),
Creator = require('./modules/creator.js'),
slashrize= function(url) {
	url=url.replace(/\\/g, "/").replace('//', '/');
	if (url.substr(-1)!=='/') url+='/';
	return url;
},
synthCli = function(dir, args) {
	if (this.constructor!==synthCli)
	return new synthCli(dir, args);
	this.dir = slashrize(dir||process.cwd());
	this.run(args);
}.proto({
	run: function(args) {
		switch(args[2]) {
			case 'init':
				console.log('CREATING NEW SYNTHET COMPONENT');
				new Creator({
					cwd: process.cwd()+'/'
				});
			break;
		}
	}
});

module.exports = synthCli;