
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

  app.post('/login', (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;
    console.log(req.body)
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