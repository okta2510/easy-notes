const Registration = require('../models/registration.model.js');
const bcrypt = require('bcrypt');
const users = [
  {
      username: 'admin',
      password: 'admin',
      role: 'admin'
  }, {
      username: 'anna',
      password: 'password123member',
      role: 'member'
  }
];

const checkUserExisted = async (req, res, next) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  Registration.find()
  .then(registration => {
      const user = registration.find(u => { return u.username === username || u.password === hashedPassword });
      if(!user) {
        next()
      } else {
        res.status(502).send({message: "user already exist"})
      }
      
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving registrations."
      });
  });
}

module.exports = (app) => {
  const registrations = require('../controllers/registration.controller.js');
  const accessTokenSecret = 'eyJhbGciOiJIUz';
  const config = {
    "secret": "eyJhbGciOiJIUz",
    "refreshTokenSecret": "eyJhbGciOiJIAi",
    "port": 3000,
    "tokenLife": 900,
    "refreshTokenLife": 86400
  }
  app.get('/user', registrations.findAll);

  // Create a new user
  app.post('/user/registration', registrations.create);
  
  app.post('/user/registration/encrypt', [checkUserExisted], async (req, res) => {
    try {
      const salt = await bcrypt.genSalt()
      // by default by 10
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const user = {username: req.body.username, password: hashedPassword, role: 'member'}
      const newReq = {...req, ...{body: user}};
      registrations.create({body: user}, res)
    } catch(err) {
      console.log(err)
      res.status(500).send()
    }
  });

  app.post('/login', (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;
    var jwt = require("jsonwebtoken");
    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });
    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret, { expiresIn: config.tokenLife});

        res.json({
            accessToken,
            expired: config.tokenLife,
            role: user.role
        });
    } else {
        res.send('Username or password incorrect');
    }
  });

}