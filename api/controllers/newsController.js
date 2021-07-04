const {Speech} = require("../models");
const {Storyboard} = require("../models");
const {Soundtrack} = require("../models");
const sequelize = require("sequelize")
const {User, Project, Like, Comment, Subscribe, Block} = require("../models")

class newsController {
    async createNewProject(req, res) {
        const {name, description, genre, user_id} = req.body
        const project = await Project.create({name, description, genre, user_id})
        res.json(project)
    }

    async getProjects(req, res) {
        if (req.query.filter === 'sub') {
            const subs_id = await Subscribe.findAll({where: {subscriber_id: req.query.id}})
            const ids = subs_id.map(sub => sub.user_id)

            const projects = await Project.findAll({
                attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
                where: {user_id: ids},
                include: {
                    model: User,
                    attributes: ['login']
                },
                order: [['updatedAt', 'desc']]
            })
            res.json(projects)
        } if (req.query.filter.includes('search')) {
            const string = req.query.filter.split(':')[1]

            let projects_for_name = await Project.findAll({
                attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
                where: {name: {[sequelize.Op.substring]: string}},
                include: {
                    model: User,
                    attributes: ['login']
                },
                order: [['updatedAt', 'desc']]
            })

            let projects_for_genre = await Project.findAll({
                attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
                where: {genre: {[sequelize.Op.substring]: string}},
                include: {
                    model: User,
                    attributes: ['login']
                },
                order: [['updatedAt', 'desc']]
            })

            let projects_for_description = await Project.findAll({
                attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
                where: {description: {[sequelize.Op.substring]: string}},
                include: {
                    model: User,
                    attributes: ['login']
                },
                order: [['updatedAt', 'desc']]
            })

            let users = await User.findAll({
                where: {login: {[sequelize.Op.substring]: string}}
            })

            let user_ids = users.map(user => user.id)

            let projects_for_users = await Project.findAll({
                attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
                where: {user_id: user_ids},
                include: {
                    model: User,
                    attributes: ['login']
                },
                order: [['updatedAt', 'desc']]
            })

            let projects = [
                ...projects_for_name,
                ...projects_for_genre,
                ...projects_for_users,
                ...projects_for_description
            ]

            let finalProjects = projects.sort(function(a,b){return a.id < b.id ? -1 : 1;}).reduce(function(arr, el){
                if(!arr.length || arr[arr.length - 1].id != el.id) {
                    arr.push(el);
                }
                return arr;
            }, []);

            res.json(finalProjects)
        } else {
            const projects = await Project.findAll({
                attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
                include: {
                    model: User,
                    attributes: ['login']
                },
                order: [['updatedAt', 'desc']]
            })
            res.json(projects)
        }
    }

    async getProjectCart(req, res) {
        const project = await Project.findOne({
            where: {id: req.query.id},
            attributes: ['name', 'genre', 'description'],
        })
        res.json(project)
    }

    async updateProjectCart(req, res) {
        const {id, name, genre, description} = req.body
        const project = await Project.findOne({where: {id}})
        project.name = name
        project.genre = genre
        project.description = description
        await project.save()
        res.json('Норм')
    }

    async getUserProjects(req, res) {
        const projects = await Project.findAll({
            where: {user_id: req.query.id},
            attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
            include: {
                model: User,
                attributes: ['login']
            }
        })
        res.json(projects)
    }

    async getLikeInfo(req, res) {
        const data = await Like.findAndCountAll({where: {project_id: req.query.id}})
        res.json(data.count)
    }

    async isLiked(req, res) {
        const data = await Like.findOne({where: {project_id: req.query.id, user_id: req.user.id}})
        res.json(data)
    }

    async setLike(req, res) {
        const {project_id} = req.body
        let like = await Like.create({project_id, user_id: req.user.id})
        res.json(like)
    }

    async deleteLike(req, res) {
        const {project_id} = req.body
        await Like.destroy({where: {project_id, user_id: req.user.id}})
        res.json('sas')
    }

    async deleteProject(req, res) {
        const {project_id} = req.body
        await Project.destroy({where: {id: project_id}})
    }

    async setComment(req, res) {
        const {text, project_id, user_id} = req.body
        let comment = await Comment.create({text, user_id, project_id})
        res.json(comment)
    }

    async getComments(req, res) {
        const comments = await Comment.findAll({
            where: {project_id: req.query.id},
            attributes: ['id', 'text', 'updatedAt'],
            include: {
                model: User,
                attributes: ['login', 'id']
            }
        })
        res.json(comments)
    }

    async getProject(req, res) {
        const project = await Project.findOne({
            where: {id: req.query.id},
            attributes: ['id', 'name', 'genre', 'description', 'updatedAt', 'user_id'],
            include: {
                model: User,
                attributes: ['login']
            }
        })
        res.json(project)
    }

    async getBlockCount(req, res) {
        const {count} = await Block.findAndCountAll({where: {project_id: req.query.id}})
        res.json(count)
    }

    async getBlockContent(req, res) {
        const block = await Block.findOne({
            where: {
                project_id: req.query.project_id,
                serial_number: req.query.number
            }
        })

        const audio = await Soundtrack.findAll({where: {block_id: block.id}})
        const images = await Storyboard.findAll({where: {block_id: block.id}})
        const speeches = await Speech.findAll({where: {block_id: block.id}})
        res.json({audio, images, speeches})
    }
}

module.exports = new newsController()