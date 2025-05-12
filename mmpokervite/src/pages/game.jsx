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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useUser } from '../UserContext';

export default function Game() {
    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const gameData = location.state.gameData;
    const gameId = gameData._id;

    //Activate navigate
    const navigate = useNavigate();

    //date is a string in the gameData object, so we create a Date object to work with it more efficiently
    const gameDate = new Date(gameData.date);

    //We will save the names for the game standings, since they are not saved in the Game object
    const [playerName, setPlayerName] = useState([]);

    //We can get an array with all the players to use on load on the edit page
    const [allPlayers, setAllPlayers] = useState([]);

    //For control of dialog
    const [open, setOpen] = useState(false);

    // We need to check if the user is logged in to show the edit and delete buttons
    const { loggedIn } = useUser();

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

    //Handlers for open and closing dialog (from Material UI)
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

            {loggedIn ? <Stack direction='row' spacing={2} sx={{ marginBottom: '2rem' }}>
                <Button variant='contained' color='success' endIcon={<ModeEditIcon />} onClick={async () => {
                    let link = `/games/${gameId}/edit`;
                    console.dir(gameData); //for debug
                    await axios.get(`http://localhost:8080/games/game/${gameId}`)
                        .then(() => {
                            //The format is nameWeAreGivingIt : variableThatAlreadyExists
                            navigate(link, { state: { gameData: gameData, players: allPlayers } })
                        })
                }}>Edit</Button>
                <Button variant='contained' color='error' onClick={handleOpen} endIcon={<DeleteIcon />}>Delete</Button>
            </Stack> : null}

            {/* Syntax from Material UI */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Permanently Delete Game?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to permanently delete this game.
                        Are you sure you want to delete this game? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/* Call delete function, and redirect to leaderboard when deletion is confirmed */}
                    <Button onClick={async () => {
                        await axios.delete(`http://localhost:8080/games/game/${gameId}`, {
                            withCredentials: true // Protected route, so we need to make sure the user is logged in
                        })
                            .then(() => {
                                console.log(`Deleted game ${gameId} from DB`);
                                navigate(`/leaderboard`);
                            }).catch((err) => {
                                console.error(err);
                                // Redirect to login and show alert if user is not logged in
                                navigate(`/login`, { state: { message: 'Must be signed in to delete games.', openAlertLink: true } });
                            });
                        handleClose();
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}