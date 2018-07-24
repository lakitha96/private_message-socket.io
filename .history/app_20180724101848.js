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
            updateNicknames();            
        }
    });

    // update nicknames
    function updateNicknames(){
        io.sockets.emit('usernames', nicknames);
        console.log("called..");
    };

    // disconnect
    socket.on('disconnect', function(data){
        if(!socket.nicknames) return;
        nicknames.splice(nicknames.indexOf(socket.nicknames), 1);
        updateNicknames();
    });


        // message
        socket.on('send-message', function(data){
            io.sockets.emit('new-message', {msg: data});
            // sockets.broadcast.emit('new message', data);
        });
    });