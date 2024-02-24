const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const Users = require('./user.model.js')
const mailModule = require('../mail/mail.module.js')

// Register
const registerUser = async(req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password
        const roles = ['user']
        const enabled = false
        const verificationCode = Math.floor(1000 + Math.random() * 9000)
        const name = req.body.name
        const logs = []

        // Check If Already Exists
        const emailExist = await Users.findOne({ email: email })
        if (emailExist && emailExist.enabled === true) return res.status(403).send({
            success : false,
            message : 'email-exists'
        })

        if (emailExist && emailExist.enabled === false){
            await Users.findOneAndDelete({ email: email })
        }

         // Password Hashing
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        // Creating User
        const user = new Users({
            email: email,
            password: hashPassword,
            roles: roles,
            enabled: enabled,
            verificationCode: verificationCode,
            name: name,
            logs: logs
        })
        await user.save()

        // Send Verification Mail
        mailModule.sendVerificationMail(email, verificationCode, name)

        return res.status(200).json({
            success : true,
            message: `Account(${name}) created Successfully`
        })

    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Verify
const verifyEmail = async(req, res) => {
    try {
        
        const email = req.body.email
        const verificationCode = req.body.verificationCode

        // Check If Already Exists
        const emailExist = await Users.findOne({ email: email })

        if(emailExist){
            if(emailExist.verificationCode === String(verificationCode)){
                await Users.updateOne({ email: email }, {
                    verificationCode: '',
                    enabled: true
                })
                return res.status(200).json({
                    success : true,
                    message: 'verification-success'
                })
            }
            else{
                return res.status(403).json({
                    success : false,
                    message: 'verification-failed'
                })
            }
        }

    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Signin
const SignInUser = async(req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password

        // Check If Mail Exists
        const emailExist = await Users.findOne({ email: email })
        if(!emailExist) return res.status(403).send({
            success : false,
            message : 'incorrect-email'
        })

        // Check If Password Correct
        const isPasswordValid = await bcrypt.compare(password, emailExist.password)
        if(!isPasswordValid) return res.status(403).send({
            success : false,
            message : 'incorrect-password'
        })

        // Create Token
        const token = jwt.sign({ email: emailExist.email }, config.secret)

        return res.header('authorization', token).send({
            message : 'success',
            token : token,
            email: emailExist.email,
            name: emailExist.name
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Get User
const getUser = async(req, res) => {
    try {

        const token = req.header('authorization')
        const verified = jwt.verify(token, config.secret)
        const email = verified.email

        // Check If Mail Exists
        const emailExist = await Users.findOne({ email: email })
        if(!emailExist) return res.status(403).send({
            success : false,
            message : 'no-user-found'
        })

        return res.send({
            message : 'success',
            email: emailExist.email,
            name: emailExist.name
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Get Logs
const getLogs = async(req, res) => {
    try {

        const token = req.header('authorization')
        const verified = jwt.verify(token, config.secret)
        const email = verified.email

        // Check If Mail Exists
        const emailExist = await Users.findOne({ email: email })
        if(!emailExist) return res.status(403).send({
            success : false,
            message : 'no-user-found'
        })

        let logs = []
        for(let i=0; i<emailExist.logs.length; i++){
            logs.push({
                message: emailExist.logs[i].message,
                kind: emailExist.logs[i].kind,
                date: emailExist.logs[i].date
            })
        }

        return res.send({
            message : 'success',
            logs: logs
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

module.exports = { registerUser, verifyEmail, SignInUser, getUser, getLogs }