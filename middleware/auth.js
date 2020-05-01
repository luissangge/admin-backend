const jwt = require('jsonwebtoken');
const moment = require('moment');
const properties= require('../config/properties');


const auth = {};


auth.isAuth = (req, resp, next) => {

  const token =  req.query.token;
  jwt.verify( token, properties.KEY_SECRET, (error, decode) => {

    //Verificamos si existe un error
    if( error ){
      return resp.status(401).json({
        ok: false,
        message: 'Not Authorized!!!',
        errors: error
      })
    }

    //Verificamos expiracion
    if( decode.exp < moment().unix() ){
      return resp.status(401).json({
        ok: false,
        message: 'Not Authorized!!!',
        errors: { message: 'Token expired'}
      })
    }

    //Set el usuario que hizo la peticion
    req.user = decode.user;

   //Autorizada la ruta
    next();

  })

}

module.exports = auth;