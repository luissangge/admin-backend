const hospitalController = {};
const Hospital = require('../models/hospital');


hospitalController.getAll = (req, resp) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('user', 'name email')
    .exec((error, hospitals) => {

      if (error) {
        return resp.status(500).json({
          ok: false,
          message: 'Hopitals not found!!!',
          errors: error
        })
      }

      Hospital.count({}, (err, count) => {
        resp.status(200).json({
          ok: true,
          hospitals,
          count
        })
      })


    })

}


hospitalController.createHospital = (req, resp) => {

  const { name, img } = req.body;

  const newHospital = new Hospital({
    name,
    img,
    user: req.user._id
  })

  newHospital.save((error, hospitalSaved) => {

    if (error) {
      return resp.status(400).json({

        ok: false,
        message: 'Hospital not created!!!',
        errors: error
      })
    }

    resp.status(201).json({
      ok: true,
      hospital: hospitalSaved
    })
  })
}


hospitalController.updateHospital = (req, resp) => {

  const id = req.params.id;
  Hospital.findById(id, (error, hospital) => {

    if (error) {
      return resp.status(500).json({
        ok: false,
        message: 'Error searching hospital',
        errors: error
      })
    }

    if (!hospital) {
      return resp.status(404).json({
        ok: false,
        message: `Hospital not found with id: ${id}`,
        errors: { message: `Not exist a Hospital with id: ${id}` }
      })
    }

    hospital.name = req.body.name;
    hospital.user = req.user._id;

    hospital.save((error, hospitalSaved) => {
      if (error) {
        return resp.status(400).json({
          ok: false,
          message: 'Hospital not updated!!!',
          errors: error
        })
      }

      resp.status(200).json({
        ok: true,
        hospital: hospitalSaved
      })
    })

  })
}

hospitalController.deleteHospital = (req, resp) => {

  const id = req.params.id;


  Hospital.findByIdAndDelete(id, (error, hospitalDeleted) => {

    if (!hospitalDeleted) {
      return resp.status(400).json({
        ok: false,
        message: `Hospital not deleted by id: ${id}`,
        errors: { message: 'Hospital not deleted by id' }
      })
    }

    if (error) {
      return resp.status(500).json({
        ok: false,
        message: 'Hospital not deleted!!!',
        errors: error
      })
    }


    resp.status(200).json({
      ok: true,
      hospital: hospitalDeleted
    })
  })

}



module.exports = hospitalController;