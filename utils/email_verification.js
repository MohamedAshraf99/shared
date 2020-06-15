const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


function sendEmail(mailOptions){
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'nodetest66@gmail.com',
      pass: 'Apozeed210'
  }
  });
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      console.log(error);
      } else {
      console.log('Email sent: ' + info.response);
      }
  });
}

function mailOption(email , activationCode ,  subject , header , content) { 
  return {
    from: 'nodetest66@gmail.com',
    to: email,
    subject: subject ,
    html: `<div>
    <h1>${header}<hi><br/>
    <p>${content}</p>
   <p>
     ${activationCode}
   </p>
    </div>
  `
  };
}

async function getHashPassword(pass) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
  }



function randomString(length, chars) {
var mask = '';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
return result;
}
exports.sendEmail = sendEmail;
exports.mailOption = mailOption;
exports.randomString = randomString ;   
exports.getHashPassword =getHashPassword ;
