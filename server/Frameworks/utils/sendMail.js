const nodemailer = require("nodemailer");
require('dotenv').config();

const sendMail =async (email,Otp)=>{
    
    console.log(email);
    console.log(Otp);

    const EMAIL = process.env.EMAIL;
    const PASSWORD = process.env.PASSWORD;

    //connect with smtp 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    const details ={
          from: '"HINGED " hinged.wedding@gmail.com', // sender address
          to: email, // list of receivers
          subject: "OTP Verification", // Subject line
          text: `Your Otp verification code is ${Otp}`, // plain text body
        }
    
        // send mail with defined transport object
        await transporter.sendMail(details).then((res)=>{
        console.log("Message sent successfully with id:%s",res.messageId);
            
        }).catch((err)=>{
            console.log("Error Found",err)
           
        })
        return true

}

module.exports = sendMail;