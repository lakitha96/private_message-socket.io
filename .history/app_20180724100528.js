var express = require('express'),
    app = express() ,
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

    server.listen(3000);
    nicknames = [];

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
    });


    //recive message
    io.sockets.on('connection', function(socket){
        
    // user
    socket.on('new-user', function(data, callback){
        if(nicknames.indexOf(data) != -1){
            callback(false);
        } else{
            callback(true);
            socket.nicknames = data;
            nicknames.push(socket.nicknames);
            io.sockets.emit('usernames', nicknames);
        }
    });

    // disconnect
    socket.on('disconnecst', function(data){
        if(!socket.nicknames) return;
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNick
    })


        // message
        socket.on('send-message', function(data){
            io.sockets.emit('new-message', data);
            // sockets.broadcast.emit('new message', data);
        });
    });