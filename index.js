const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(BodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'noodle'
})  

app.get('/products', (req, res) => {
    db.execute(
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
    db.execute(
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
    db.execute(
        'DELETE FROM products WHERE id = ?',
        [id]
    )
    res.json({ msg: 'deleted', id })
})

app.put('/update/:id', (req, res) => {
    const {title, price} = req.body
    const id = req.params.id
    db.execute(
        'UPDATE products SET title = ?, price = ? WHERE id = ?',
        [title, price, id]
    )
    res.json({ msg: 'updated', id, title, price })
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    db.execute(
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

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})
