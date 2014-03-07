![alt tag](https://imagizer.imageshack.us/v2/240x250q90/c/19/68t6.png)
kakuen
v4.0.1
======

[![Build Status](https://travis-ci.org/homerquan/kakuen.png?branch=master)](https://travis-ci.org/homerquan/kakuen)

Write by [homerquan](http://www.homerquan.com)

## What's kakun

Mock up RESTful webservices simply by editing text files, e.g., 
  1. `GET__#book#123#authors.json  ==> GET /book/123/authors`
  2. `POST__#book@id=123.json ==> POST /book?id=123`
  
For json file, a schema-based mockup is supported, e.g.,
  * for item
  ```
		"@KAKUEN_ITEM(offset)": {
			"@KAKUEN_TYPE": "natural",
			"@KAKUEN_PARAM": {
				"min": 1,
				"max": 20
			}
		}
  ```
  will be ``offset:12``
  * for collection
  ```
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
  ```
  will be 
  ```
   [
     {
      name: "Leo B. McCarthy",
      cover-image: "http://lorempixel.com/165/165/sports"
     },
     ... 9 more
   ]
  ``` 

## Quick start

  1. Install

   $ npm install kakuen

  1. Use kakuen as a handler in express e.g., server.js
    ```
    var express=require('express'),
    kakuen=require('kakuen'),
    server=express(),
    moker=kakuen.mocker;

    server.use(moker);
    server.listen(8005);
    ```
  1. Rename the folder "sample mocks" as "mocks" and put it in the root directory of your node app (or specify it: `` export KAKUEN_MOCKS_FOLDER="your_mocks_folder" `` ). Then adding or editing json or xml files under 'mocks' in the format:``<method>__#url.[xml|json]`` e.g., ``GET__#book@id=123.json`` ('#' to replace '/', '@' to replace '?')
    E.g., 
    * DELETE__#book@id=123.json     (DELETE /book?id=123   
    * GET__#book@id=1234&type=0.xml (GET /book?id=1234&type=0)  
  1. Finally Start the server and access mocks
    E.g.,
    * ``curl http://localhost:8005/book?id=123``

## Features
  
  * monitoring change in mock files.
  * support both json and xml 
  * 
  
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
