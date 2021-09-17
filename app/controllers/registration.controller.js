const Registration = require('../models/registration.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
  // Validate request
  // Create a Note
  const registration = new Registration({
      username: req.body.username, 
      password: req.body.password,
      role: 'member'
  });

  // Save Note in the database
  registration.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating new user."
      });
  });
};

// Retrieve and return all registrations from the database.
exports.findAll = (req, res) => {
  Registration.find()
  .then(registration => {
      res.send(registration);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving registrations."
      });
  });
};

// Find a single registration with a userId
// Find a single registration with a userId
exports.findOne = (req, res) => {
  Registration.findById(req.params.userId)
  .then(registration => {
      if(!registration) {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });            
      }
      res.send(registration);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });                
      }
      return res.status(500).send({
          message: "Error retrieving registration with id " + req.params.userId
      });
  });
};

// Update a registration identified by the userId in the request
exports.update = (req, res) => {
  // Validate Request
  if(!req.body.username || !req.body.password) {
      return res.status(400).send({
          message: "Username/password can not be empty"
      });
  }

  // Find registration and update it with the request body
  Registration.findByIdAndUpdate(req.params.userId, {
      username: req.body.username,
      password: req.body.password
  }, {new: true})
  .then(registration => {
      if(!registration) {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });
      }
      res.send(registration);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });                
      }
      return res.status(500).send({
          message: "Error updating user data with id " + req.params.userId
      });
  });
};

// Delete a registration with the specified userId in the request
exports.delete = (req, res) => {
  Registration.findByIdAndRemove(req.params.userId)
  .then(registration => {
      if(!registration) {
          return res.status(404).send({
              message: "Registration not found with id " + req.params.userId
          });
      }
      res.send({message: "Note deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });                
      }
      return res.status(500).send({
          message: "Could not delete registration with id " + req.params.userId
      });
  });
};