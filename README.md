## Refactoring a backend node.js application

### Checklist

* Application running in a single file (little refactoring)
    * config package.json + add all npm modules required for app
        * Essential for dev: 
            * nodemon or other live reloading server (nodemon must be run through node scripts)
            * eslint for logging
    * mongoDB created if needed 
    * mongoDB connection configured correctly
    * result: working package.json, single index file with 
* Separating config + configuring environments
    * .env variables into seperate
* Separate Router into module
    * use express.Router to export this module
* Separate Mongoose or model data into separate module
* Create utils modules
    * middleware for req handling
    * logger for handling logs
    * config for .env variable setting
* App component separate from index.js.
    * final refactor step. 
    * Index.js just initiates express app, starts server on port
    * const app = require('./app') // the actual Express application
 