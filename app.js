SOCKET_LIST = {};

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

console.log("Server started");

io.sockets.on('connection', function(socket) {
	console.log('new user!');
	var socketId = Math.random();
	SOCKET_LIST[socketId] = socket;

	socket.on('sendMsgToServer', function(data) {
		console.log('someone sent a message!');

		for (var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('addToChat', socket.id + ": " + data);
		}
	});

	socket.on('disconnect', function() {
		delete SOCKET_LIST[socket.id];
	});
});

server.listen(4141);