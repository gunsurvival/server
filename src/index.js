"use strict";
exports.__esModule = true;
var express_1 = require("express");
var socket_io_1 = require("socket.io");
var app = (0, express_1["default"])();
var io = new socket_io_1.Server();
var port = Number(process.env.PORT) || 3000;
app.listen(port, function () {
    console.log("Server listen: *".concat(port));
});
io.on('connection', function (socket) {
    socket.emit('noArg');
    socket.emit('basicEmit', 1, '2', Buffer.from([3]));
    socket.emit('withAck', '4', function (e) {
        // E is inferred as number
    });
    // Works when broadcast to all
    io.emit('noArg');
    // Works when broadcasting to a room
    io.to('room1').emit('basicEmit', 1, '2', Buffer.from([3]));
});
