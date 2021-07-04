const Router = require("express")
const router = new Router()
const chatController = require("../controllers/chatController")
const authMiddleware = require("../authMiddleware")

router.post('/sendMessage', authMiddleware, chatController.sendMessage)

module.exports = router