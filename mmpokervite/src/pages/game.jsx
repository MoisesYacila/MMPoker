import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, Button, Stack
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Game() {
    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const gameData = location.state.gameData;

    //Activate navigate
    const navigate = useNavigate();

    //date is a string in the gameData object, so we create a Date object to work with it more efficiently
    const gameDate = new Date(gameData.date);

    //We will save the names for the game standings, since they are not saved in the Game object
    const [playerName, setPlayerName] = useState([]);

    //We can get an array with all the players to use on load on the edit page
    const [allPlayers, setAllPlayers] = useState([]);

    useEffect(() => {
        //For useEffect don't use async callback, instead we can do it like this
        async function getPlayerNames() {
            let playerArr = [];
            //forEach doesn't support async operation, so we can 'for of' loop
            for (let player of gameData.leaderboard) {
                await axios.get(`http://localhost:8080/players/${player.player}`)
                    .then((res) => {
                        playerArr.push(res.data.name);
                    });
            }
            setPlayerName(playerArr);
        }

        getPlayerNames();
    }, []);

    //Doing this to use on the edit page, this way the information we need is available to use on the first render
    useEffect(() => {
        axios.get('http://localhost:8080/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setAllPlayers(playersArr);
            })
    }, []);



    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Home Game</h1>
            <h2>{`${gameDate.getFullYear()}/${gameDate.getMonth() + 1}/${gameDate.getDate()}`}</h2>
            <h3>Prize Pool: ${gameData.prizePool}</h3>

            <TableContainer sx={{ width: '75%', marginTop: '1rem', marginBottom: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Empty cells look better than name and position in my opinion */}
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align='center'>Earnings ($)</TableCell>
                            <TableCell align='center'>Rebuys</TableCell>
                            <TableCell align='center'>Add Ons ($)</TableCell>
                            <TableCell align='center'>Bounties</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            // Similar logic as on the leaderboard
                            gameData.leaderboard.map((player, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                            {/* player is an object, so we need to access the player.player to get the id, then send data to navigate function */}
                                            <Button sx={{ textTransform: 'none' }} onClick={async () => {
                                                const link = `/players/${player.player}`;
                                                await axios.get(`http://localhost:8080/players/${player.player}`)
                                                    .then((res) => {
                                                        navigate(link, { state: { playerData: res.data } });
                                                    });
                                            }}>{playerName[i]}</Button>

                                        </TableCell>
                                        <TableCell align='center'>{player.profit}</TableCell>
                                        <TableCell align='center'>{player.rebuys}</TableCell>
                                        <TableCell align='center'>{player.addOns}</TableCell>
                                        <TableCell align='center'>{player.bounties}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack direction='row' spacing={2} sx={{ marginBottom: '2rem' }}>
                <Button variant='contained' color='success' endIcon={<ModeEditIcon />} onClick={async () => {
                    let id = gameData._id;
                    let link = `/games/${id}/edit`;
                    console.dir(gameData); //for debug
                    await axios.get(`http://localhost:8080/games/game/${id}`)
                        .then(() => {
                            //The format is nameWeAreGivingIt : variableThatAlreadyExists
                            navigate(link, { state: { gameData: gameData, players: allPlayers } })
                        })
                }}>Edit</Button>
                <Button variant='contained' color='error' endIcon={<DeleteIcon />}>Delete</Button>
            </Stack>

        </Box>
    )
}