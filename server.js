var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
	host: '2ac54adbf4dadad2000.qb0x.com:80'
});

app.use(express.static('public'));

app.get('*', function(req, res){
	res.send(fs.readFileSync('index.html', { encoding: 'utf8' }));
});

io.on('connection', function(socket){
	socket.on('flux_action', function(payload) {
		socket.broadcast.emit('flux_action', payload);

		client.create({
			index: 'fluxocket-chats',
			type: 'chats',
			body: payload
		}, function (error, response) {
			console.log(error, response);
		});
	});
});

http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});
