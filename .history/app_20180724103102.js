var express = require('express'),
    app = express() ,
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

    server.listen(3000);
    users = {};

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
    });


    //recive message
    io.sockets.on('connection', function(socket){
        
    // user
    socket.on('new-user', function(data, callback){
        if(data in users){
            callback(false);
        } else{
            callback(true);
            socket.nicknames = data;
            // save socket to the user
            users[socket.nicknames] = socket;
            updateNicknames();            
        }
    });

    // update users
    function updateNicknames(){
        io.sockets.emit('usernames', users);
        console.log("called..");
    };

    // disconnect
    socket.on('disconnect', function(data){
        if(!socket.nicknames) return;
        delete.users[socket]
        nicknames.splice(nicknames.indexOf(socket.nicknames), 1);
        updateNicknames();
    });


        // message
        socket.on('send-message', function(data){
            io.sockets.emit('new-message', {msg: data, username: socket.nicknames});
            // sockets.broadcast.emit('new message', data);
        });
    });