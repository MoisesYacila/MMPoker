import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, Button, Stack, Collapse, Alert,
    IconButton, CircularProgress
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { useUser } from '../UserContext';


export default function Game() {
    const { id } = useParams(); // Get player id from URL params
    // useLocation is used to get the data from the previous page and it will contain the gameData object if we are coming from a game link
    const location = useLocation();
    const [gameInfo, setGameInfo] = useState(location.state?.gameData || null); //using the ? syntax to avoid errors if data is not set
    const [gameDate, setGameDate] = useState(new Date(gameInfo?.date) || null);

    //Activate navigate
    const navigate = useNavigate();

    //We will save the names for the game standings, since they are not saved in the Game object
    const [playerName, setPlayerName] = useState([]);

    //We can get an array with all the players to use on load on the edit page
    const [allPlayers, setAllPlayers] = useState([]);

    //For control of dialog and alert
    const [open, setOpen] = useState(false);
    const openAlertLink = location.state?.openAlertLink || false;
    const [openAlert, setOpenAlert] = useState(openAlertLink);

    // We need to check if the current user is an admin to show the edit and delete buttons
    const { isAdmin } = useUser();

    useEffect(() => {
        //For useEffect don't use async callback, instead we can do it like this
        async function getGameData() {
            await axios.get(`http://localhost:8080/games/game/${id}`)
                .then((res) => {
                    // Set the gameInfo and gameDate state with the data from the server
                    setGameInfo(res.data);
                    setGameDate(new Date(res.data.date));
                })
                .catch(() => {
                    navigate(`/notfound`);
                });
        }
        getGameData();
        // runs on initial render and when id changes
    }, [id]);


    useEffect(() => {
        if (!gameInfo) return; // If gameInfo is not set, do not run the rest of the code
        async function getPlayerNames() {
            let playerArr = [];

            for (let player of gameInfo.leaderboard) {
                await axios.get(`http://localhost:8080/players/${player.player}`)
                    .then((res) => {
                        playerArr.push(res.data.name);
                    });
            }
            setPlayerName(playerArr);
        }
        getPlayerNames();

        // runs on initial render and when gameInfo changes
    }, [gameInfo]);

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
        <div>
            {/* Show in case the user is not allowed to edit the game */}
            <Collapse in={openAlert}>
                <Alert severity='error' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    You do not have permission to edit this game.
                </Alert>
            </Collapse>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Home Game</h1>
                <h2>{`${gameDate.getFullYear()}/${gameDate.getMonth() + 1}/${gameDate.getDate()}`}</h2>
                {/* If gameInfo is available, show it, otherwise, show a loading spinner */}
                <h3>Prize Pool: ${gameInfo ? gameInfo.prizePool : <CircularProgress />}</h3>

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
                                // If gameInfo is set, map through the leaderboard and show the players with a button to navigate to their player page
                                // Otherwise, show a loading spinner
                                gameInfo ?
                                    gameInfo.leaderboard.map((player, i) => {
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
                                                    }}>{playerName[i] ? playerName[i] : <CircularProgress />}</Button>

                                                </TableCell>
                                                <TableCell align='center'>{player.profit}</TableCell>
                                                <TableCell align='center'>{player.rebuys}</TableCell>
                                                <TableCell align='center'>{player.addOns}</TableCell>
                                                <TableCell align='center'>{player.bounties}</TableCell>
                                            </TableRow>
                                        )
                                    }) : <TableRow>
                                        <TableCell align='center'>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                {isAdmin ? <Stack direction='row' spacing={2} sx={{ marginBottom: '2rem' }}>
                    <Button variant='contained' color='success' endIcon={<ModeEditIcon />} onClick={async () => {
                        let link = `/games/${gameInfo._id}/edit`;
                        console.dir(gameInfo); //for debug
                        await axios.get(`http://localhost:8080/games/game/${gameInfo._id}`)
                            .then(() => {
                                //The format is nameWeAreGivingIt : variableThatAlreadyExists
                                navigate(link, { state: { gameData: gameInfo, players: allPlayers } })
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
                            await axios.delete(`http://localhost:8080/games/game/${gameInfo._id}`, {
                                withCredentials: true // Protected route, so we need to make sure the user is logged in
                            })
                                .then(() => {
                                    console.log(`Deleted game ${gameInfo._id} from DB`);
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
        </div>
    )
}