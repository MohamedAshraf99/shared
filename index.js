const express = require('express');
const app = express();

require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();


exports.ensureAuthorization = require('./middleware/ensureAuthorization');
exports.student = require('./models/student');
exports.user = require('./models/user');
