const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use('/', urlRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server running at http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
