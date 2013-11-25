kakuen
======

## What's kakun

Mock up RESTful webservices simply by editing text files, e.g., 
  1. `GET__#book#123#authors.json  ==> GET /book/123/authors`
  2. `GET__#book?id=123.json ==> GET /book?id=123/authors`

## Quick start

Install dependencies:

   $ npm install

Start the server
 
   $ nodemon

Edit json or xml files under 'mockups' in the format:``<method>__#url.[xml|json]`` e.g., ``GET__#book?id=123.json`` ('#' is used to replace '/')

Finally access it by curl or browser e.g., http://localhost:8443/book?id=123

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
