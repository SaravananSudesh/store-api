const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../auth/user.model.js')
const Products = require('./products.model.js')

// Add Product
const addProduct = async(req, res) => {
    try {

        // Get User
        const token = req.header('authorization')
        const verified = jwt.verify(token, config.secret)
        const emailExist = await Users.findOne({ email: verified.email })
        if(!emailExist) return res.status(403).send({
            success : false,
            message : 'no-user-found'
        })

        // Get Logs
        let logs = emailExist.logs

        const name = req.body.name
        const price = Number(req.body.price)
        const type = req.body.type
        const inStock = true

        // Creating Product
        const product = new Products({
            name: name,
            price: price,
            type: type,
            inStock: inStock
        })
        await product.save()

        // Update Logs
        const log = {
            message: `${name}`,
            kind: `Added`,
            date: Date.now
        }
        logs.push(log)
        await Users.findOneAndUpdate({ email: verified.email }, { logs: logs })

        return res.status(200).json({
            success : true,
            message: `product-add-success`,
            id: product._id
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Upload Image
const uploadProductImage = async(req, res) => {
    try {

        const id = req.params['id']
        const img = req.file.buffer
        
        // Update Image
        const update = await Products.updateOne({ _id: id }, {
            img: img
        })

        if(update.matchedCount === 0) return res.status(403).json({
            success : false,
            message: 'id-not-found'
        })

        return res.status(200).json({
            success : true,
            message: 'img-upload-success'
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// View Product
const viewProduct = async(req, res) => {
    try {

        const id = req.params['id']

        // Find Product
        const product = await Products.findOne({ _id: id })

        if(!product) return res.status(403).json({
            success : false,
            message: 'id-not-found'
        })

        const name = product.name
        const price = product.price
        const type = product.type
        const inStock = product.inStock
        const img = product.img.toJSON()

        return res.status(200).json({
            success : true,
            product: {
                name: name,
                price: price,
                type: type,
                inStock: inStock,
                img: img
            }
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Get Product Count
const getProductsCount = async(req, res) => {
    try {

        const count = await Products.estimatedDocumentCount()

        return res.status(200).json({
            success : true,
            count: count
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Get Product Count inStock
const getProductsInStock = async(req, res) => {
    try {

        const inStock = await Products.find({ inStock: true }).estimatedDocumentCount()

        return res.status(200).json({
            success : true,
            inStock: inStock
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// View All Products
const viewAllProducts = async(req, res) =>{
    try {

        return res.status(200).json({
            success : true,
            product: req.query.search
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Edit Product
const editProduct = async(req, res) => {
    try {

        const id = req.params['id']

        // Find Product
        const product = await Products.findOne({ _id: id })

        if(!product) return res.status(403).json({
            success : false,
            message: 'id-not-found'
        })

        const price = req.body.price || product.price
        const type = req.body.type || product.type
        const inStock = req.body.inStock || product.inStock

        // Update Image
        await Products.updateOne({ _id: id }, {
            price: price,
            type: type,
            inStock: inStock
        })

        return res.status(200).json({
            success : true,
            message: 'product-update-success'
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

// Delete Product
const deleteProduct = async(req, res) => {
    try {

        const id = req.params['id']

        // Delete Product
        const deleted = await Products.deleteOne({ _id: id })

        if(deleted.deletedCount === 0) return res.status(403).json({
            success : false,
            message: 'id-not-deleted'
        })

        return res.status(200).json({
            success : true,
            message: 'product-delete-success'
        })
        
    } catch (error) {
        return res.status(403).json({
            success : false,
            message: error
        })
    }
}

module.exports = {
    addProduct,
    uploadProductImage,
    viewProduct, 
    viewAllProducts,
    getProductsCount, 
    getProductsInStock, 
    editProduct, 
    deleteProduct 
}