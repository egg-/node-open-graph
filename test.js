'use strict';

var og = require('./');

var url = "https://github.com";


// default namespaces: og
og(url, function(err, meta){
    console.log(JSON.stringify(meta));
});

// set namespaces: og, twitter
og(url, function(err, meta) {
    // console.log(JSON.stringify(meta));
}, {
    overall: true,
    namespaces: ['og', 'twitter']
});