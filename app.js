//Requires
var express = require('express');
var morgan  = require('morgan');


//Initialized
var app = express();


//DB conection
require('./database');



//Middleware
app.use( morgan("dev"))
app.use(express.json())

//Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/login', require('./routes/auth.routes'));



//Server Running
app.listen(3000,  () => {
  console.log('Running server on port:', 3000);
})