const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Player = require('./models/player');
const Game = require('./models/game');
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

//Post request to add games to DB
app.post('/games', async (req, res) => {
    //Get info from request
    const { data, numPlayers, prizePool } = req.body;

    //gameData will be part of the Game object
    const gameData = new Array(numPlayers);
    const currDate = new Date();

    //The data array is an array of objects with all the info about each player's stats in this game
    //Revise this later: No need to do all of this, when we can just add the data array directly to Game object
    //Input validation required tho
    data.forEach((player, i) => {
        if (player._id !== '-1') {
            const playerData = {
                player: player._id,
                itm: player.itm,
                otb: player.otb,
                profit: parseInt(player.earnings),
                rebuys: player.rebuys,
                bounties: player.bounties,
                addOns: player.addOns
            }
            gameData[i] = playerData;
        }

    })

    //Create a new game and add all the information
    const newGame = new Game({
        date: new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()),
        numPlayers: numPlayers,
        prizePool: prizePool,
        leaderboard: gameData
    })

    //Save to DB
    await newGame.save();
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