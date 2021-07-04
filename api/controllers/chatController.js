const {Op} = require("sequelize");
const {User, Chat, Message} = require("../models")

class ChatController {
    async sendMessage(req, res) {
        let chat = await Chat.findOne({where: {first_id: req.user.id, second_id: req.body.id}})

        if (!chat) {
            chat = await Chat.findOne({where: {first_id: req.body.id, second_id: req.user.id}})
        }

        if (!chat) {
            chat = await Chat.create({first_id: req.user.id, second_id: req.body.id})
        }

        await Message.create({chat_id: chat.id, sender_id: req.user.id, text: req.body.text})
        return res.json(`Сообщение с текстом "${req.body.text}" отправлено юзеру ${req.body.id}`)
    }
}

module.exports = new ChatController()