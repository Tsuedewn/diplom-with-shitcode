const sequelize = require("./db")
const {DataTypes} = require("sequelize")

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    login: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
})

const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT}
})

const Chat = sequelize.define('chat', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    genre: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT}
})

const Subscribe= sequelize.define('subscribe', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Like= sequelize.define('like', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT}
})

const Block = sequelize.define('block', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    serial_number: {type: DataTypes.INTEGER},
    block_name: {type: DataTypes.STRING},
    block_type: {type: DataTypes.STRING}
})

const Speech = sequelize.define('speech', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    actor: {type: DataTypes.STRING},
    text: {type: DataTypes.TEXT}
})

const Soundtrack = sequelize.define('soundtrack', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    path: {type: DataTypes.STRING}
})

const Storyboard = sequelize.define('storyboard', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    path: {type: DataTypes.STRING},
})

Message.belongsTo(Chat, {foreignKey: "chat_id", onDelete: "CASCADE"})
Message.belongsTo(User, {foreignKey: "sender_id", onDelete: "CASCADE"})

Chat.belongsTo(User, {foreignKey: "first_id", onDelete: "CASCADE"})
Chat.belongsTo(User, {foreignKey: "second_id", onDelete: "CASCADE"})

Subscribe.belongsTo(User, {foreignKey: "subscriber_id", onDelete: "CASCADE"})
Subscribe.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"})

Like.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"})
Like.belongsTo(Project, {foreignKey: "project_id", onDelete: "CASCADE"})

Comment.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"})
Comment.belongsTo(Project, {foreignKey: "project_id", onDelete: "CASCADE"})

Project.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"})

Block.belongsTo(Project, {foreignKey: "project_id", onDelete: "CASCADE"})

Speech.belongsTo(Block, {foreignKey: "block_id", onDelete: "CASCADE"})
Soundtrack.belongsTo(Block, {foreignKey: "block_id", onDelete: "CASCADE"})
Storyboard.belongsTo(Block, {foreignKey: "block_id", onDelete: "CASCADE"})

module.exports = {
    User, Message, Project, Comment, Like, Subscribe, Block, Soundtrack, Storyboard, Chat, Speech
}