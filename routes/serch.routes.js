const express = require('express');
const router = express.Router();

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const User = require('../models/user');


//search all
router.get('/all/:term', async (req, resp) => {

  const term = req.params.term;
  const regex = new RegExp(term, 'i');
  try {
    const hospitals = await Hospital.find({ name: regex }).populate('user', 'name email');
    const medicos = await Medico.find({ name: regex }).populate('user', 'name email').populate('hospital');
    const users = await User.find({}, 'name email role').or([{ name: regex }, { email: regex }]);
    resp.json({ hospitals, medicos, users });
  } catch (error) {
    return resp.status(400).json(
      {
        ok: false,
        errors: error
      }

    )
  }


});


router.get('/collection/:tabla/:term', async (req, resp) => {

  //const { tabla, term} = req.params
  const { tabla, term } = req.params
  const regex = new RegExp(term, 'i');
  var data;
  switch (tabla) {
    case 'hospitals':
     data = await Hospital.find({ name: regex }).populate('user', 'name email');
      break;
  
    case 'medicos':
      data = await Medico.find({ name: regex }).populate('user', 'name email').populate('hospital'); 
      break;
    case 'users' :
      data = await User.find({}, 'name email role').or([{ name: regex }, { email: regex }]);
      break;
    default:
      return resp.status(400).json(
        {
          ok: false,
          message: 'Los tipos de collecion son medicos, hospitals y users',
          errors: { message: 'Tipo de collection/tabla no validos'}
        }
  
      )
      break;
  }


 
  resp.status(200).json({
    ok: true,
    [tabla]: data
  })

});


module.exports = router