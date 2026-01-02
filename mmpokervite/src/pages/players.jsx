import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import FlagIcon from '../components/FlagIcon';
import {
    Alert, Box, Button, CircularProgress, Collapse, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import { useUser } from '../UserContext';
import { useAlert } from '../AlertContext';
import { errorLog, log } from '../utils/logger.js';

export default function Players() {
    const [players, setPlayers] = useState([]);
    const [open, setOpen] = useState(false);
    const { alert, setAlert } = useAlert();
    const { loggedIn, isAdmin } = useUser();
    const [submitted, setSubmitted] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [loading, setLoading] = useState(true);
    // We need these values to be updated in state together, so we can put them in an object and track its changes
    const [playerData, setPlayerData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        gamesPlayed: 0
    });

    const navigate = useNavigate();

    //This gets all the players from the DB and saves their data in the players array
    useEffect(() => {
        api.get('/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setPlayers(playersArr);
                setLoading(false);
            })
    }, [])

    // Initially, playerData is empty. When any changes are detected, those will trigger this useEffect
    // After that, the id will have the value of the player we are trying to delete, and we can call handleOpen
    // to check if the player can be deleted or not
    useEffect(() => {
        if (playerData.id != '')
            handleOpen();
    }, [playerData])

    // When an user tries to delete a player, we want to check if the player is in any game
    // If they are, we will tell the user that they need to remove the player from all the games before deleting it
    // When gamesPlayed is 0, then they will be allowed to delete the player
    const handleOpen = async () => {
        // Get the player to check the stats
        await api.get(`/players/${playerData.id}`)
            .then(() => {
                // Allowed to delete
                if (playerData.gamesPlayed == 0)
                    setOpen(true);
                // Prompt user to edit games and remove this player from them if they want to delete them
                else
                    setAlert({ message: 'This player cannot be deleted as they are in at least one game. Remove from all games and then delete.', severity: 'warning', open: true });

            });
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {/* Alert to show when player should not be deleted. Syntax from MUI */}
            <Collapse in={alert.open}>
                <Alert severity={alert.severity} action={
                    <IconButton onClick={() => {
                        setAlert({ ...alert, open: false });
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    {alert.message}
                </Alert>
            </Collapse>
            <h1>Players</h1>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {loggedIn ? <Link to='/players/new' onClick={() => { setAlert({ ...alert, open: false }); }}>Add Player</Link> : null}
                <List sx={{ width: { xs: '90%', sm: '70%', md: '50%', lg: '25%' } }}>
                    {/* Use the arr.map function to make a list of components */}
                    {players.map((player, i) => {
                        return (
                            <ListItem disablePadding key={i}>
                                {/* async callback that gets the clicked player, and links to their personal page */}
                                <ListItemButton disabled={submitted || disabled} onClick={async () => {
                                    setAlert({ ...alert, open: false });
                                    setDisabled(true);
                                    const link = `/players/${player._id}`;
                                    await api.get(`/players/${player._id}`)
                                        .then(() => {
                                            navigate(link);
                                        });
                                }}>
                                    <ListItemIcon>
                                        {/* Using our custom Flag component */}
                                        <FlagIcon code={player.nationality} size={24} />
                                    </ListItemIcon>
                                    <ListItemText primary={`${player.firstName} ${player.lastName}`} sx={{ textAlign: 'center' }} />

                                </ListItemButton>
                                {/* async callback that gets the player that we are trying to delete, and opens
                                a confirmation dialog */}
                                {isAdmin ? <IconButton loading={submitted && selectedPlayerId == player._id} disabled={submitted || disabled} onClick={async () => {
                                    setSubmitted(true);
                                    setSelectedPlayerId(player._id);

                                    await api.get(`/players/${player._id}`)
                                        .then((res) => {
                                            // Important to have this data together in the object, otherwise handleOpen could be called with incomplete data
                                            setPlayerData({
                                                id: res.data._id,
                                                firstName: res.data.firstName,
                                                lastName: res.data.lastName,
                                                gamesPlayed: res.data.gamesPlayed
                                            });

                                            setSubmitted(false);
                                            setSelectedPlayerId('');
                                        });
                                }}>
                                    <ClearIcon></ClearIcon>
                                </IconButton> : <PersonIcon></PersonIcon>}
                            </ListItem>)
                    })}
                </List>
                {loading ? <CircularProgress sx={{ marginTop: '2rem' }} /> : null}
                {players.length == 0 && !loading ? <Typography variant='h5' sx={{ marginTop: '2rem' }}>No data to show. New players will appear here.</Typography> : null}
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Permanently Delete Player?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to permanently delete {`${playerData.firstName} ${playerData.lastName}`}.
                        Are you sure you want to delete this player? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={submitted} onClick={handleClose}>Cancel</Button>
                    {/* Delete function once confirmation is received, update the players array using setPlayers for re-render */}
                    <Button loading={submitted} loadingPosition='start' onClick={async () => {
                        setSubmitted(true);

                        await api.delete(`/players/${playerData.id}`)
                            .then((res) => {
                                log(`Deleted ${res.data.firstName} ${res.data.lastName} from DB`);
                                let newArr = [];
                                // Creates a new array with all the players except the one being deleted
                                // if the id is equal the fuction won't add this to the array because this is
                                // the one we are deleting
                                newArr = players.filter((player) => player._id != playerData.id);
                                setPlayers(newArr);
                                setSubmitted(false);
                                setAlert({ message: 'Player deleted.', severity: 'success', open: true });
                            }).catch((err) => {
                                errorLog(err);
                                if (err.status === 401) {
                                    setAlert({ message: 'You must be logged in to perform delete a player.', severity: 'error', open: true });
                                    navigate(`/login`);
                                }
                                else {
                                    setAlert({ message: 'Error deleting player.', severity: 'error', open: true });
                                }
                            });
                        handleClose();
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}