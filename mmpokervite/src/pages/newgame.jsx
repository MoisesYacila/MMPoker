import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import {
    Box, Collapse, Alert, IconButton, MenuItem, FormControl,
    TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useAlert } from '../AlertContext';

export default function NewGame() {
    const [players, setPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState(5);
    const [rows, setRows] = useState(Array(5));
    const [submitted, setSubmitted] = useState(false);
    // The valErrors array will be used to store the error status for each field in the form
    // Initially, all fields are set to false except player because no player is selected
    const [valErrors, setValErrors] = useState(Array.from({ length: 5 }, () => {
        return ({
            player: true,
            earnings: false,
            bounties: false,
            rebuys: false,
            addOns: false
        })
    }));
    const navigate = useNavigate();
    const { alert, setAlert } = useAlert();

    //Gets the players from DB and adds the data to players array
    useEffect(() => {
        api.get('/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setPlayers(playersArr);
            })
    }, []);

    //Sends a patch request to update the players stats after the new game
    const updatePlayers = async (e) => {
        //Create array where we will save the data
        //This is an array of objects, where each object has the information of one player and their stats in this game
        //The array will collect data in order, so it will be sorted by player position in the game
        let gameData = [];
        let prizePool = 20 * numPlayers; //Without counting the bounties

        //e.target gets the form and all the text fields in it, so we can access each individual piece of data by
        //accessing it in the correct element of the array. After checking in dev tools, I found that all data is on
        //even number indices in the array, it's multiplied by 14 because it's 7 items on each row and there is an extra
        //element in between the data
        for (let i = 0; i < numPlayers; i++) {
            gameData.push({
                player: e.target[i * 14].value,
                profit: e.target[(i * 14) + 2].value,
                itm: e.target[(i * 14) + 4].value === 'yes',
                otb: e.target[(i * 14) + 6].value === 'yes',
                bounties: e.target[(i * 14) + 8].value,
                rebuys: e.target[(i * 14) + 10].value,
                addOns: e.target[(i * 14) + 12].value
            })

            //Update the original prize pool to reflect add ons and rebuys
            prizePool += parseInt(gameData[i].addOns) + parseInt(gameData[i].rebuys * 20);
        }

        // Send patch request and send the data to the server side
        // Redirect with the correct error message if the operation fails
        await api.patch("/players", { leaderboard: gameData })
            .then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
                // ProtectedRoute should catch these cases before API calls are made, but this is another layer of security
                if (error.status === 401) {
                    setAlert({ message: 'You must be logged in to perform this action.', severity: 'error', open: true });
                }
                else if (error.status === 403) {
                    setAlert({ message: 'You do not have permission to create a game.', severity: 'error', open: true });
                }
                else {
                    setAlert({ message: 'Error updating players. Please try again.', severity: 'error', open: true });
                }
            });

        // Send post request to create a the new game
        // Redirect with the correct error message if the operation fails
        await api.post('/games', {
            leaderboard: gameData,
            numPlayers: numPlayers,
            prizePool: prizePool
        })
            .then((response) => {
                console.log(response)
                setAlert({ message: 'Game created successfully.', severity: 'success', open: true });
                navigate('/leaderboard');
            }).catch((error) => {
                console.log(error);
                if (error.status === 401) {
                    setAlert({ message: 'You must be logged in to perform this action.', severity: 'error', open: true });
                }
                else if (error.status === 403) {
                    setAlert({ message: 'You do not have permission to create a game.', severity: 'error', open: true });
                }
                else {
                    setAlert({ message: 'Error creating game. Please try again.', severity: 'error', open: true });
                }
            });
    }

    //Submit handler for the form
    const handleSubmit = async (e) => {
        //Prevents res.send response on server side
        e.preventDefault();

        // Prevent multiple submissions
        if (submitted) return;
        setSubmitted(true);

        // Check if any of the fields are empty or invalid
        // If so, prevent submission and show an alert
        const inGamePlayers = new Set();
        for (let i = 0; i < numPlayers; i++) {
            if (valErrors[i].earnings || valErrors[i].bounties || valErrors[i].rebuys ||
                valErrors[i].addOns || valErrors[i].player || inGamePlayers.has(e.target[i * 14].value)) {
                setAlert({ message: 'Validation failed. Ensure all fields are filled out correctly and no players are repeated.', severity: 'error', open: true });
                setSubmitted(false);
                return;
            }

            // Add the player to the set to ensure no duplicates
            inGamePlayers.add(e.target[i * 14].value);
        }

        // If all fields are valid, proceed with the submission
        await updatePlayers(e);
    }

    function buildRows(num) {
        // Probably better to use a temp array and then set the state once
        for (let i = 0; i < num; i++) {
            rows[i] = <TableRow key={i + 1}>
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="center">
                    {/* valErrors[i]?.player will return undefined instead of throwing an error when we change the size
                    of the array. Here we are saying use valErrors[i].players if it exists, otherwise use false*/}
                    <TextField select error={valErrors[i]?.player ?? false} onChange={(e) => {
                        const updatedErrors = [...valErrors];
                        // If the value is -1, it means the player has not been selected, we set the error to true
                        if (e.target.value == '-1') {
                            updatedErrors[i].player = true;
                        } else {
                            updatedErrors[i].player = false;
                        }
                        // Update the valErrors array with the new error status
                        setValErrors(updatedErrors);
                    }} helperText={valErrors[i]?.player ? 'Select a player' : ''}
                        defaultValue='-1' id={`${i + 1}`} name={`player-${i}`}>
                        <MenuItem value='-1'>Select a player</MenuItem>
                        {players.map((player, i) => {
                            return (
                                <MenuItem key={i + 1} value={player._id}>{`${player.firstName} ${player.lastName}`}</MenuItem>
                            )
                        })}
                    </TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField error={valErrors[i]?.earnings ?? false} onChange={(e) => {
                        // When the callback is triggered, we want to check if the value is empty or not a number
                        // If it is, we set the error to true, otherwise we set it to false
                        // Either way, we need to update the valErrors array
                        const updatedErrors = [...valErrors];
                        if (e.target.value.trim() == '' || Number.isNaN(Number(e.target.value))) {
                            updatedErrors[i].earnings = true;
                        } else {
                            updatedErrors[i].earnings = false;
                        }
                        setValErrors(updatedErrors);
                    }} helperText={valErrors[i]?.earnings ? 'Enter a number' : ''} name="earnings" defaultValue={0} sx={{ width: '35%' }}></TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField
                        select
                        id="itm-select"
                        defaultValue='no'
                        name="itm"
                    >
                        <MenuItem value='yes'>Yes</MenuItem>
                        <MenuItem value='no'>No</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField
                        select
                        id="otb-select"
                        defaultValue='no'
                        name="otb"
                    >
                        <MenuItem value='yes'>Yes</MenuItem>
                        <MenuItem value='no'>No</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField error={valErrors[i]?.bounties ?? false} onChange={(e) => {
                        // Similar logic as the earnings field, but we also want to check if the value is a positive integer
                        const updatedErrors = [...valErrors];
                        if (e.target.value.trim() == '' || Number.isNaN(Number(e.target.value)) ||
                            e.target.value < 0 || !Number.isInteger(parseFloat(e.target.value))) {
                            updatedErrors[i].bounties = true;
                        } else {
                            updatedErrors[i].bounties = false;
                        }
                        setValErrors(updatedErrors);
                    }} helperText={valErrors[i]?.bounties ? 'Enter a positive integer' : ''}
                        name="bounties" defaultValue={0} sx={{ width: '35%' }}></TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField error={valErrors[i]?.rebuys ?? false} onChange={(e) => {
                        const updatedErrors = [...valErrors];
                        if (e.target.value.trim() == '' || Number.isNaN(Number(e.target.value)) ||
                            e.target.value < 0 || !Number.isInteger(parseFloat(e.target.value))) {
                            updatedErrors[i].rebuys = true;
                        } else {
                            updatedErrors[i].rebuys = false;
                        }
                        setValErrors(updatedErrors);
                    }} helperText={valErrors[i]?.rebuys ? 'Enter a positive integer' : ''}
                        name="rebuys" defaultValue={0} sx={{ width: '35%' }}></TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField error={valErrors[i]?.addOns ?? false} onChange={(e) => {
                        const updatedErrors = [...valErrors];
                        if (e.target.value.trim() == '' || Number.isNaN(Number(e.target.value)) ||
                            e.target.value < 0 || !Number.isInteger(parseFloat(e.target.value))) {
                            updatedErrors[i].addOns = true;
                        } else {
                            updatedErrors[i].addOns = false;
                        }
                        setValErrors(updatedErrors);
                    }} helperText={valErrors[i]?.addOns ? 'Enter a positive integer' : ''}
                        name="addOns" defaultValue={0} sx={{ width: '35%' }}></TextField>
                </TableCell>
            </TableRow>
        }
    }

    buildRows(numPlayers);

    //Event handler for selecting how many players in the game
    const handleChange = (event) => {
        let num = event.target.value;
        setNumPlayers(num);
        setRows([]);

        // We need to set the valErrors array size to the new number of players
        const tempArr = [...valErrors];
        // If the new number of players is less than the current length of valErrors, we slice it
        // If it's greater, we fill the new elements with default values
        if (num < valErrors.length) {
            setValErrors(tempArr.slice(0, num));
        }
        else if (num > valErrors.length) {
            setValErrors(tempArr.concat(Array.from({ length: num - valErrors.length }, () => {
                return ({
                    player: true,
                    earnings: false,
                    bounties: false,
                    rebuys: false,
                    addOns: false
                })
            })));
        }
        buildRows(num);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            {/* Alert to show if client side validation fails. Syntax from MUI */}
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
            <h1>New Game</h1>
            <FormControl fullWidth sx={{ alignItems: 'center' }} >
                <TextField
                    select
                    id="player-number"
                    label="Number of Players"
                    defaultValue='5'
                    sx={{ width: '15%' }}
                    onChange={handleChange}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                </TextField>
            </FormControl>

            {/* <form method="POST" action="http://localhost:8080/players?_method=PATCH" > */}
            {/* Actually both POST and PATCH requests are sent on the handleSubmit, but it doesn´t matter which one we use on the form component */}
            <Box component='form'
                method="POST"
                action="http://localhost:8080/players?_method=PATCH"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TableContainer sx={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">Player</TableCell>
                                <TableCell align="center">Earnings ($)</TableCell>
                                <TableCell align="center">ITM</TableCell>
                                <TableCell align="center">OTB</TableCell>
                                <TableCell align="center">Bounties</TableCell>
                                <TableCell align="center">Rebuys</TableCell>
                                <TableCell align="center">Add Ons ($)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* The array rows contains everything that is in the table body */}
                            {rows.map(row => {
                                return row;
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button loading={submitted} loadingPosition="start" variant="contained" type="submit"
                    sx={{ width: '8%', marginBottom: '1rem' }}>
                    Add Game
                </Button>
            </Box>
        </Box>
    )
}