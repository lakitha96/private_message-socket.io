var express = require('express'),
    app = express() ,
    server = require('http').createServer(app),
    io = require('socke')