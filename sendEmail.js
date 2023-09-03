const nodemailer = require('nodemailer');

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other email services too
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password',
  },
});

// Email data
const mailOptions = {
  from: 'your_email@gmail.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email sent from Node.js using Nodemailer.',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email: ', error);
  } else {
    console.log('Email sent: ', info.response);
  }
});
