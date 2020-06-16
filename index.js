const express = require('express');
const app = express();
require('dotenv').config({path: __dirname + './.env'});
require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();

require('./middleware/ensureAuthorization');
require('./models/student');
require('./models/user');