const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();

require('./middleware/ensureAuthorization');
require('./models/student');
require('./models/user');