const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'eyJhbGciOiJIUz';
const books = [
  {
      "author": "Chinua Achebe",
      "country": "Nigeria",
      "language": "English",
      "pages": 209,
      "title": "Things Fall Apart",
      "year": 1958
  },
  {
      "author": "Hans Christian Andersen",
      "country": "Denmark",
      "language": "Danish",
      "pages": 784,
      "title": "Fairy tales",
      "year": 1836
  },
  {
      "author": "Dante Alighieri",
      "country": "Italy",
      "language": "Italian",
      "pages": 928,
      "title": "The Divine Comedy",
      "year": 1315
  },
];


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
  const notes = require('../controllers/note.controller.js');
  const registrations = require('../controllers/registration.controller.js');

  // Create a new Note
  app.post('/notes', notes.create);

  // Retrieve all Notes
  app.get('/notes', notes.findAll);

  // Retrieve a single Note with noteId
  app.get('/notes/:noteId', notes.findOne);

  // Update a Note with noteId
  app.put('/notes/:noteId', notes.update);

  // Delete a Note with noteId
  app.delete('/notes/:noteId', notes.delete);

  app.get('/books',authenticateJWT, (req, res) => {
    res.json(books);
  });
}