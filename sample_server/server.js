var express=require('express'),
kakuen=require('..'),
server=express(),
moker = kakuen.createMocker();

server.use(moker);
server.listen(8005);
