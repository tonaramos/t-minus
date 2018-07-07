const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require ('path');
const bodyparser = require('body-parser');
//const io = require('socket.io')(app);
const socket = require('socket.io');
const io = socket(server);

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => res.send('Hello world!'))

//socket setup
io.on('connection', function(socket) {
  console.log('made a socket connection!');
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
});
     
const port = 3010;
server.listen(port, ()=>console.log('listening on port: ', port));
