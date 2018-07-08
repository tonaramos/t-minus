const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require ('path');
const bodyparser = require('body-parser');

const socket = require('socket.io');
const io = socket(server);

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => res.send('Hello world!'))


let clients = 0;
let realClients = 0;
io.on('connection', function(socket) {
  clients++;
// if (realClients%2 === 0 || realClients === 0) {
//   realClients++;
//   console.log('connection by', socket.id,  ` ${clients} clients`);

 
//   //const roomsInfo = io.sockets;
//   //console.log('io.sockets.adapter.rooms -> ', roomsInfo);

//   // socket.on('chat', (data) => {
//   //   data.userId = socket.id;
//   //   data.rooms = io.sockets.adapter.rooms;
//   //   data.usersConnected = clients;
//   //   io.sockets.emit('chat', data);
    
//   // })

//   const numOfRooms = 3; //just result in a number based on the number of ppl logged in 

// }
socket.on('room1', room => socket.join(room));
socket.on('chat', (data) => {
  data.userId = socket.id;
  data.rooms = io.sockets.adapter.rooms;
  data.usersConnected = realClients;
  io.sockets.emit('chat', data);
  
})

socket.on('disconnect', function (socket) {
  clients--;
  
  console.log('A user disconnected', socket.id);
  console.log('# of clients left ->', clients)
  console.log('real clients ->', realClients)
});
});
     














const port = 3010;
server.listen(port, ()=>console.log('listening on port: ', port));
