var bycrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../models/user');
const { KEY_SECRET, CLIENT_ID } = require('../config/properties');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

const loginController = {}



loginController.loginGoogle = async (req, resp) => {

  const token = req.body.token;

  try {
    const userGoogle = await verify(token);
   

    const userDB = await User.findOne({ email: userGoogle.email })

    if (userDB) {

      if (userDB.google === false) {
        return resp.status(400).json({
          ok: false,
          errorr: { message: 'Debe de usar su autenticacion normal' }
        })
      } else {

        //usuario existe pero hizo el login por google
        const token = jwt.sign({ user: userDB }, KEY_SECRET, { expiresIn: 24 * 60 * 60 })
        resp.status(200).json({
          ok: true,
          token: token,
          id: userDB._id
        })
      }
    } else{

      const userG = new User();

      userG.name = userGoogle.name;
      userG.email = userGoogle.email;
      userG.password = ':-<';
      userG.img = userGoogle.img;
      userG.google = true;

      const userSaved = await userG.save();
      if( userSaved ){
        const token = jwt.sign({ user: userSaved }, KEY_SECRET, { expiresIn: 24 * 60 * 60 })
        resp.status(200).json({
          ok: true,
          token: token,
          id: userSaved._id
        })
      }else{
        return resp.status(500).json({
          ok: false,
          message: 'Error login google'
        })
      }
    }

  } catch (error) {
    return resp.status(403).json({
      ok: false,
      errorr: { message: 'token no valido', error }
    })
  }



  resp.json('Hola mundo')
}

loginController.login = (req, resp) => {

  const { email, password } = req.body;

  User.findOne({ email: email }, (error, userDB) => {

    //Verificar si existe un error de BD
    if (error) {
      return resp.status(500).json({
        ok: false,
        message: 'User not found!!!',
        errors: error
      })
    }

    //Verificar si no encontro el usuario
    if (!userDB) {
      return resp.status(400).json({
        ok: false,
        message: 'User not found!!!',
        errors: { message: `Invalid Credential` }
      })
    }

    //Verificar password
    if (!bycrypt.compareSync(password, userDB.password)) {
      return resp.status(400).json({
        ok: false,
        message: 'User not found!!!',
        errors: { message: `Invalid Credential` }
      })
    }

    //Creamos el token

    userDB.password = ':-<';
    const token = jwt.sign({ user: userDB }, KEY_SECRET, { expiresIn: 24 * 60 * 60 })


    resp.status(200).json({
      ok: true,
      token: token,
      id: userDB._id
    })

  })

}


//Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}


module.exports = loginController;

