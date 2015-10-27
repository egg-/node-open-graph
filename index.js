'use strict';

var http = require('http'),
	https = require('https'),
	cheerio = require('cheerio');


var shorthandProperties = {
	"image": "image:url",
	"video": "video:url",
	"audio": "audio:url"
};


exports = module.exports = function(url, cb, options){
	exports.getHTML(url, function(err, html) {
		if (err) {
			return cb(err);
		}
		var $ = cheerio.load(html);
		cb(null, exports.parse($, options));
	});
};


exports.getHTML = function(url, cb){
	var purl = require('url').parse(url);
	
	if (!purl.protocol) {
		purl = require('url').parse("http://"+url);
	}
	
	var httpModule = purl.protocol === 'https:'? https : http;
	
	url = require('url').format(purl);
	
	var client = httpModule.get(url, function(res){
		res.setEncoding('utf-8');
		
		var html = "";
		
		res.on('data', function(data){
			html += data;
		});
		
		res.on('end', function(){
			if (res.statusCode >= 300 && res.statusCode < 400)
			{
				exports.getHTML(res.headers.location, cb);
			}
			else
			{
				cb(null, html);
			}
			
		});
	});
	
	client.on('error', function(err){
		cb(err);
	});
};


exports.parse = function($, options){
	options = options || {};
	
	// Check for xml namespace
	var namespaces = options.namespaces || [],
		$html = $('html');
	
	if ($html.length)
	{
		var attribKeys = Object.keys($html[0].attribs);
		
		attribKeys.some(function(attrName){
			var attrValue = $html.attr(attrName);
			
			if (attrValue.toLowerCase() === 'http://opengraphprotocol.org/schema/' && attrName.substring(0, 6) === 'xmlns:') {
				namespaces.push(attrName.substring(6));
				return false;
			}
		});
	}
	else if (options.strict) {
		return null;
	}

	if (namespaces.length === 0) {
		// If no namespace is explicitly set..
		if (options.strict) {
			// and strict mode is specified, abort parse.
			return null;
		} else {
			// and strict mode is not specific, then default to "og"
			namespaces.push("og");
		}
	}
	
	var meta = {},
		metaTags = $('meta');
	
	var getProperty = function(element) {
		var property = element.attr('property');
		if ( ! property) {
			return null;
		}

		for (var i = 0; i < namespaces.length; i++) {
			if (property.substring(0, namespaces[i].length) === namespaces[i]) {
				return options.overall ? property : property.substring(namespaces[i].length + 1);
			}
		}

		return null;
	};

	metaTags.each(function() {
		var element = $(this),
 			property = getProperty(element), 
 			content = element.attr('content');

		if ( ! property) {
			return;
		}

		// If property is a shorthand for a longer property,
		// Use the full property
		property = shorthandProperties[property] || property;
		
		var key, tmp,
			ptr = meta,
			keys = property.split(':');

		// we want to leave one key to assign to so we always use references
		// as long as there's one key left, we're dealing with a sub-node and not a value

		while (keys.length > 1) {
			key = keys.shift();

			if (Array.isArray(ptr[key])) {
				// the last index of ptr[key] should become
				// the object we are examining.
				tmp = ptr[key].length-1;
				ptr = ptr[key];
				key = tmp;
			}

			if (typeof ptr[key] === 'string') {
				// if it's a string, convert it
				ptr[key] = { '': ptr[key] };
			} else if (ptr[key] === undefined) {
				// create a new key
				ptr[key] = {};
			}

			// move our pointer to the next subnode
			ptr = ptr[key];
		}

		// deal with the last key
		key = keys.shift();

		if (ptr[key] === undefined) {
			ptr[key] = content;
		} else if (Array.isArray(ptr[key])) {
			ptr[key].push(content);
		} else {
			ptr[key] = [ ptr[key], content ];
		}
	});
	
	return meta;
};