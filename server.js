const express = require('express')
const app = express();

const PORT = process.env.PORT || 8000

app.use(express.static('public'));

const dbConnect = require('./db')
dbConnect();


// routes
app.use(express.json())
const Comment = require('./models/comment')
app.post('/api/comments', (req, res) => {
     const comment = new Comment({
          username: req.body.username,
          comment: req.body.comment
     })

     comment.save().then(response => {
          res.send(response)
     })
})
app.get('/api/comments',(req,res)=>{
     Comment.find().then((comments)=>{
          res.send(comments)
     })
})

const server = app.listen(PORT, () => {
     console.log(`server up at ${PORT}`);
})

// socket working
let io = require('socket.io')(server)

io.on('connection', (socket) => {
     console.log(`New connection ${socket.id}`);

     socket.on('comment', (data) => {
          // console.log(data);
          data.time = Date()
          socket.broadcast.emit('comment', data)
     })

     socket.on('typing', (data) => {
          // console.log(data);
          // data.time = Date()
          socket.broadcast.emit('typing', data)
     })

})
