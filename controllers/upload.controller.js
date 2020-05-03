const uploadController ={}
const fs = require('fs');

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const User = require('../models/user');



uploadController.upload = ( req, resp ) => {

  const { collection, id } = req.params;

  const file = req.files.image;
  const fileName = file.name;

  //Validar que sea una imagen
  const  extensionesvalidas = ['jpg', 'jpeg', 'png', 'JPG'];
  let division = file.name.split('.');
  const extension = division[division.length - 1]

  if(extensionesvalidas.indexOf(extension) < 0){
    return resp.status(400).json({
      ok: false,
      errors: { message: 'Archivo conextension no valida, solo jpg, png, JPG, jpeg' }
    })
  }

  //Validar directorio
  const directoriosValidos = ['medicos', 'usuarios', 'hospitales'];
  if(directoriosValidos.indexOf(collection) < 0){
    return resp.status(400).json({
      ok: false,
      errors: { message: 'No se subio la imagen, directorio invalido,Permitidos:  medicos, usuarios, hospitales' }
    })
  }

  //Path donde guardar el archivo
  const customName = `${id}-${new Date().getTime()}.${extension}`
  const path = `./upload/${collection}/${customName}`;

  file.mv( path , (error) => {

    if( error ){
      return resp.status(500).json({
        ok: false,
        errors: { message: 'No se pudo subir la imagen, error al copiar' }
      })
    }


    uploadPhoto(collection, id, customName, resp);

  })

 

};


function uploadPhoto(collection, id, imageName, resp){

 
  if( 'hospitales' === collection){


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

     
        var pathOld = './upload/hospitales/' + hospital.img;
        if(fs.existsSync(pathOld)){
          fs.unlink(pathOld, () => console.log('Photo eliminada'))
        }
    
     
  
      hospital.img = imageName;
  
      hospital.save((error, hospitalSaved) => {
        if (error) {
          return resp.status(400).json({
            ok: false,
            message: 'Hospital not updated!!!',
            errors: error
          })
        }
  
       return resp.status(200).json({
          ok: true,
          hospital: hospitalSaved
        })
      })
  
    })
   
  }

  if( 'medicos' === collection){


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

     
        var pathOld = './upload/medicos/' + medico.img;
        if(fs.existsSync(pathOld)){
          fs.unlink(pathOld, () => console.log('Photo eliminada'))
        }
    
     
  
      medico.img = imageName;
  
      medico.save((error, medicoSaved) => {
        if (error) {
          return resp.status(400).json({
            ok: false,
            message: 'Medico not updated!!!',
            errors: error
          })
        }
  
       return resp.status(200).json({
          ok: true,
          medico: medicoSaved
        })
      })
  
    })
   
  }

  if( 'usuarios' === collection){


    User.findById(id, 'name email img')
        .exec( (error, user) => {

          if (error) {
            return resp.status(500).json({
              ok: false,
              message: 'Error searching user',
              errors: error
            })
          }
      
          if (!user) {
            return resp.status(404).json({
              ok: false,
              message: `User not found with id: ${id}`,
              errors: { message: `Not exist a User with id: ${id}` }
            })
          }
    
         
            var pathOld = './upload/usuarios/' + user.img;
            if(fs.existsSync(pathOld)){
              fs.unlink(pathOld, () => console.log('Photo eliminada'))
            }
        
         
      
          user.img = imageName;
      
          user.save((error, userSaved) => {
            if (error) {
              return resp.status(400).json({
                ok: false,
                message: 'User not updated!!!',
                errors: error
              })
            }
      
           return resp.status(200).json({
              ok: true,
              user: userSaved
            })
          })
      
        })
   
  }

}



module.exports = uploadController;


