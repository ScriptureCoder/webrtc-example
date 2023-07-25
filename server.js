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
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true,
    proxied:false
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

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
        console.log({roomId,userId});
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId);
    })
})

const PORT = process.env.PORT||3030
server.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})