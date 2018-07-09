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


let numUsers = 0; 
let realClients = 0;
let usersArr = [];
let loginTimer = 1;
let secondsLeft = loginTimer;
let timeInterval;
let raceOn = false;


//==================  SOCKET CONNECTION  ================
io.on('connection', function(socket) {
  //console.log('user connected, userId-> ', socket.id, '#ofUsers-> ', numUsers);
  let addedUser = false;
  numUsers++;
  if (realClients%2 === 0 || realClients === 0) {
    realClients++;
  }

  
  
  //================ AT FIRST CONNECTION & LOGIN TIMER
  socket.on('checkIn', () => {
    if (!addedUser) {
      clearInterval(timeInterval);
      secondsLeft = loginTimer;
      timeInterval = setInterval( () => {
        --secondsLeft;
        io.sockets.emit('timeLeft',{secondsLeft})
        if (secondsLeft <= 0) {
        io.sockets.emit('phaseTwoStart')
        raceOn = true;          //////////////
        clearInterval(timeInterval);
        }
      }, 1000);
    }
  })


  //==================== USER UPDATES

  socket.emit('firstUpdate', () => {   
    usersArr.push(socke.id)
    // console.log('usersArr-> ', usersArr);
    socket.broadcast.emit('callForFirstUpdate')
  });

  socket.on('addToNumOfUsers', () => {
    io.sockets.emit('addToNumOfUsers')
  })

  socket.on('add user', (newUser) => {
    if (addedUser) return;
    socket.username = newUser.playerUpdate.playerName;
    newUser.userId = socket.id;
    ++numUsers;
    addedUser = true;
    // console.log('data form add user-> ', newUser)
    io.sockets.emit('login', newUser)
  })
  




  //==================== RACE UPDATES
 
  socket.on('finisher', data => {
    // console.log('got a finisher in the server')
     io.sockets.emit('incomingFinisher', data);  
  })

  socket.on('goClick', (data) => {
    data.userId = socket.id;
    io.sockets.emit('gameUpdate', data);
  })
 
  socket.on('completeRace', () => {
    io.sockets.emit('completeRace')
    raceOn = false;
  })






  //socket.on('room', room => socket.join(room));
  socket.on('disconnect', function (socket) {
    numUsers--;
    if( numUsers === 0 ) {
      raceOn = false;
    }
    console.log('A user disconnected', socket.id);
  });
});


//setTimeout()












const port = 3010;
server.listen(port, ()=>console.log('listening on port: ', port));
