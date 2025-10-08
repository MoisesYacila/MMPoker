import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { Alert, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import '../App.css';
import api from '../api/axios';
import { Button, CircularProgress, Stack } from '@mui/material';
import { useUser } from '../UserContext';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

export default function Player() {
    const { id } = useParams(); // Get player id from URL params
    const [playerData, setPlayerData] = useState(null);
    const [gameList, setGameList] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const navigate = useNavigate();
    const { isAdmin } = useUser();
    const [openAlert, setOpenAlert] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);


    // Function to handle delete player button click
    const handleDeletePlayer = () => {
        // Only allow deletion if the player has not played any games, otherwise show an alert
        if (playerData.gamesPlayed <= 0) {
            setOpenDialog(true);
        } else {
            setOpenAlert(true);
        }
    }

    useEffect(() => {
        // If playerData is not set, fetch it from the server, otherwise do nothing
        if (playerData) return;
        if (!playerData) {
            api.get(`/players/${id}`)
                .then((res) => {
                    setPlayerData(res.data);
                })
                .catch(() => {
                    navigate('/notfound');
                });
        }
        //This gets the list of games from the DB and saves them in the gameList array
        //The server responds with the data we need, and we save it to an array in state for future use
        api.get(`/games/${id}`)
            .then((res) => {
                let gamesArr = [];
                res.data.forEach(game => {
                    gamesArr.push(game);
                    setGameList(gamesArr);
                })
            })
            .catch((err) => { console.log(err) })
    }, [playerData])

    return (
        <div>
            {/* Alert to show when player should not be deleted. Syntax from MUI */}
            <Collapse in={openAlert}>
                <Alert severity='warning' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    This player cannot be deleted as they are in at least one game. Remove from all games and then delete.
                </Alert>
            </Collapse>
            <h1>{playerData == null ? <CircularProgress /> : `${playerData.firstName} ${playerData.lastName}`}</h1>
            <div className='player-data'>
                <Typography variant='h4'>Earnings: ${playerData == null ? <CircularProgress /> : playerData.winnings}</Typography>
                <Typography variant='h4'>Games Played: {playerData == null ? <CircularProgress /> : playerData.gamesPlayed}</Typography>
                <Typography variant='h4'>Wins: {playerData == null ? <CircularProgress /> : playerData.wins}</Typography>
                <Typography variant='h4'>In the Money: {playerData == null ? <CircularProgress /> : playerData.itmFinishes}</Typography>
            </div>
            <div className='player-data'>
                <Typography variant='h4'>On the Bubble: {playerData == null ? <CircularProgress /> : playerData.onTheBubble}</Typography>
                <Typography variant='h4'>Bounties: {playerData == null ? <CircularProgress /> : playerData.bounties}</Typography>
                <Typography variant='h4'>Rebuys: {playerData == null ? <CircularProgress /> : playerData.rebuys}</Typography>
                <Typography variant='h4'>Add Ons: ${playerData == null ? <CircularProgress /> : playerData.addOns}</Typography>
            </div>

            {/* Show the edit and delete buttons for admins only */}
            {isAdmin ? <Stack direction='row' spacing={2} sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <Button variant='contained' color='success' endIcon={<ModeEditIcon />} onClick={async () => {
                    let link = `/player/${id}/edit`;
                    await api.get(`/players/${id}`)
                        .then(() => {
                            navigate(link);
                        })
                }}>Edit</Button>
                <Button variant='contained' color='error' onClick={handleDeletePlayer} endIcon={<DeleteIcon />}>Delete</Button>
            </Stack> : null}

            <h2>Games</h2>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <List sx={{ width: '25%' }}>
                    {gameList.length == 0 ? <Typography variant='h6'>No games played yet.</Typography> : null}
                    {gameList.map((game, i) => {
                        const gameDay = new Date(game.date)
                        return (
                            <ListItem disablePadding key={i} sx={{ width: '100%' }}>
                                <ListItemButton disabled={disabled} onClick={async () => {
                                    // Disable the button to prevent multiple clicks
                                    setDisabled(true);

                                    //Link matches router stucture set in AppRoutes.jsx
                                    //api link matches express route endpoint
                                    const link = `/games/${game._id}`;
                                    await api.get(`/games/game/${game._id}`)
                                        .then((res) => {
                                            navigate(link, { state: { gameData: res.data } });
                                        });
                                    console.log(link);
                                }}>
                                    <ListItemText primary={`Home Game - ${gameDay.getDate()} ${monthNames[gameDay.getMonth()]} 
                                ${gameDay.getFullYear()}`}
                                        sx={{ textAlign: 'center', fontWeight: 'bold' }} />
                                </ListItemButton>

                            </ListItem>
                        )
                    })}
                </List>
            </Box>
            {/* Dialog to confirm player deletion */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Permanently Delete Player?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to permanently delete {playerData ? `${playerData.firstName} ${playerData.lastName}` : <CircularProgress />}.
                        Are you sure you want to delete this player? This action cannot be undone.
                    </DialogContentText>
                    <DialogActions>
                        <Button disabled={submitted} onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button loading={submitted} onClick={async () => {

                            setSubmitted(true);
                            await api.delete(`/players/${id}`)
                                .then((res) => {
                                    console.log(`Deleted ${res.data.name} from DB`);
                                    setSubmitted(false);
                                    navigate('/players');
                                }).catch((err) => {
                                    console.log(err);
                                    navigate(`/login`, { state: { message: 'Must be signed in to delete players.', openAlertLink: true } });
                                });
                            setOpenDialog(false);
                        }}>Delete</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

        </div>
    )
}