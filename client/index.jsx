import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import App from './componets/App.jsx';
// const io = require('socket.io-client')

// const socket = io.connect('http://127.0.0.1:3010');
// const info = socket.once('chat', (data)=>{
//  return data;
//   });
// console.log(info)
// // socket.disconnect();

ReactDOM.render(<App />, document.getElementById('app'));