const router = require('express').Router()
const multer = require('multer')

const upload = multer()

const auth = require('../auth/user.auth.js')

// Controllers Import
const productController = require('./products.controller.js')

// Routes
router.get('/', productController.viewAllProducts)
router.get('/count', productController.getProductsCount)
router.get('/count/stock', productController.getProductsInStock)
router.post('/', auth.checkAdmin, productController.addProduct)
router.post('/:id/img', upload.single('img'), auth.checkAdmin, productController.uploadProductImage)
router.get('/:id', auth.checkUser, productController.viewProduct)
router.put('/:id', auth.checkAdmin, productController.editProduct)
router.delete('/:id', auth.checkAdmin, productController.deleteProduct)

module.exports = router