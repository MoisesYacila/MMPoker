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

//This gets a list of games for a player with a given id
//The id here is a player id
app.get('/games/:id', async (req, res) => {
    const { id } = req.params;
    //Mongoose way of finding all the games that a player has played
    //Checks if the player we are looking for is in the game
    const games = await Game.find({ "leaderboard.player": id })
    res.send(games);
})

//The id here is a game id
//Gets one specific game for show
app.get('/games/game/:id', async (req, res) => {
    const game = await Game.findById(req.params.id);
    res.send(game);
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
                player: player.player,
                //Mongoose automatically converts 'yes' and 'no' string to true and false values
                itm: player.itm,
                otb: player.otb,
                profit: parseInt(player.profit),
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
        if (player.player !== '-1') {
            //Mongoose syntax, increase games played by 1
            await Player.findByIdAndUpdate(player.player, { $inc: { gamesPlayed: +1 } });

            //Increase one to stats if player made it to the money or was on the bubble
            if (player.itm === 'yes')
                await Player.findByIdAndUpdate(player.player, { $inc: { itmFinishes: +1 } });
            if (player.otb === 'yes')
                await Player.findByIdAndUpdate(player.player, { $inc: { onTheBubble: +1 } });

            //index 0 means first row, this player has won
            if (i === 0)
                await Player.findByIdAndUpdate(player.player, { $inc: { wins: +1 } });

            //Update earnings bounties, rebuys and add ons for everyone
            await Player.findByIdAndUpdate(player.player, {
                $inc: {
                    winnings: +player.profit,
                    bounties: +player.bounties,
                    rebuys: +player.rebuys,
                    addOns: +player.addOns
                }
            });
        }

    })
    res.send("Received patch request");
})

//Patch request to handle the edited games and update the stats for the players involved
app.patch('/players/edit/:id', async (req, res) => {
    const { oldData, newData } = req.body;
    const { id } = req.params;

    //Use two sets to check if we need to change the gamesPlayed stat for every player involved in the edit
    let oldSet = new Set();
    let newSet = new Set();
    oldData.leaderboard.forEach((player) => { oldSet.add(player.player) });
    newData.forEach((player) => { newSet.add(player.player) });

    //Use map for O(1) lookups
    const oldMap = new Map();
    oldData.leaderboard.forEach((player) => {
        oldMap.set(player.player, player);
    });

    // Check if we added or removed a player, and update the global stats for that player
    Array.from(newSet, async (player, i) => {
        // Sets should never be empty, so this should work
        if (i == 0) {
            // Will check against the first value of oldSet, if we have a different winner, update data in DB
            const oldWinner = oldSet.values().next().value;
            if (player != oldWinner) {
                await Player.findByIdAndUpdate(player, { $inc: { wins: +1 } });
                await Player.findByIdAndUpdate(oldWinner, { $inc: { wins: -1 } });
            }
        }

        // We added a new player to the game
        if (!oldSet.has(player)) {
            // Mongoose syntax to increase stats
            await Player.findByIdAndUpdate(player, { $inc: { gamesPlayed: +1 } });

            // Increase one to the stats if player made it to the money or was on the bubble
            if (newData[i].itm)
                await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: +1 } });
            if (newData[i].otb)
                await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: +1 } });

            //Update all other stats
            await Player.findByIdAndUpdate(player, {
                $inc: {
                    winnings: +newData[i].profit,
                    bounties: +newData[i].bounties,
                    rebuys: +newData[i].rebuys,
                    addOns: +newData[i].addOns
                }
            });
        }

        //This player was already in the game
        else {
            //Compare everything and update
            const currPlayerData = oldMap.get(player);

            //Update ITM and OTB if they changed. They're both booleans
            if (newData[i].itm != currPlayerData.itm) {
                if (newData[i].itm)
                    await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: +1 } });
                else
                    await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: -1 } });
            }

            if (newData[i].otb != currPlayerData.otb) {
                if (newData[i].otb)
                    await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: +1 } });
                else
                    await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: -1 } });
            }

            //If any other stat has changed update it
            if (newData[i].profit != currPlayerData.profit
                || newData[i].rebuys != currPlayerData.rebuys
                || newData[i].bounties != currPlayerData.bounties
                || newData[i].addOns != currPlayerData.addOns) {

                // Calculate the net difference between their old stat and their new stat
                const diffProfit = newData[i].profit - currPlayerData.profit;
                const diffRebuys = newData[i].rebuys - currPlayerData.rebuys;
                const diffBounties = newData[i].bounties - currPlayerData.bounties;
                const diffAddOns = newData[i].addOns - currPlayerData.addOns;

                // Update everything else
                await Player.findByIdAndUpdate(player, {
                    $inc: {
                        winnings: +diffProfit,
                        bounties: +diffBounties,
                        rebuys: +diffRebuys,
                        addOns: +diffAddOns
                    }
                });
            }
        }
    });

    //If a player is deleted from the game, delete stats for this game on their profile
    oldSet.forEach(async (player, i) => {
        if (!newSet.has(player)) {
            const currPlayerData = oldMap.get(player);

            //Mongoose syntax, decrease games played by 1
            //Already decreased wins if it was needed
            await Player.findByIdAndUpdate(player, { $inc: { gamesPlayed: -1 } });

            //Decrease one to the stats if player made it to the money or was on the bubble
            if (currPlayerData.itm)
                await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: -1 } });

            if (currPlayerData.otb)
                await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: -1 } });

            //Update earnings bounties, rebuys and add ons
            await Player.findByIdAndUpdate(player, {
                $inc: {
                    winnings: -currPlayerData.profit,
                    bounties: -currPlayerData.bounties,
                    rebuys: -currPlayerData.rebuys,
                    addOns: -currPlayerData.addOns
                }
            });
        }
    });

    //Update leaderboard
    await Game.findByIdAndUpdate(id, { leaderboard: newData, numPlayers: newData.length });

    res.send('Received EDIT patch request');
})

app.listen(8080, () => {
    console.log("Server listening on port 8080");
})