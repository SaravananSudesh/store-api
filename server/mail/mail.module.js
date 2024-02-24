const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: true,
    connectionTimeout: 10000,
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    }
})

async function sendVerificationMail(receiver, verification, name){
    const mailOptions = {
        from: config.emailUser,
        to: receiver,
        subject: 'Email Verification - Store',
        html: `
            <h1>Store</h1>
            <h3>Hi ${name},</h3>
            <p>Verify Your Email </p><p><b>${verification}</b></p>
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Email failed for ' + receiver)
        } else {
          console.log('Email sent to ' + receiver)
        }
      })
}

module.exports = { sendVerificationMail }