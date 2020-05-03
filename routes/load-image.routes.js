const router = require('express').Router();

const path = require('path');
const fs = require('fs');



router.get('/:collection/:img', (req, resp) => {

  const { collection, img } = req.params;
  
  const pathPhoto = path.resolve(__dirname, `../upload/${ collection }/${ img }`);

  if( fs.existsSync( pathPhoto )){

    resp.sendFile( pathPhoto );
  }else{
  const noImage = path.resolve(__dirname, `../assets/img/no-image.png`);

    resp.sendFile( noImage );
  }
  

})


module.exports = router;