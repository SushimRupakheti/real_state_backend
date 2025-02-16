//Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const propertyRoute = require('./routes/propertyRoute');
const cloudinary = require('./config/cloudinaryConfig');
const rentalRoute = require('./routes/rentalPropertyRoute');

//Creating a Server
const app = express();

//Creating a port
const PORT = process.env.PORT || 5000

//Creating a middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Authentication routes
app.use('/api/auth', userRoute)

// Property routes
app.use('/api/property', propertyRoute)

//rentalProperty routes
app.use('/api/rentalProperty',rentalRoute)



//Running on PORT
app.listen(PORT, ()=>{
    console.log(`Server Running on........................ PORT ${PORT}`)
})
