const Router = require("express")
const router = new Router()
const newsController = require("../controllers/newsController")
const authMiddleware = require("../authMiddleware")

router.post('/createNewProject', authMiddleware, newsController.createNewProject)
router.get('/getProjects', newsController.getProjects)
router.get('/getProjectCart', authMiddleware, newsController.getProjectCart)
router.post('/updateProjectCart', authMiddleware, newsController.updateProjectCart)
router.get('/getUserProjects', newsController.getUserProjects)
router.get('/getLikeInfo', newsController.getLikeInfo)
router.get('/isLiked', authMiddleware, newsController.isLiked)
router.post('/setLike', authMiddleware, newsController.setLike)
router.post('/deleteLike', authMiddleware, newsController.deleteLike)
router.post('/deleteProject', authMiddleware, newsController.deleteProject)
router.post('/setComment', newsController.setComment)
router.get('/getProject', newsController.getProject)
router.get('/getComments', newsController.getComments)
router.get('/getBlockCount', newsController.getBlockCount)
router.get('/getBlockContent', newsController.getBlockContent)

module.exports = router