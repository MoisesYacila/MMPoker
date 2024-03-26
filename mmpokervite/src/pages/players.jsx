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




export default function Players() {
    const [players, setPlayers] = useState([]);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
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

    //Handlers for open and closing dialog (from Material UI)
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div>
            <h1>Players</h1>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to='/players/new'>Add Player</Link>
                <List sx={{ width: '25%' }}>
                    {/* Use the arr.map function to make a list of components */}
                    {players.map((player, i) => {
                        return (
                            <ListItem disablePadding key={i} sx={{ width: '100%' }}>
                                {/* async callback that gets, the clicked player, and links to their personal page */}
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
                                            setName(res.data.name)
                                        })
                                    handleOpen();
                                    setId(player._id);
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
                        You are about to permanently delete {name}.
                        Are you sure you want to delete this player? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/* Delete function once confirmation is received, update the players array using setPlayers for re-render */}
                    <Button onClick={async (e) => {
                        await axios.delete(`http://localhost:8080/players/${id}`)
                            .then((res) => {
                                console.log(`Deleted ${res.data.name} from DB`);
                                let newArr = [];
                                // Creates a new array with all the players except the one who we are deleting
                                // if the id is equal the fuction won't add this to the array because this is
                                //the one we are deleting
                                newArr = players.filter((player) => player._id != id);
                                setPlayers(newArr);
                            })
                        handleClose();
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}