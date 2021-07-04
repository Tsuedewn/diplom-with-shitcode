const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sequelize = require('sequelize')
const {User, Subscribe} = require("../models")

class UserController {
    async registration(req, res) {
        const {name, email, login, password} = req.body

        if (!email || !password || !name || !login) {
            return res.json('Не все введено!');
        }

        let candidate = await User.findOne({where: {login}})
        if (candidate) {
            return res.json("Пользователь таким login существует!")
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({name: name, email: email, login: login, password: hashPassword})

        const token = generateJWT(user.id, user.login, user.email)
        return res.json({token})
    }

    async login(req, res) {
        const {email, password} = req.body

        if (!email || !password) {
            return res.json('Не все данные введены!');
        }

        const candidate = await User.findOne({where: {login: email}})
        if (!candidate) {
            return res.json("Такого пользователя не существует!")
        }

        if (!bcrypt.compareSync(password, candidate.password)) {
            return res.json("Неверный пароль!")
        }

        const token = generateJWT(candidate.id, candidate.login, candidate.email)
        return res.json({token})
    }

    async isAuth(req, res) {
        const token = generateJWT(req.user.id, req.user.login, req.user.email)
        return res.json({token})
    }

    async updateInfo(req, res) {
        const {email, login, newPassword, oldPassword} = req.body
        let user = await User.findOne({where: {"id": req.user.id}})

        if (!email && !login && !oldPassword && !newPassword) {
            return res.json("Вы ничего не ввели!")
        }

        if (oldPassword && newPassword) {
            if (!bcrypt.compareSync(oldPassword, user.password)) {
                return res.json("Неверно введен старый пароль")
            }
            user.password = await bcrypt.hash(newPassword, 5)
        }

        if (email) {
            let candidate = await User.findOne({where: {email}})
            if (candidate) {
                return res.json("Такой email уже есть!")
            }
            user.email = email
        }

        if (login) {
            let candidate = await User.findOne({where: {login}})
            if (candidate) {
                return res.json("Такой login уже есть!")
            }
            user.login = login
        }

        await user.save();
        const token = generateJWT(user.id, user.login, user.email)
        return res.json({token})
    }

    async getUser(req, res) {
        const user = await User.findOne({where: {id: req.query.id}})
        return res.json({"email": user.email, "login": user.login})
    }

    async subscribe(req, res) {
        await Subscribe.create({subscriber_id: req.user.id, user_id: req.body.id})
        return res.json(`Оформлена подписка на айди ${req.body.id}`)
    }

    async unsubscribe(req, res) {
        await Subscribe.destroy({where: {subscriber_id: req.user.id, user_id: req.body.id}})
        return res.json(`Удалена подписка с айди ${req.body.id}`)
    }

    async checkSubscribe(req, res) {
        const subscribe = await Subscribe.findOne({where: {subscriber_id: req.user.id, user_id: req.body.id}})
        return res.json(!subscribe)
    }

    async getSubscribes(req, res) {
        const subscribes = await Subscribe.findAll({
            where: {'subscriber_id': req.user.id},
            attributes: ['id'],
            include: {
                model: User,
                attributes: ['login', 'id']
            }
        })
        return res.json(subscribes)
    }

    async getSubscribers(req, res) {
        const subscribers = await Subscribe.findAll({
            where: {'user_id': req.user.id},
            attributes: ['subscriber_id'],
        })
        const ids = subscribers.map((item) => item.subscriber_id)
        const allSubscribers = await User.findAll({
            where: {'id': ids},
            attributes: ['id', 'login'],
        })
        return res.json(allSubscribers)
    }
}

function generateJWT(id, login, email) {
    return jwt.sign({id: id, login: login, email: email}, process.env.SECRET_KEY,{
        expiresIn: '24h'
    })
}

module.exports = new UserController()