const formData = require("express-form-data");
const os = require("os");
// above : convert json to form data
const express = require('express');
const bodyParser = require('body-parser');
// below : Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

// create express app
const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
  };
app.use(formData.parse(options));  


mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to expreess_with_mongodb application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require Notes routes
require('./app/routes/note.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/author.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});