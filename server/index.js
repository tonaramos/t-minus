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
  console.log('made a socket connection at ->', Date.now(), 'by -> ', socket.id);

  socket.on('chat', (data) => {
    data.userId = socket.id;
    io.sockets.emit('chat', data);
    // console.log('data below the emit in server ->', data);
  })
});
     
const port = 3010;
server.listen(port, ()=>console.log('listening on port: ', port));
