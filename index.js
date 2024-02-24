const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./config.js')

app.use(express.json())
app.use(cors())

//Import routes
const userRoutes = require('./server/auth/user.routes.js')
const productRoutes = require('./server/products/products.routes.js')

//Configure routes
app.use('/users', userRoutes)
app.use('/products', productRoutes)

//Connect to database
mongoose.connect(config.database)
    .then(() => {
        console.log('Database connected!')

        app.get('/', (req, res) => {
            res.send('Store API')
        })
        
        const port = config.port || 3000
        app.listen(port, () => console.log(`Store API is running at ${port} !`))
    })
    .catch((error) => console.log('Database connection failed!', error))