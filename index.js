const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const User = require('./src/models/User')
require('./src/config/db')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send({
        data: 'pong'
    })
})

app.post('/register', (req, res) => {
    let { email, name, username, password } = req.body
    console.log(email, name, username, password)
    const token = require('crypto').randomBytes(16).toString('hex')

    let newUser = new User({
        name,
        email,
        password,
        token,
        active: false,
        username
    })
    newUser.save((err, user) => {
        if (!err) {
            let { _id } = user
            res.send({ data: 'ok', urlVerify: `'/auth/verification/verify-account/${_id}/${token}'` })
        } else
            res.send({ data: `${err}` })
    })

})

app.get('/auth/verification/verify-account/:userId/:token', (req, res) => {
    const { userId, token } = req.params;
    User.findOne({ _id: userId }, (err, doc) => {
        if (err) {
            res.send({ data: `${err}` })
        } else {
            // const { token: dataToken } = doc;
            const dataToken = doc.token;
            if (token == dataToken) {
                doc.active = true
                doc.save((err, data) => {
                })
                res.send({ data: 'OK' })
            } else {
                res.send({ data: 'action failed' })
            }
        }
    })
})

app.post('/login', (req, res) => {
    let { username, password } = req.body;
    User.findOne({ username }, (err, doc) => {
        console.log(doc)
        if (!err && doc) {
            let { active, password: docPass } = doc
            if (active) {
                if (password == docPass) {
                    res.status(200).json({ data: 'OK' })
                }
            } else {
                res.status(200).json({ data: 'not active' })
            }
        } else
            res.status(200).json({ data: `login failed ${err}` })
    })
})

// /abc require login. lần đầu vào check chưa login redirect đến login. login xong
// lần 2 đã login và /abc check đã login vào luôn /abc mà ko redirect qua /login
app.get('/abc', (res, req) => {

})
app.listen(3030, () => {
    console.log("app running")
})