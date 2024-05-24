const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Player = require('./models/player');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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
app.use(methodOverride('_method'));


//Handling requests
app.get('/players', async (req, res) => {
    const players = await Player.find({});
    res.send(players);
})

app.get('/players/:id', async (req, res) => {
    const player = await Player.findById(req.params.id);
    res.send(player);
})

app.delete('/players/:id', async (req, res) => {
    const player = await Player.findByIdAndDelete(req.params.id);
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

// Patch request handles the new games, and it updates the stats for all the players involved
app.patch('/players', async (req, res) => {
    console.log(req.body)
    const { data } = req.body;

    data.forEach(async (player, i) => {
        if (player.id !== '-1') {
            //Mongoose syntax, increase games played by 1
            await Player.findByIdAndUpdate(player.id, { $inc: { gamesPlayed: +1 } });

            //Increase one to stats if player made it to the money or was on the bubble
            if (player.itm === 'yes')
                await Player.findByIdAndUpdate(player.id, { $inc: { itmFinishes: +1 } });
            if (player.otb === 'yes')
                await Player.findByIdAndUpdate(player.id, { $inc: { onTheBubble: +1 } });

            //index 0 means first row, this player has won
            if (i === 0)
                await Player.findByIdAndUpdate(player.id, { $inc: { wins: +1 } });

            //Update earnings bounties, rebuys and add ons for everyone
            await Player.findByIdAndUpdate(player.id, {
                $inc: {
                    winnings: +player.earnings,
                    bounties: +player.bounties,
                    rebuys: +player.rebuys,
                    addOns: +player.addOns
                }
            });
        }

    })
    res.send("Received patch request");
})

app.listen(8080, () => {
    console.log("Server listening on port 8080");
})