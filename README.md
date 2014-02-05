kakuen
======

## What's kakun

Mock up RESTful webservices simply by editing text files, e.g., 
  1. `GET__#book#123#authors.json  ==> GET /book/123/authors`
  2. `POST__#book?id=123.json ==> POST /book?id=123`

## Quick start

  1. Install

   $ npm install kakuen

  2. Use kakuen as a handler in express e.g., server.js

```
    var express=require('express'),
    kakuen=require('kakuen'),
    server=express(),
    moker=kakuen.mocker;

    server.use(moker);
    server.listen(8005);
```

  3. Create a folder "mocks" (or specify: export KAKUEN_MOCKS_FOLDER="your_mocks_folder" ) in the same directory of server.js. Then edit json or xml files under 'mocks' in the format:``<method>__#url.[xml|json]`` e.g., ``GET__#book?id=123.json`` ('#' is used to replace '/')

Samples:

  * DELETE__#book?id=123.json        
  * GET__#book?id=1234.json  
  * GET__#city?name=sf.json  
  * PUT__#book?id=123.json
  * POST__#book?id=123.json

  4. Finally Start the server and access mocks e.g.,
   curl http://localhost:8005/book?id=123

## Features
  
  * monitoring change in mock files.
  * support both json and xml 

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
