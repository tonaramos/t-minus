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
  // if(!roomsCount[numOfRooms]) {
  //   roomsCount[numOfRooms] = 1;
  // } else

let numUsers = 0; 
let realClients = 0;
let usersArr = [];
let loginTimer = 11;
let secondsLeft = loginTimer;
let timeInterval;
let rooms = ['1'];
let roomsCount = {'1':0};
let raceOn = false;


let roomAssign = () => {
  let numOfRooms = rooms.length + '';
  //check last room see if it is full, 
  if (roomsCount[numOfRooms] < 2) {                           ////   <---------change the max # of Roos
  //if it is not retunr the string of the room number and add one to the room
    roomsCount[numOfRooms] = roomsCount[numOfRooms] + 1; 
    return numOfRooms;
  } else if (roomsCount[numOfRooms] === 2){                 ////   <---------change the max # of Roos
  //if it is then add a number to the arr and roomCount with one count
    let newRoom = (rooms.length+1) + ''; 
    rooms.push(newRoom);
    roomsCount[newRoom] = 1;
    return newRoom;
  }
   return 'Room assigment error.'
}


//==================  SOCKET CONNECTION  ================
io.on('connection', function(socket) {
  //console.log('user connected, userId-> ', socket.id, '#ofUsers-> ', numUsers);
  console.log('RoomsArr -> ', rooms, '  roomsCount object-> ', roomsCount);
  console.log('userc connected room ->', socket.room)
  let addedUser = false;
  numUsers++;
  if (realClients%2 === 0 || realClients === 0) {
    realClients++;
  }

  //assign a room after first connection DONE
  // send back client the room          PENDING
  // and include the room in every message the clients sends from now on

  //server handle all calls for clients from different rooms. 

  
  
  //================ AT FIRST CONNECTION & LOGIN TIMER w/ second stage trigger
  socket.on('checkIn', () => {
   
    if (!addedUser) {
      //check rooms, add if need it, join the client to it
      let roomToAdd = roomAssign(); 
      let currentId = socket.id;
      socket.join(roomToAdd, () => {
        //return the room assigned                                  <---Pending
       // socket.to(socket.id).emit('roomToJoin', roomToAdd);
        socket.emit('roomToJoin', {room: roomToAdd, id: currentId})
        console.log('##### got the te end of checking for a new room', currentId, ' to add to room->' ,roomToAdd)
      });


      //============ timer starts
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
      //=========== timer ends  
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
    console.log('the room this socket belongs to ->', socket.room)
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
      rooms = [];
      roomsCount = {};
    }
    console.log('A user disconnected', socket.id);
  });
});


//setTimeout()












const port = 5000;
server.listen(port, ()=>console.log('listening on port: ', port));













/*  no rooms implemented here yet
//==================  SOCKET CONNECTION  ================
io.on('connection', function(socket) {
  //console.log('user connected, userId-> ', socket.id, '#ofUsers-> ', numUsers);
  console.log('RoomsArr -> ', rooms, '  roomsCount object-> ', roomsCount);
  let addedUser = false;
  numUsers++;
  if (realClients%2 === 0 || realClients === 0) {
    realClients++;
  }

  //assign a room after first connection DONE
  // send back client the room          PENDING
  // and include the room in every message the clients sends from now on

  //server handle all calls for clients from different rooms. 

  
  
  //================ AT FIRST CONNECTION & LOGIN TIMER w/ second stage trigger
  socket.on('checkIn', () => {
   
    if (!addedUser) {
      //check rooms, add if need it, join the client to it
      let roomToAdd = roomAssign(); 
      let currentId = socket.id;
      socket.join(roomToAdd, () => {
        //return the room assigned                                  <---Pending
       // socket.to(socket.id).emit('roomToJoin', roomToAdd);
        socket.emit('roomToJoin', {room: roomToAdd, id: currentId})
        console.log('##### got the te end of checking for a new room', currentId, ' to add to room->' ,roomToAdd)
      });

      //============ timer starts
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
      //=========== timer ends  
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
      rooms = [];
      roomsCount = {};
    }
    console.log('A user disconnected', socket.id);
  });

*/