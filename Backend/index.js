const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const dbConnect = require('./utils/dbConnect')

//folders
const userRoutes = require('./routes/user')

//activating
const app = express()


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//routes
app.use('/api/user', userRoutes)




app.listen(port, async () => {
    await dbConnect()
    console.log('mongodb connected')
    console.log(`server on port ${port}`)
})