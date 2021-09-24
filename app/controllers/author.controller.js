const Author = require('../models/author.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
  // Validate request
  const { name, age, books} = req.body;
  console.log(req.body)
  if(!req.body) {
      return res.status(400).send({
          message: "Note content can not be empty"
      });
  }

  if(!name || !age || !books) {
      return res.status(400).send({
          message: "Invalid input formatted"
      });
  }

  // Create a Note
  const author = new Author({
      name, age, books
  });

  // Save Note in the database
  author.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the Note."
      });
  });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
  Author.find()
  .then(author => {
      res.send(author);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving notes."
      });
  });
};