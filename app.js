//Requires
var express = require('express');
var morgan  = require('morgan');


//Initialized
var app = express();


//DB conection
require('./database');



//Middleware
app.use( morgan("dev"))

//Routes
app.get('/hello', (req, resp) => {
  
  resp.status(200).json({
    ok: true,
    message: 'Hello word'
  })
})



//Server Running
app.listen(3000,  () => {
  console.log('Running server on port:', 3000);
})