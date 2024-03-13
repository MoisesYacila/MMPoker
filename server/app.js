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

//Post request handling adding players to DB
app.post('/players', async (req, res) => {
    console.log(req.body)
    const { name, country, gamesPlayed, wins, itmFinishes, bubbles, bounties,
        rebuys, addOns, winnings } = req.body;
    const player = new Player({
        name: name, nationality: country, gamesPlayed: gamesPlayed, wins: wins,
        itmFinishes: itmFinishes, onTheBubble: bubbles, bounties: bounties,
        rebuys: rebuys, addOns: addOns, winnings: winnings
    });
    await player.save();


    //Check if this is necessary.
    //e.preventDefault() on the form submit handler avoids getting to this page
    res.send(req.body);
})

app.listen(8080, () => {
    console.log("Server listening on port 8080");
})