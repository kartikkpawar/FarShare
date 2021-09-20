const nodemailer = require("nodemailer");

const sendMail = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      authMethod: "PLAIN",
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: `farShare <${from}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
  console.log(info);
};

module.exports = sendMail;
