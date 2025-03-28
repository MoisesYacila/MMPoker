import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Us, Ar, Mx, Ni, Es, Ve } from "react-flags-select";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';




export default function Players() {
    const [players, setPlayers] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    // We need these 3 values to be updated in state together, so we can put them in an object and track its changes
    const [playerData, setPlayerData] = useState({
        id: '',
        name: '',
        gamesPlayed: 0
    });
    //The Navigate component didn't work as expected when used inside a onClick callback, so we can use this instead
    const navigate = useNavigate();

    //This gets all the players from the DB and saves their data in the players array
    useEffect(() => {
        axios.get('http://localhost:8080/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setPlayers(playersArr);
            })
    }, [])

    // Since we made an object, when the id is any different from its initial value, that means the object is updated
    // We can call handleOpen. This only happens when the object changes
    useEffect(() => {
        if (playerData.id != '')
            handleOpen();
    }, [playerData])

    // When an user tries to delete a game, we want to check if the player is in any game
    // If they are, we will tell the user that they need to remove the player from all the games before deleting it
    // When gamesPlayed is 0, then they will be allowed to delete the player
    const handleOpen = async () => {
        // Get the player to check the stats
        await axios.get(`http://localhost:8080/players/${playerData.id}`)
            .then((res) => {
                // Allowed to delete
                if (playerData.gamesPlayed == 0)
                    setOpen(true);
                // Prompt user to edit games and remove this player from them if they want to delete them
                else
                    setOpenAlert(true);
            });
    };

    const handleClose = () => {
        setOpen(false);
    };

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
            <h1>Players</h1>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to='/players/new'>Add Player</Link>
                <List sx={{ width: '25%' }}>
                    {/* Use the arr.map function to make a list of components */}
                    {players.map((player, i) => {
                        return (
                            <ListItem disablePadding key={i} sx={{ width: '100%' }}>
                                {/* async callback that gets the clicked player, and links to their personal page */}
                                <ListItemButton onClick={async () => {
                                    const link = `/players/${player._id}`;
                                    await axios.get(`http://localhost:8080/players/${player._id}`)
                                        .then((res) => {
                                            navigate(link, { state: { playerData: res.data } });
                                        });
                                }}>
                                    <ListItemIcon>
                                        {/* There has to be a better way to do this. Research later */}
                                        {player.nationality === "US" ? <Us /> : null}
                                        {player.nationality === "AR" ? <Ar /> : null}
                                        {player.nationality === "MX" ? <Mx /> : null}
                                        {player.nationality === "NI" ? <Ni /> : null}
                                        {player.nationality === "ES" ? <Es /> : null}
                                        {player.nationality === "VE" ? <Ve /> : null}
                                    </ListItemIcon>
                                    <ListItemText primary={player.name} sx={{ textAlign: 'center' }} />

                                </ListItemButton>
                                {/* async callback that gets the player that we are trying to delete, and opens
                                a confirmation dialog */}
                                <IconButton onClick={async () => {
                                    await axios.get(`http://localhost:8080/players/${player._id}`)
                                        .then((res) => {
                                            // Important to have this data together in the object, otherwise handleOpen could be called with incomplete data
                                            setPlayerData({
                                                id: res.data._id,
                                                name: res.data.name,
                                                gamesPlayed: res.data.gamesPlayed
                                            });
                                        });
                                }}>
                                    <ClearIcon></ClearIcon>
                                </IconButton>
                            </ListItem>)
                    })}
                </List>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Permanently Delete Player?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to permanently delete {playerData.name}.
                        Are you sure you want to delete this player? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/* Delete function once confirmation is received, update the players array using setPlayers for re-render */}
                    <Button onClick={async (e) => {
                        await axios.delete(`http://localhost:8080/players/${playerData.id}`)
                            .then((res) => {
                                console.log(`Deleted ${res.data.name} from DB`);
                                let newArr = [];
                                // Creates a new array with all the players except the one being deleted
                                // if the id is equal the fuction won't add this to the array because this is
                                // the one we are deleting
                                newArr = players.filter((player) => player._id != playerData.id);
                                setPlayers(newArr);
                            })
                        handleClose();
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}