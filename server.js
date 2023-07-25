const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
const { v4: uuidV4 } = require('uuid');
const { ExpressPeerServer } = require('peer');

//Setup Peer Server
const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: "/",
});

app.use('/peerjs', peerServer);

//setup ejs
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    console.log("connected");
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId);
    })
})

const PORT = process.env.PORT||3030
server.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
