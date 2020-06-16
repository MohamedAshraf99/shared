const jwt = require('jsonwebtoken');
const {User} = require('../models/user');


module.exports = async function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
    const decoded = jwt.verify(token,'jwtPrivateKey');
    req.user = decoded; 

      if (req.user._id) {
        let usr = await User.findById(req.user._id);
        if (!usr._id)
          return res.status(401).send('Access denied. User not exist.');
      }
    
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token');
  }
}