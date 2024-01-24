const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    fromId: {type: DataTypes.STRING},
    chatId: {type: DataTypes.STRING},
    nameUser: {type: DataTypes.STRING},
})

module.exports = User;