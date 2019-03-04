const User = require('../models/User')
const bcrypt = require('bcryptjs')
const auth = require('../auth')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = app => {
  // Register User
  app.post('/register', (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      password
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash password
        user.password = hash;
        // Save User
        try {
          const newUser = await user.save()
          res.sendStatus(201)
          next()
        } catch(err) {
          console.log(err)
        }
      })
    })
  })
  // Auth user
  app.post('/auth', async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // Authenticate User
      const user = await auth.authenticate(email, password);
      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m'
      });

      const { iat, exp } = jwt.decode(token);
      // Respond with token
      res.send({iat, exp, token });
      next();
    } catch(err) {
      // User unauthorized
      return next(new Error('Authentication Failed'))
    }
  })
  // Create User
  app.post('/users', async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(console.log('Invalid content type JSON is expected'))
    }

    const { firstName, lastName, email, password } = req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    try {
      const newUser = await user.save()
      res.sendStatus(201)
      next()
    } catch(err) {
      return next( console.log(err))
    }
  })
  // Get Users
  app.get('/users', auth.isAuthorized, async (req, res, next) => {
    try {
      const users = await User.find({});
      res.send(users);
      next()
    } catch(err) {
      console.log(err)
    }
  });
  // Get User
  app.get('/user/:id', async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
      next()
    } catch(err) {
      console.log(err)
    }
  });
  // Update User
  app.put('/user/:id', async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(console.log('Invalid content type JSON is expected'))
    }

    try {
      const user = await User.findOneAndUpdate({ _id: req.params.id}, req.body);
      res.sendStatus(201)
      next()
    } catch(err) {
      return next( console.log(err))
    }
  })
  // Delete User
  app.delete('/user/:id', async (req, res, next) => {
    try {
      const user = await User.findOneAndDelete( { _id: req.params.id})
      res.sendStatus(204)
      next()
    } catch(err) {
      console.log(err)
    }
  });

}
