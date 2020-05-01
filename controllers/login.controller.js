var bycrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User  = require('../models/user');
const { KEY_SECRET } = require('../config/properties');

const loginController = {}



loginController.login =  ( req, resp) => {

  const { email, password } =  req.body;

  User.findOne({ email: email}, ( error, userDB) => {

    //Verificar si existe un error de BD
    if( error ){
      return resp.status(500).json({
        ok: false,
        message: 'User not found!!!',
        errors: error
      })
    }

    //Verificar si no encontro el usuario
    if(!userDB){
      return resp.status(400).json({
        ok: false,
        message: 'User not found!!!',
        errors: { message: `Invalid Credential`}
      })
    }

    //Verificar password
    if( !bycrypt.compareSync( password, userDB.password )){
      return resp.status(400).json({
        ok: false,
        message: 'User not found!!!',
        errors: { message: `Invalid Credential`}
      })
    }

    //Creamos el token

    userDB.password = ':-<';
    const token = jwt.sign( { user: userDB }, KEY_SECRET, { expiresIn: 24 * 60 * 60} )


    resp.status(200).json({
      ok: true,
      token: token,
      id: userDB._id
    })

  })

}


module.exports = loginController;

