const Router = require("express")
const router = new Router()
const userRouter = require("./userRoutes")
const chatRouter = require("./chatRoutes")
const newsRouter = require("./newsRoutes")
const editorRouter = require("./editorRoutes")

router.use('/user', userRouter)
router.use('/chat', chatRouter)
router.use('/news', newsRouter)
router.use('/editor', editorRouter)


module.exports = router