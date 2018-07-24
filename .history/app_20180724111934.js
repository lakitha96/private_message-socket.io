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
        io.sockets.emit('usernames', Object.keys(users));
        console.log("called..");
    };

    // disconnect
    socket.on('disconnect', function(data){
        if(!socket.nicknames) return;
        delete users[socket.nicknames];
        updateNicknames();
    });


        // message
        socket.on('send-message', function(data, callback){

            // var msg = data.msg.trim();
            if(msg.substring(0, 3) === '/p '){
                msg = msg.substring(3);
                var ind = msg.index.of(' ');
                
                if(ind !== -1){
                    var name = msg.substring(0, ind);
                    var msg = msg.substring(ind + 1);
                    if(name in users){
                        users[name].emit('private', {msg: msg, username: socket.nicknames});
                    }else{
                        callback('Error... User not found....!');
                    }
                    console.log('private...');
                }else{
                    callback('Error...! Please enter valid name of private message partner...');
                }
                
            }else{
                io.sockets.emit('new-message', {msg: msg, username: socket.nicknames});
            }
            
            // sockets.broadcast.emit('new message', data);
        });
    });