const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

//Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/mmpoker')
    .then(() => {
        console.log("Database connected.")
    })
    .catch(err => {
        console.log("Database connection error.")
        console.log(err)
    });

app.use(cors());

app.get('/', (req, res) => {
    res.send('MoisoGenio');
})

app.listen(8080, () => {
    console.log("Server listening on port 8080");
})