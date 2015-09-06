var extend = require('extend'),
path = require('path'),
schemas = {
	'creating': {
		'name' : {
		    properties: {
		      name: {
		        pattern: /^[a-zA-Z\s\-]+-[a-zA-Z\s\-]+$/,
		        message: 'Component name must have hyphen symbol "-"',
		        default: '',
		        required: true
		      },
		      description: {
		        message: 'Enter description',
		        default: "",
		   		required: true
		      }
		    }
		},
		"isabs": {
			properties: {
				org: {
					pattern: /^[a-zA-Z\s\-]+$/,
					message: "Organization",
					default: "syntheticjs",
					required: false
				}
			}
		},
		"tags": {
			properties:{
				tags: {
					message: 'Tags',
					type: 'array',
					required: true
				}
			}
		},
		"files":  {
			properties:{
				html: {
					message: 'Html',
					type: 'string',
					pattern: /^(yes|no)$/,
					required: true
				}
			}
		},
		'init': function() {
			var probablyName = process.cwd().split(path.sep).pop().replace(/[^a-zA-Z\s\-]*/ig, "");
			
			this.name.properties.name.default = probablyName;
		}
	}
}

module.exports = function(schemaName) {
	var schema = schemas[schemaName];
	schemas[schemaName].init.call(schema);
	return schema;
}