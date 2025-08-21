import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or any other service
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  await transporter.sendMail({
    from: '"Your App" <your-email@gmail.com>',
    to,
    subject,
    text,
  });
};

export default sendMail;
