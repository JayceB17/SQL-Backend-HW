// Connects to MySQL database
const mysql = require ('mysql2')
require ('dotenv').config()

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'My50456$my',
  database: 'mycompany_db'
})

module.exports = db