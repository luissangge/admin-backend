//Requires
var express = require('express');
var morgan  = require('morgan');
const fileUpload = require('express-fileupload');


//Initialized
var app = express();


//DB conection
require('./database');



//Middleware
app.use( morgan("dev"));
app.use(express.json());
app.use(fileUpload());

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/api/upload', serveIndex(__dirname + '/upload'));


//Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/hospitals', require('./routes/hospital.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/search', require('./routes/serch.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/load-image', require('./routes/load-image.routes'));



//Server Running
app.listen(3000,  () => {
  console.log('Running server on port:', 3000);
})