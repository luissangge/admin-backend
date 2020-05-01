const bcrypt = require('bcrypt');
const User = require('../models/user');
const userController = {};


userController.getAllUsers = async (req, resp) => {

  await User.find({}, 'name email img role')
    .exec((error, users) => {

      if (error) {
        return resp.status(500).json({
          ok: false,
          message: 'Users not found!!!',
          errors: error
        })
      }

      resp.status(200).json({
        ok: true,
        users
      })
    })


}

userController.createUser =  (req, resp) => {

  const { name, email, password, img, role } = req.body;
  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    img,
    role
  });

  user.save().then(user => resp.status(201).json({
    ok: true,
    user,
    userToken: req.user
  }))
    .catch(error => resp.status(400).json({
      ok: false,
      message: 'User not created!!!',
      errors: error
    }))
}


userController.updateUser = (req, resp) => {

  const id = req.params.id;
  User.findById(id, (error, user) => {

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

    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    user.password = ':-<'

    user.save((error, userSaved) => {
      if (error) {
        return resp.status(400).json({
          ok: false,
          message: 'User not updated!!!',
          errors: error
        })
      }

      resp.status(200).json({
        ok: true,
        user: userSaved
      })
    })

  })
}

userController.deleteUser = (req, resp) => {

  const id = req.params.id;


  User.findByIdAndDelete(id, (error, userDeleted) => {

    if (!userDeleted) {
      return resp.status(400).json({
        ok: false,
        message: `User not deleted by id: ${id}`,
        errors: { message: 'User not deleted by id' }
      })
    }

    if (error) {
      return resp.status(500).json({
        ok: false,
        message: 'User not deleted!!!',
        errors: error
      })
    }


    resp.status(200).json({
      ok: true,
      user: userDeleted
    })
  })

}

module.exports = userController;

