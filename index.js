const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const app = express();

app.use(BodyParser.json());
app.use(cors());

const db = mysql.createConnection(process.env.DATABASE_URL || {
    host: 'aws.connect.psdb.cloud',
    user: 'mm1idk6iapp76tqj0rkd',
    password: 'pscale_pw_9FjEONjIRi9oO0p0r85soI4c9iQ7npBYDKpmPhS3zjL',
    database: 'noodle'

})  

app.get('/products', (req, res) => {
    db.query(
        'SELECT * FROM products',
        (err, resulte) => {
            if (err) {
                res.json({ status: 'err', msg: err })
            } else {
                res.json(resulte)
            }
        }
    )
})

app.post('/add', (req, res) => {
    const {title, price, date} = req.body
    db.query(
        'INSERT INTO products (title, price, date) VALUES (?,?,?)',
        [title, price, date],
        (err, result) => {
            if (err) {
                res.json({ status: 'err', msg: err })
            } else {
                res.json({ status: 'ok', msg: 'inserted', title, price })
            }
        }
    )
})

app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id)
    db.query(
        'DELETE FROM products WHERE id = ?',
        [id]
    )
    res.json({ msg: 'deleted', id })
})

app.put('/update/:id', (req, res) => {
    const {title, price} = req.body
    const id = req.params.id
    db.query(
        'UPDATE products SET title = ?, price = ? WHERE id = ?',
        [title, price, id]
    )
    res.json({ msg: 'updated', id, title, price })
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    db.query(
        'SELECT * FROM users',
        (err, users) => {
            if (err) { res.json({ status: 'err', mag: err }); return }
            if (users.length == 0) { res.json({ status: 'err', mag: 'no user found' }); return }
            for (let i in users) {
                let u = users[i];
                if (u['username'] === username && u['password'] === password){
                    res.json({ status: 'ok' })
                } else {
                    res.json({ status: 'err' })
                }

            }
        }
    )
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
