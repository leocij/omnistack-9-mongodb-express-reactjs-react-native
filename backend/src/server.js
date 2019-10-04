const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')

const routes = require('./routes')

const app = express()
const server = http.Server(app)
const io = socketio(server)

mongoose.connect(
  'mongodb+srv://user:password@cluster0-xmyjr.mongodb.net/omnistack9?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
)

// Armazenar em banco para não perder a sessão
const connectedUsers = {}

io.on('connection', socket => {
  // console.log('Usuário conectado', socket.id)
  // console.log(socket.handshake.query)

  const { user_id } = socket.handshake.query

  connectedUsers[user_id] = socket.id
})

// Interceptor Middleare
app.use((req, res, next) => {
  req.io = io
  req.connectedUsers = connectedUsers

  // Volta ao fluxo normal
  return next()
})

app.use(cors())
app.use(express.json())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)

server.listen(3333)