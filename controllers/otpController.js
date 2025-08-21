import nodemailer from "nodemailer";
import Otp from "../models/Otp.js";
export const sendOtpGmail=async(req,res)=>{
    const {email}=req.body;
     console.log("📨 OTP request received for:", email); 
    if(!email.endsWith("@gmail.com")){
        return res.status(400).json({message:"only gamil allowed"});
    }
    const otp=Math.floor(100000 +Math.random()*900000).toString();
    try{
        // save otp to db
        await Otp.create({email,otp});

        // send email
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.MAIL_USER,
                 pass: process.env.MAIL_PASS,
            },
        });
        const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    };
 await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
     console.error("❌ Failed to send OTP:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err });
  }
};
export const verifyOtp = async (req, res) => {
  const { email, enteredOtp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp: enteredOtp });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // If found, delete it immediately
  //  await Otp.deleteOne({ _id: record._id });
 res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error });

    }
}
