const router = require('express').Router()

// Controllers Import
const userController = require('./user.controller.js')

// Routes
router.post('/register', userController.registerUser)
router.post('/verify', userController.verifyEmail)
router.post('/signin', userController.SignInUser)
router.get('/user', userController.getUser)
router.get('/logs', userController.getLogs)

module.exports = router