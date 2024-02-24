const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 32
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        required: true
    },
    img: {
        data: Buffer
    }
})

module.exports = mongoose.model('products', productSchema)