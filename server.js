const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require("fs");
const app = express();

function writeFile(path, data) {
  const jsonStr = JSON.stringify(data);
  fs.writeFile(path, jsonStr, (err) => {
    if (err) rej(err);
    if (!err) {
      console.log('JsonUpdated');
      console.log(data);
    }
  });
}

const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 3*24 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: false,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/file/login.html')
})

app.post('/login', (req, res) => {
let username = req.body.username;
let password = req.body.password;
let database = require('./userdata.json');
let datalong = Object.keys(database).length;
let logtf = false;
for (  var i = 0;  i < datalong;  i++  ) {

  if (username == database[i].username && password == database[i].password) {
      logtf = true;
      break;
    }
 }
if (logtf == true) {
  req.session.regenerate((err) => {
    req.session.username = username;
    res.redirect('/main1.html');
  });
} else {
  res.sendFile(__dirname + '/file/error.html')
}
});

//Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.use(express.static(__dirname + "/public"), (_, res, next) => {
  //404 Testing
  res.status(404)
  res.sendFile(__dirname + "/public/404.html")
});

app.listen(8000);