require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const cors = require('cors');
const session = require('express-session')

require('./db/db');


app.use(session({
	//
	secret: 'doyouwannaknowasecret',
	resave: false,
	saveUninitialized: false
}));

app.use(function (req, res, next) {
	console.log(req.session)
    res.locals.currentUser = req.sessionStore.sessions.userId;
    currentSessionUser = res.locals.currentUser;
    console.log(currentSessionUser)
    next();
});


// SET UP CORS AS MIDDLEWARE, SO any client can make a request to our server
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const corsOptions = {
  origin: 'https://showscoutreact.herokuapp.com/', // when you deploy your react app, this is where you put the address,
  credentials: true, // allowing cookies to be sent with requests from the client (session cookie),
  optionsSuccessStatus: 200 // some legacy browsers IE11 choke on a 204, and options requests
}

app.use(cors(corsOptions));


// Require the controller after the middleware
// const userController = require('./controllers/employeeController');
const authController  = require('./controllers/authController');

// app.use('/api/v1/employee', employeeController);
app.use('/auth', authController);

app.listen(process.env.PORT, () => {
  console.log('listening on port 9000');
})