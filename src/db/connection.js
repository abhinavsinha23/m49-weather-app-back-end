const { Sequelize } = require("sequelize")

const connection = new Sequelize(process.env.CONNECTION_URI, {

    pool: {
        max: 5,
        min: 0,
        idle: 10000
      }})

connection.authenticate()

console.log("DB is connected")

module.exports = connection