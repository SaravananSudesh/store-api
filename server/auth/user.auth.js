const jwt = require("jsonwebtoken")

const Users = require('./user.model.js')

async function checkAdmin (req, res, next){
    try {

        const token = req.header('authorization')
        if (!token) return res.status(403).json({
            success : false,
            message: 'access-denied'
        })
        const verified = jwt.verify(token, config.secret)
        const email = verified.email
        const user = await Users.findOne({ email: email })
        const isAdmin = user.roles.includes('admin')

        if (isAdmin) next()
        else return res.status(403).json({
            success : false,
            message: 'access-unauthorized'
        })

    } catch (error) {
        return res.status(403).json({
            success : false,
            message: 'token-invalid'
        })
    }
}

async function checkUser (req, res, next){
    try {

        const token = req.header('authorization')
        if (!token) return res.status(403).json({
            success : false,
            message: 'access-denied'
        })
        const verified = jwt.verify(token, config.secret)
        const email = verified.email
        const user = await Users.findOne({ email: email })
        const isAdmin = user.roles.includes('user')

        if (isAdmin) next()
        else return res.status(403).json({
            success : false,
            message: 'access-unauthorized'
        })

    } catch (error) {
        return res.status(403).json({
            success : false,
            message: 'token-invalid'
        })
    }
}

module.exports = { checkAdmin, checkUser }