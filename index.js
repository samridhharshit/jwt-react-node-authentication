const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const port = 5000;
const secret = "my_secret";

const con = require('./db.js');
const withAuth = require('./middleware.js');

//setting up engines
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/api/home', function(req, res) {
    res.send('Welcome User!');
});

app.get('/api/secret', withAuth, function(req, res) {
    res.send('The password is potato');
});

// POST route to register a user
app.post('/api/register', async function(req, res) {
   console.log(req.body);
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = {
        email: email,
        password: hashedPassword
    };

    con.query(`insert into User set ?`, [values], (err, result) => {
        if (err) throw err;
        console.log(result);
    });
});

app.post('/api/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    con.query(`select * from User where email = ?`, [email], (err, row) => {
        if (err) throw err;
        console.log(row[0].password);
        // compares hashed password saved in db with the password entered by the user on the client side
        bcrypt.compare(password, row[0].password, (err, res) => {
            if (err) throw err;
            console.log(res);
        })
    })
});

app.post('/api/authenticate', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    con.query(`select * from User where email = ?`, [email], (err, user) => {
        if (err) throw err;
        // console.log(user);
        else if (!user) {
            res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
        } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) throw err;
                else if (result === false) {
                    res.status(401)
                        .json({
                            error: 'Incorrect email or password'
                        });
                } else {
                    const payload = {email};
                    const token = jwt.sign(payload, secret, {expiresIn: '30s'});
                    console.log("token", token);
                    res.cookie('token', token, {httpOnly: true})
                        .sendStatus(200);
                }
                console.log(result);
            })
        }

    })
});

// a way to simply ask our server if we have a valid token saved to our browser cookies
app.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});

app.listen(port, () => {console.log(`listening to port ${port}`)});