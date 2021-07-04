const {Soundtrack} = require("../models");
const {Storyboard} = require("../models");
const {Speech} = require("../models");
const {Block} = require("../models");
const {Project} = require("../models")
const sequelize = require("sequelize")

class editorController {
    async createNewDialog(req, res) {
        const {data, name, project_id, block_type} = req.body
        const {count: counter} = await Block.findAndCountAll({where: {project_id}})
        console.log(counter)

        const block = await Block.create({block_name: name, project_id, block_type, serial_number: counter + 1})
        for (let i = 0; i < data.length; i++) {
            await Speech.create({actor: data[i].actor, text: data[i].text, block_id: block.id})
        }
        res.json({block_name: block.block_name, id: block.id, block_type: block.block_type, serial_number: block.serial_number})
    }

    async createNewMonolog(req, res) {
        const {text, actor, name, project_id, block_type} = req.body
        const {count: counter} = await Block.findAndCountAll({where: {project_id}})

        const block = await Block.create({block_name: name, project_id, block_type, serial_number: counter + 1})
        await Speech.create({actor, text, block_id: block.id})
        res.json({block_name: block.block_name, id: block.id, block_type: block.block_type, serial_number: block.serial_number})
    }

    async editDialog(req, res) {
        const {data, name, block_id} = req.body

        const block = await Block.findOne({where: {id: block_id}})
        block.block_name = name
        await block.save()

        await Speech.destroy({where: {block_id}})
        for (let i = 0; i < data.length; i++) {
            await Speech.create({actor: data[i].actor, text: data[i].text, block_id})
        }

        res.json({block_name: block.block_name})
    }

    async editOldDialog(req, res) {
        const {data, name, block_id, block_type} = req.body

        const block = await Block.findOne({where: {id: block_id}})
        block.block_name = name
        block.block_type = block_type
        await block.save()

        await Speech.destroy({where: {block_id}})
        for (let i = 0; i < data.length; i++) {
            await Speech.create({actor: data[i].actor, text: data[i].text, block_id})
        }

        res.json({block_name: block.block_name})
    }

    async editMonolog(req, res) {
        const {actor, text, name, block_id} = req.body

        const block = await Block.findOne({where: {id: block_id}})
        block.block_name = name
        await block.save()
        await Speech.destroy({where: {block_id}})
        await Speech.create({actor, text, block_id})

        res.json({block_name: block.block_name})
    }

    async editOldMonolog(req, res) {
        const {actor, text, name, block_id, block_type} = req.body

        const block = await Block.findOne({where: {id: block_id}})
        block.block_name = name
        block.block_type = block_type
        await block.save()
        await Speech.destroy({where: {block_id}})
        await Speech.create({actor, text, block_id})

        res.json({block_name: block.block_name})
    }

    async getProjectBlocks(req, res) {
        const blocks = await Block.findAll({
            where: {project_id: req.query.id},
            attributes: ["block_name", "id", "block_type", "serial_number"],
            order: [['serial_number']]
        })
        res.json(blocks)
    }

    async getBlockInfo(req, res) {
        if (req.query.id === '0') {
            res.json({'sas': 'sas'})
        }
        const block = await Block.findOne({where: {id: req.query.id}})
        const speeches = await Speech.findAll({
            where: {block_id: req.query.id},
            attributes: ['actor', 'text'],
        })
        res.json([block.block_name, speeches])
    }

    async deleteBlock(req, res) {
        await Block.destroy({where: {id: req.body.id}})
        res.json('sas')
    }

    async uploadFiles(req, res) {
        let {imagesUp: files} = req.files
        let {block_id} = req.body

        if (!files[0]) {
            files = [files]
        }

        if (files[0].mimetype.includes('image')) {
            await Storyboard.destroy({where: {block_id}})
            for (let i = 0; i < files.length; i++) {
                await files[i].mv('/home/andrey/dev/proj/DIPLOM/api/files/storyboard/' + files[i].name)
                await Storyboard.create({path: files[i].name, block_id})
            }
            res.json('Вы загрузили картинку')
        } else {
            await Soundtrack.destroy({where: {block_id}})
            for (let i = 0; i < files.length; i++) {
                await files[i].mv('/home/andrey/dev/proj/DIPLOM/api/files/soundtrack/' + files[i].name)
                await Soundtrack.create({path: files[i].name, block_id})
            }
            res.json('Вы загрузили саундтрек')
        }
    }

    async getSoundtrackInfo(req, res) {
        const song = await Soundtrack.findOne({where: {block_id: req.query.id}})

        if (song) {
            res.json({name: song.path})
        } else {
            res.json(false)
        }
    }

    async getStoryboardInfo(req, res) {
        const pics = await Storyboard.findAll({
            where: {block_id: req.query.id},
            attributes: ['path', 'id']
        })

        if (pics) {
            res.json(pics)
        } else {
            res.json(false)
        }
    }

    async deleteSoundtrack(req, res) {
        await Soundtrack.destroy({where: {block_id: req.body.block_id}})
        res.json('sas')
    }

    async deleteStoryboard(req, res) {
        await Storyboard.destroy({where: {block_id: req.body.block_id}})
        res.json('sas')
    }

    async changeSerialNumber(req, res) {
        const {block_id, newNumber: new_number} = req.body
        const current_block = await Block.findOne({where: {id: block_id}})
        const old_number = current_block.serial_number

        const {count} = await Block.findAndCountAll({where: {project_id: current_block.project_id}})

        if (count+1 < new_number || new_number < 0) {
            res.json('Некорректно введен номер!')
        } else {
            await Block.update({
                serial_number: sequelize.literal('serial_number + 1')
            }, { where: sequelize.literal(`serial_number >= ${new_number}`)});

            current_block.serial_number = new_number
            await current_block.save()

            await Block.update({
                serial_number: sequelize.literal('serial_number - 1')
            }, { where: sequelize.literal(`serial_number > ${old_number}`)});

            res.json('Номер успешно изменен!')
        }
    }
}

module.exports = new editorController()