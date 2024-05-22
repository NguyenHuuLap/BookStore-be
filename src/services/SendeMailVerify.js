const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ACCOUNT, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

// Hàm gửi email OTP và trả về OTP đã tạo
const sendMailOTP = async (email) => {
  const otp = generateOtp(); // Tạo mã OTP

  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT, // Địa chỉ email gửi
      to: email, // Địa chỉ email nhận
      subject: "Xác thực tài khoản", // Chủ đề email
      html: `<div><b>Xác thực tài khoản</b></div> Mã OTP của bạn là: ${otp}`,
    });
    console.log('Email đã được gửi:', info.response);
    return { otp, info: info.response }; // Return both OTP and email sending info
  } catch (error) {
    console.log('Gửi email thất bại:', error);
    return false;
  }
};

// Hàm tạo mã OTP
const generateOtp = () => {
  // const randomNumber = Math.floor(Math.random() * 10000);
  // const otp = randomNumber.toString().padStart(4, '0');
  const otp = 1234
  return otp;
};

module.exports = {
  sendMailOTP
};
