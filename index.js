const express = require('express');
const app = express();

require('./startup/db')();
require('./startup/logging')();


exports.ensureAuthorization = require('./middleware/ensureAuthorization');
exports.student = require('./models/student');
exports.user = require('./models/user');
