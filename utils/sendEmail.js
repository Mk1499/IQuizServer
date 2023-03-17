import nodeMailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import dotenv from 'dotenv';
import { htmlTemp } from '../template/emailHTML.js';
import emailValidator from 'deep-email-validator';

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

export async function sendEmail(email, code) {
  console.log('Called');
  const mailOptions = {
    from: process.env.WEBEMAIL,
    to: email,
    subject: 'Mutanafeson Verification Code',
    text: 'That was easy!',
    html: htmlTemp(code),
  };
  const validation = await emailValidator.validate({
    email,
    validateSMTP: false,
  });
  console.log('Validation : ', validation);
  if (validation?.valid) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
      }
    });
  }
}
