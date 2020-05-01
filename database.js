var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/hospitalDB', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
  .then(resp => console.log(`Database connected successfully`))
  .catch(error => {
    throw error;
  })