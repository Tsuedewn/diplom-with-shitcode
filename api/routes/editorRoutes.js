const Router = require("express")
const router = new Router()
const editorController = require("../controllers/editorController")
const authMiddleware = require("../authMiddleware")

router.post('/createNewDialog', authMiddleware, editorController.createNewDialog)
router.post('/createNewMonolog', authMiddleware, editorController.createNewMonolog)
router.post('/deleteBlock', authMiddleware, editorController.deleteBlock)
router.get('/getProjectBlocks', authMiddleware, editorController.getProjectBlocks)
router.get('/getBlockInfo', authMiddleware, editorController.getBlockInfo)
router.post('/editDialog', authMiddleware, editorController.editDialog)
router.post('/editMonolog', authMiddleware, editorController.editMonolog)
router.post('/editOldMonolog', authMiddleware, editorController.editOldMonolog)
router.post('/editOldDialog', authMiddleware, editorController.editOldDialog)
router.post('/uploadFiles', authMiddleware, editorController.uploadFiles)
router.get('/getSoundtrackInfo', authMiddleware, editorController.getSoundtrackInfo)
router.get('/getStoryboardInfo', authMiddleware, editorController.getStoryboardInfo)
router.post('/deleteSoundtrack', authMiddleware, editorController.deleteSoundtrack)
router.post('/deleteStoryboard', authMiddleware, editorController.deleteStoryboard)
router.post('/changeSerialNumber', authMiddleware, editorController.changeSerialNumber)

module.exports = router