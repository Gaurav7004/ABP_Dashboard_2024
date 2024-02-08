
const { INTEGER } = require('sequelize');
const pool = require('./database')

const User = pool.define('User', {
    username : {
        type: INTEGER
    },
    password : {
        type: INTEGER
    },
    blockCode : {
        type: INTEGER
    }
});

module.exports = User;