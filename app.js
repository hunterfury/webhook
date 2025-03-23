const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let logs = []; // เก็บ log ข้อมูล webhook

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook GET
app.get('/webhook', (req, res) => {
  const data = { method: 'GET', query: req.query, timestamp: new Date() };
  logs.push(data);
  io.emit('webhook', data);
  res.send('Received GET webhook');
});

// Webhook POST
app.post('/webhook', (req, res) => {
  const data = { method: 'POST', body: req.body, timestamp: new Date() };
  logs.push(data);
  io.emit('webhook', data);
  res.send('Received POST webhook');
});

// Path /get
app.get('/get', (req, res) => {
  const getLogs = logs.filter(log => log.method === 'GET');
  res.json(getLogs);
});

// Path /post
app.get('/post', (req, res) => {
  const postLogs = logs.filter(log => log.method === 'POST');
  res.json(postLogs);
});

// หน้าเว็บหลัก
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('init', logs); // ส่ง log ที่มีอยู่ให้ client
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
