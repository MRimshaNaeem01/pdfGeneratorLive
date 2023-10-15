// server.js
const express = require('express');
const mongoose = require('mongoose');

const dotenv = require("dotenv");
const cors = require('cors');


dotenv.config();
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', 
  };
  
  app.use(cors(corsOptions));
app.use(express.json());


mongoose.connect(process.env.MONGOURL)
    .then(() => console.log("DB connection successfully!"))
    
    .catch((err) => {
        console.log(err);
    });

const apiRoute = require('./routes/api');
app.use('/api', apiRoute);

if(process.env.API_PORT){
  app.listen(process.env.API_PORT)
}

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports = app;