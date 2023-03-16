import nodeMailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import dotenv from 'dotenv';
import { htmlTemp } from '../template/emailHTML.js';

dotenv.config();

const transporter = nodeMailer.createTransport(
  smtpTransport({
    host: 'smtp.office365.com',
    auth: {
      user: process.env.WEBEMAIL,
      pass: process.env.EMAILPW,
    },
    port: 587,
  })
);

export function sendEmail(email, code) {
  console.log('Called');
  var mailOptions = {
    from: process.env.WEBEMAIL,
    to: email,
    subject: 'Mutanafeson Verification Code',
    text: 'That was easy!',
    html: htmlTemp(code),
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      // console.log("Email sent: " + info.response);
    }
  });
}
