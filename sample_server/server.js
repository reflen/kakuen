var express=require('express'),
kakuen=require('kakuen'),
server=express(),
moker=kakuen.mocker;

server.use(moker);
server.listen(8005);