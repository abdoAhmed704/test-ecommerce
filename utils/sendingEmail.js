const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS,
        },
    });
    const info = await transporter.sendMail({
      from: '"Ecommify" <abdoahmedsayed704@gmail.com>', // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      html: options.html, // plain text body
    });
}