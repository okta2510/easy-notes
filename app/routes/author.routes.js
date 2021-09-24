const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'eyJhbGciOiJIUz';


const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

module.exports = (app) => {
  const author = require('../controllers/author.controller.js');
  const registrations = require('../controllers/registration.controller.js');

  // Create a new Note
  app.post('/author', author.create);

  // Retrieve all Notes
  app.get('/author', author.findAll);
}