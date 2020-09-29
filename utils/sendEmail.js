const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const  sendEmail=async(options)=> {
   

   
    const transporter = nodemailer.createTransport({
        host: process.env.STMP_HOST,
        port: process.env.STMP_PORT,
        secure: false, 
        auth: {
            user: process.env.STMP_EMAIL ,
            pass: process.env.STMP_PASSWORD, 
        },
    });

    // send mail with defined transport object
    const message = ({
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subjext,
        text: options.message,
     
    });

   const  info=await transporter.sendMail(message)

    console.log("Message sent: %s", info.messageId);
   
}


module.exports=sendEmail