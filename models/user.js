
var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const roles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '${VALUE} not permit'
}

const schemaDefinition = {
  name:      { type: String, required: [true, 'Name is required']},
  email:     { type: String, unique: true, required: [true, 'Email is required']},
  password:  { type: String, required: [true, 'Password is required']},
  img:       { type: String, required: false},
  role:      { type: String, required: [true, 'Role is required'], default: 'USER_ROLE', enum: roles}
}

const UserSchema = new Schema(schemaDefinition);

UserSchema.plugin( validator, { message: '{PATH} is required'});

module.exports = mongoose.model('users', UserSchema);
