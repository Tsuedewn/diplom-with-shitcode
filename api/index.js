require("dotenv").config()
const express = require("express")
const sequelize = require("./db")
const fileupload = require('express-fileupload')
const PORT = process.env.PORT || 5000
const cors = require("cors")
const router = require('./routes/index')

const app = express()
app.use(fileupload({}))
app.use(express.static('files'))
app.use(cors())
app.use(express.json())
app.use('/api', router)

const server = require('http').Server(app)
const io = require('socket.io')(server,{cors:{origin:"*"}});

io.on('connection', socket => {
    console.log('Everytime do this')
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log(e)
    }
}

start().then(() => server.listen(PORT, () => console.log(`Server run at ${PORT}`)))