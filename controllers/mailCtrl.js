const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'aol',
  auth: {
    user: 'russorob@aol.com',
    pass: '5Je_t2+X'
  }
});

module.exports = {
  sendMail: function(address, content) {
    return transporter.sendMail({
      from: 'russorob@aol.com',
      to: address,
      subject: '🐮🍦 Order Confirmation',
      html: content
    }, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
