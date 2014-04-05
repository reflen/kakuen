![alt tag](https://imagizer.imageshack.us/v2/240x250q90/c/19/68t6.png)
kakuen
======

[![Build Status](https://travis-ci.org/homerquan/kakuen.png?branch=master)](https://travis-ci.org/homerquan/kakuen)

Write by [homerquan](http://www.homerquan.com)

## What's kakun

Mock up RESTful webservices simply by editing text files, e.g., 
  1. `GET__#book#123#authors.json  ==> GET /book/123/authors`
  2. `POST__#book@id=123.json ==> POST /book?id=123`
  
For json, a schema-based mockup is supported, e.g., in ``sample_server/mocks/GET__#search@q=js.json``
  * for single item <pre><code>
		"@KAKUEN_ITEM(offset)": {
			"@KAKUEN_TYPE": "natural",
			"@KAKUEN_PARAM": {
				"min": 1,
				"max": 20
			}
		}
  </code></pre>
  will be ``offset:12``
  * for collection <pre><code>
       "@KAKUEN_COLLECTION(data)(10)": {
		"name": {
			"@KAKUEN_TYPE": "name",
			"@KAKUEN_PARAM": {
				"middle_initial": true
			}
		},
		"cover-image": {
			"@KAKUEN_TYPE": "image",
			"@KAKUEN_PARAM": {
				"w": 165,
				"h": 165,
				"topic": "sports"
			}
		}
	}
  </code></pre>
  will be <pre><code>
   [
     {
      name: "Leo B. McCarthy",
      cover-image: "http://lorempixel.com/165/165/sports"
     },
     ... and 9 more
   ]
  </code></pre>

## Quick start

  1. Install

   $ npm install kakuen

  1. Launch the sample server or create your own by using kakuen as a handler in express e.g., server.js <pre><code>
    var express=require('express'),
    kakuen=require('kakuen'),
    server=express(),
    moker=kakuen.mocker;

    server.use(moker);
    server.listen(8005);
    </code></pre>
  1. Put mockup files in "mocks" at the root directory of your node app (or specify it: `` export KAKUEN_MOCKS_FOLDER="your_mocks_folder" `` ). Then adding or editing your own json or xml files under 'mocks' in the format:``<method>__#url.[xml|json]`` e.g., ``GET__#book@id=123.json`` ('#' to replace '/', '@' to replace '?')
    E.g., 
    * DELETE__#book@id=123.json     (DELETE /book?id=123   
    * GET__#book@id=1234&type=0.xml (GET /book?id=1234&type=0)  
  1. Finally Start the server and access mocks
    E.g.,
    * ``curl http://localhost:8005/book?id=123``
    * ``curl http://localhost:8005/search?q=java``
    * ``curl http://localhost:8005/search?q=js``

## Generating mockup data by type
  * all data types in the document of [chance.js](http://chancejs.com/), such as person name, address, ipv6 ...
    e.g., 
    ``chance.month({raw: true});`` 
    will be <pre><code>
       "@KAKUEN_TYPE": "month",
       "@KAKUEN_PARAM": {
	   "raw": true,
       }
    </code></pre>
    
  * image from [lorempixel.com](http://lorempixel.com), which needs to specify weight, height, and topic (option) e.g.,    <pre><code>
   "cover-image": {
	"@KAKUEN_TYPE": "image",
	"@KAKUEN_PARAM": {
		"w": 165,
		"h": 165,
		"topic": "sports"
	}
   }
   </code></pre>
  

## Features
  
  * actively monitoring change in mock files.
  * support both json and xml 
  * support scheme (for json only)
  * support random typed data generator (for json only)
  
## Change log
  * v4.0.0 add schema-based mockup using chance data generator
  * v3.5.4 fix file name in windows system  

## License
The MIT license.

Copyright (c) 2013 Homer Quan (http://www.homerquan.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
