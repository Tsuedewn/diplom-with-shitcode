const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../authMiddleware")

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/getUser', userController.getUser)

router.get('/isAuth', authMiddleware, userController.isAuth)
router.post('/updateInfo', authMiddleware, userController.updateInfo)
router.post('/subscribe', authMiddleware, userController.subscribe)
router.post('/unsubscribe', authMiddleware, userController.unsubscribe)
router.post('/checkSubscribe', authMiddleware, userController.checkSubscribe)
router.get('/getSubscribes', authMiddleware, userController.getSubscribes)
router.get('/getSubscribers', authMiddleware, userController.getSubscribers)

module.exports = router