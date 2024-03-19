const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Player = require('./models/player');
const bodyParser = require('body-parser');

//Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/mmpoker')
    .then(() => {
        console.log("Database connected.")
    })
    .catch(err => {
        console.log("Database connection error.")
        console.log(err)
    });

//Check documentation if there are any questions with these
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/players', async (req, res) => {
    const players = await Player.find({});
    res.send(players);
})

app.get('/players/:id', async (req, res) => {
    const player = await Player.findById(req.params.id);
    res.send(player);
})

//Post request handling adding players to DB
app.post('/players', async (req, res) => {
    console.log(req.body)
    //Destructure from req.body and add player with all the info to DB
    const { name, country } = req.body;
    const player = new Player({
        name: name, nationality: country, gamesPlayed: 0, wins: 0,
        itmFinishes: 0, onTheBubble: 0, bounties: 0,
        rebuys: 0, addOns: 0, winnings: 0
    });
    await player.save();


    //Check if this is necessary.
    //e.preventDefault() on the form submit handler avoids getting to this page
    res.send(req.body);
})

app.listen(8080, () => {
    console.log("Server listening on port 8080");
})