const {Pool} = require("pg")
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const port = 4000;

const pool = new Pool({
    user: "postgres",
    password: "admin",
    database: "login_system",
    host: "localhost",
    port: 5433,
    
});

// const createTblQry = 'CREATE TABLE accounts2 ( user_id serial PRIMARY KEY, username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) UNIQUE NOT NULL);';

// pool
//     .query(createTblQry)
//     .then((Response) => {
//         console.log("Table Created")

// })
// .catch((err) => {
//     console.log(err);
// });

const getUsers = (req, res) => {
    pool.query('SELECT * FROM abp_monthly_data ORDER BY id ASC', (err, res) => {
        if (err){
            throw err
        }
        express.response.status(200).json(res.rows)
    })
}

// const test = "123";
// pool.query(`SELECT * FROM abp_monthly_data ORDER BY ${test} id ASC`, (err, res) => {

module.exports = {pool};