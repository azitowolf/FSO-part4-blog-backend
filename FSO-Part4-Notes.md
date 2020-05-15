# Part 4

a Structure of backend application, introduction to testing
b Testing the backend
c User administration
d Token authentication

## Parts a+ b : Refactoring a node.js application backend

* Application running in a single file (little refactoring)
    * config package.json + add all npm modules required for app
        * Essential for dev: 
            * nodemon or other live reloading server (nodemon must be run through node scripts)
            * eslint for logging
    * mongoDB created if needed connection string configured correctly for DB
    * **TEST : All routes and corresponding reactions on the server and in DB** 
* Separating config + configuring environments
    * .env variables into seperate
* Separate Router into "controller" module
    * use express.Router to export this module
* Separate Mongoose or model data into separate module
    * validation for the models (npm install --save mongoose-unique-validator)
* Create utils modules
    * middleware for req handling
    * logger for handling logs
    * config for .env variable setting
* App component separate from index.js.
    * final refactor step. 
    * Index.js just initiates express app, starts server on port
    * const app = require('./app') // the actual Express application
    * const server = http.createServer(app)
* Add Function Tests
    * use jest (https://jestjs.io/docs/en/api.html)
    * test.[filename].js
    * install with NPM, add to eslint config as well as package.json scripts
* Add API Tests
    * Configure DB to connect to development version for testing
        * Install 'cross-env' npm 
        * Add new MONGODB_URI to config file
        * Seed DB with data for testing
        * Separate seeding, fake ID creation into seperate helper module
* Models connected through linking IDs
    * reference ids created in models
    ```javascript
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
    ```
    * passwords hashed appropriately (npm install bcrypt --save)
    * POST routes updated to update all associated objects on save
    * GET routes updated to populate associated data in leiu of relational DB (mongo specific)
    ```javascript
    const users = await User.find({}).populate('notes', { content: 1, date: 1 })
    ```
