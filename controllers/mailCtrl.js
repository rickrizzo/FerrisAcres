const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'aol',
  auth: {
    user: 'russorob@aol.com',
    pass: '5Je_t2+X'
  }
});

const mailOptions = {
  from: 'russorob@aol.com',
  to: 'rrusso44@icloud.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

module.exports = {
  sendMail: function(address, content) {
    return transporter.sendMail({
      from: 'russorob@aol.com',
      to: address,
      subject: 'Ferris Acres Creamery - Order Confirmation',
      text: content
    }, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
