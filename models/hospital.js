const mongoose = require('mongoose');

const { Schema } = mongoose;



const schemDefinition ={

  name: { type: String, require: [true, 'Name is required'] },
  img: { type: String, require: false },
  user: { type: Schema.Types.ObjectId, ref: 'User'}

}

const HospitalSchema = new Schema(schemDefinition,{ collection: 'hospitales'});

module.exports = mongoose.model('Hospital', HospitalSchema)