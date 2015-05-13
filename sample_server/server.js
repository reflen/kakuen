var express=require('express'),
kakuen=require('..'),
server=express(),
moker=kakuen.mocker;

server.use(moker);
server.listen(8005);
