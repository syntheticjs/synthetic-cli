var fs = require('fs'),
prompt = require('prompt'),
extend = require('extend'),
colors = require('colors'),
schemas = require('./schemas.js'),
mkdirp = require('mkdirp'),
_ = require('underscore'),
Creator = function(config) {
	/*
	Init dialog schema
	*/
	this.config = extend({
		cwd: process.cwd()+'/'
	}, config||{});

	this.schema = schemas('creating');
	this.paths = {
		componentFile: this.config.cwd+'component.json',
		indexjs: this.config.cwd+'index.js',
		indexcss: this.config.cwd+'index.js',
		templatefile: this.config.cwd+'template.html'
	};
	
	this.json = {
		"name": "",
		"repository": "http://github.com/",
		"description": "...",
		"version": "0.0.1",
		"keywords": [],
		"dependencies": {
		},
		"license": "MIT",
		"remotes": ["github"]
	};
	prompt.start();
	this.route('name');
};
Creator.prototype = {
	constructor: Creator,
	route: function(step) {
		
		prompt.get(this.schema[step], function (err, result) {
			if (err) {
				throw 'Error 21'
			} else {
				this.finish(step, result);
			}
		}.bind(this));
	},
	finish: function(step, result) {
		switch(step) {
			case 'name':
				this.json.name = result.name;
				this.json.description = result.description;
				this.json.dist = "dist/"+result.name+".js";
				this.json.scripts = ["src/"+result.name+".js"];
				this.route('isabs');
			break;
			case 'isabs':
				this.json.repository = result.org+"/"+this.json.name;
				this.route('tags');
			break;
			case 'tags':
				this.json.tags = result.tags;
				this.render();
			break;
		}
	},
	render: function() {

		try {
				var stringified = JSON.stringify(this.json, null, 2);
		} catch(e) {
			this.warn('Bad object!');
			return;
		}

		fs.writeFile(this.paths.componentFile, stringified, function(err) {
				if (err) {
					this.warn('Error writing file');
				} else {
					this.log('Successful creation component.json');
				}
		}.bind(this));

		// Create dist dir
		mkdirp(this.config.cwd+"dist", function() {
		});

		// Create src dir
		mkdirp(this.config.cwd+"src", function() {
			// Create js
			fs.writeFile(this.config.cwd+"src/"+this.json.name+".js", "define(function() {\n\n\n});", function(err) {
				if (err) {
					this.warn('Error writing js file');
				} else {
					this.log('Successful creation '+this.config.cwd+"src/"+this.json.name+".js");
				}
			}.bind(this));
		}.bind(this));

		// Create gitignore
		fs.writeFile(this.config.cwd+".gitignore", fs.readFileSync(__dirname+"/files/gitignore", "utf-8"), function(err) {
			if (err) {
				this.warn('Error writing js file');
			} else {
				this.log('Successful creation .gitignore');
			}
		}.bind(this));

		// Create index.html
		fs.writeFile(this.config.cwd+"index.html", _.template(fs.readFileSync(__dirname+"/files/index.html", "utf-8"))({
			component: this.json
		}), function(err) {
			if (err) {
				this.warn('Error writing js file');
			} else {
				this.log('Successful creation .gitignore');
			}
		}.bind(this));

		// Create css
		/*fs.writeFile(this.paths.indexcss, this.json.name+"{\n\n\n}", function(err) {
			if (err) {
				this.warn('Error writing css file');
			} else {
				this.log('Successful creation index.css');
			}
		}.bind(this));*/

		// Create template
		/*fs.writeFile(this.paths.templatefile, "", function(err) {
			if (err) {
				this.warn('Error writing template file');
			} else {
				this.log('Successful creation template.html');
			}
		}.bind(this));*/
	},
	error: function(message) {
		console.log('error: ', message);
	},
	log: function(message) {
		console.log('log: ', message);
	}
}
module.exports = Creator;