
const medicosController = {}
const Medico = require('../models/medico');


medicosController.getAll = (req, resp) => {

  var desde = req.query.desde || 0;

  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('user', 'name email')
    .populate('hospital')
    .exec((error, medicos) => {

      if (error) {
        return resp.status(500).json({
          ok: false,
          message: 'Medicos not found!!!',
          errors: error
        })
      }

      Medico.count({}, (err, count) => {
        resp.status(200).json({
          ok: true,
          medicos,
          count
        })
      })

    })

}


medicosController.createMedico = (req, resp) => {

  const { name, img, hospital } = req.body;

  const newMedico = new Medico({
    name,
    img,
    user: req.user._id,
    hospital
  })

  newMedico.save((error, medicoSaved) => {

    if (error) {
      return resp.status(400).json({

        ok: false,
        message: 'Medico not created!!!',
        errors: error
      })
    }

    resp.status(201).json({
      ok: true,
      medico: medicoSaved
    })
  })
}


medicosController.updateMedico = (req, resp) => {

  const id = req.params.id;
  Medico.findById(id, (error, medico) => {

    if (error) {
      return resp.status(500).json({
        ok: false,
        message: 'Error searching medico',
        errors: error
      })
    }

    if (!medico) {
      return resp.status(404).json({
        ok: false,
        message: `Medico not found with id: ${id}`,
        errors: { message: `Not exist a Medico with id: ${id}` }
      })
    }

    medico.name = req.body.name;
    medico.user = req.user._id;
    medico.hospital = req.body.hospital;

    medico.save((error, medicoSaved) => {
      if (error) {
        return resp.status(400).json({
          ok: false,
          message: 'Medico not updated!!!',
          errors: error
        })
      }

      resp.status(200).json({
        ok: true,
        medico: medicoSaved
      })
    })

  })
}

medicosController.deleteMedico = (req, resp) => {

  const id = req.params.id;


  Medico.findByIdAndDelete(id, (error, medicoDeleted) => {

    if (!medicoDeleted) {
      return resp.status(400).json({
        ok: false,
        message: `Medico not deleted by id: ${id}`,
        errors: { message: 'Medico not deleted by id' }
      })
    }

    if (error) {
      return resp.status(500).json({
        ok: false,
        message: 'Medico not deleted!!!',
        errors: error
      })
    }


    resp.status(200).json({
      ok: true,
      medico: medicoDeleted
    })
  })

}


module.exports = medicosController;