# Open Graph for Node.js

An [Open Graph](http://ogp.me/) implementation for Node.js. 
Simple to use; give it a URL and it'll give you the open graph meta properties scraped from that URL.

## Install

	npm install open-graph

## Usage

```js
var og = require('open-graph');

var url = "https://github.com";

// default namespaces: og
og(url, function(err, meta){
	console.log(meta);
})

// set namespaces: og, twitter
og(url, function(err, meta) {
	console.log(meta);
}, {
	overall: true,
	namespaces: ['og', 'twitter']
})
```

Outputs:

```
{
    "url": "https://github.com",
    "site_name": "GitHub",
    "title": "Build software better, together",
    "description": "GitHub is where people build software. More than 11 million people use GitHub to discover, fork, and contribute to over 28 million projects.",
    "image": {
        "url": [
            "https://assets-cdn.github.com/images/modules/open_graph/github-logo.png",
            "https://assets-cdn.github.com/images/modules/open_graph/github-mark.png",
            "https://assets-cdn.github.com/images/modules/open_graph/github-octocat.png"
        ],
        "type": [
            "image/png",
            "image/png",
            "image/png"
        ],
        "width": [
            "1200",
            "1200",
            "1200"
        ],
        "height": [
            "1200",
            "620",
            "620"
        ]
    }
}

{
    "og": {
        "url": "https://github.com",
        "site_name": "GitHub",
        "title": "Build software better, together",
        "description": "GitHub is where people build software. More than 11 million people use GitHub to discover, fork, and contribute to over 28 million projects.",
        "image": [
            {
                "": "https://assets-cdn.github.com/images/modules/open_graph/github-logo.png",
                "type": "image/png",
                "width": "1200",
                "height": "1200"
            },
            {
                "": "https://assets-cdn.github.com/images/modules/open_graph/github-mark.png",
                "type": "image/png",
                "width": "1200",
                "height": "620"
            },
            {
                "": "https://assets-cdn.github.com/images/modules/open_graph/github-octocat.png",
                "type": "image/png",
                "width": "1200",
                "height": "620"
            }
        ]
    },
    "twitter": {
        "site": {
            "": "github",
            "id": "13334762"
        },
        "creator": {
            "": "github",
            "id": "13334762"
        },
        "card": "summary_large_image",
        "title": "GitHub",
        "description": "GitHub is where people build software. More than 11 million people use GitHub to discover, fork, and contribute to over 28 million projects.",
        "image": {
            "src": "https://assets-cdn.github.com/images/modules/open_graph/github-logo.png",
            "width": "1200",
            "height": "1200"
        }
    }
}
```

# Todo

1. **Better parser**  
	Meta data should be parsed into pure JSON and arrays should be handled at root nodes, not leaf nodes
2. **Better data types**  
	Convert properties to numbers, etc.
3. **Fallback data**  
	If Open Graph data isn't present, scrap img elements and document titles off the page.