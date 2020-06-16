const { sendEmail, mailOption, randomString,getHashPassword } = require('../utils/email_verification')
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },  
  email: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  latestActivationCode: String,
});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, email: this.email,phone:this.phone}, 'jwtPrivateKey');
  return token;
}
const User = mongoose.model('User', userSchema);

const validateRegister = (body) => {
    let schema = {
        name: Joi.string().min(5).required(),
        isActivated: Joi.bool().optional(),
        phone: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(5).required(),
    };
  
    return Joi.validate(body, schema);
  }
  
  const validateActivate = (body) => {
    let schema = {
        email: Joi.string().required(),
        code: Joi.string().required(),
    };
  
    return Joi.validate(body, schema);
  }
  const validateLogin = (body) => {
    let schema = {
        email: Joi.string().required(),
        password: Joi.string().min(5).required(),
    };
  
    return Joi.validate(body, schema);
  }

const register = async (input) => {

    let body = input.body,
        activationCode = randomString(4, "#");
  
    const { error } = validateRegister(body);
    if (error) return (error.details[0]);
  
  
    let checkUser = await User.findOne({
      $or: [
        { phone: body.phone },
        { email: body.email },
      ]
    });

     if(checkUser){
     if (checkUser.phone == body.phone) return 'Phone already registered.';
     else if (checkUser.email == body.email) return 'Email already registered.';
     }
    
    body.password = await getHashPassword(body.password);
    body.latestActivationCode = activationCode;
  
    let user = new User(body)

   return user = await user.save().then(async (user) => {
        await sendEmail(mailOption(user.email, user.latestActivationCode, "كود تفعيل التطبيق", "شكرا علي إستخدامك للتطبيق",
          "في المربع أدناه كود التفعيل الخاص بحسابك الرجاء قم بنقل هذا الكود الي صفحة تفعيل الحساب في التطبيق لتتمتع بمميزات التطبيق "));
        return user;
      })
      .catch(function (err) {
          return err;

      });
  
  }

  async function activate(input){

    const { error } = validateActivate(input.body);
    if (error) return (error.details[0]);
  
    let {email, code} = input.body
  
    let user = await User.findOne({ email });
  
    if(user._id && user.latestActivationCode == code ){
      user.isActivated = true
      await user.save()
    }
  
    const token = user.generateAuthToken();
    return ({
      ..._.omit(user.toObject(),
        ['password',
          'latestActivationCode',
          'connectionId',
          'deviceId',
          '__v'
        ]),
  
      ...{ token: token }
    });
  
  }


  async function login(input){

    const { error } = validateLogin(input.body);
    if (error) return (error.details[0]);
  
    let {email, password} = input.body
  
      if (!email || !password) return 'Invalid phone or password.';
  
      let user = await User.findOne({ email });
  
      if (!user) return 'Invalid phone or password.';
  
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return 'Invalid password.';
    
      const token = user.generateAuthToken();
    
      let result = {
        ..._.omit(user.toObject(),
          ['password',
            'latestActivationCode',
            'connectionId',
            'deviceId',       
            '__v'
          ]),
        ...{ token: token }
      };
      
      return result;
  }














module.exports = {
    User,
    register,
    activate,
    login,
  }