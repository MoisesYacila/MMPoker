import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Box from '@mui/material/Box';
import {
    FormControl, TextField, MenuItem,
    TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, Stack, Button, Collapse,
    Alert, IconButton, CircularProgress
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAlert } from '../AlertContext';

export default function EditGame() {
    //Get the game id from the URL
    const { id } = useParams();
    const navigate = useNavigate();
    const link = `/games/${id}`; //This link is for the redirect
    const { setAlert, alert } = useAlert();

    //Array for all players to show on the selects
    const [allPlayers, setAllPlayers] = useState([]);
    const [gameData, setGameData] = useState({});
    // Default to 0, but will update when the data loads
    const [numPlayers, setNumPlayers] = useState(0);
    const [rows, setRows] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    // The valErrors array will be used to store the error status for each field in the form
    // Initially, all fields are set to false because there are no errors initially
    const [valErrors, setValErrors] = useState(Array.from({ length: numPlayers }, () => {
        return ({
            player: false,
            earnings: false,
            bounties: false,
            rebuys: false,
            addOns: false
        })
    }));

    //Using the Array.from function to build each row on the edit page
    //el is the current element, which is unused here
    function buildRows(d = gameData, n = numPlayers) {
        // n can only be 0 if the gameData has not been loaded yet, so we can return early and not render anything
        if (n === 0) return;

        let newRows = Array.from({ length: n }, (el, i) => {
            // If we change the number of players, gameData.leaderboard[i] might be undefined, so we can use a try/catch to handle that
            // If undefined, set everything to default values
            try {
                const data = d.leaderboard[i];
                return {
                    player: data.player ?? '-1',
                    earnings: data.profit ?? '0',
                    itm: data.itm ? 'yes' : 'no',
                    otb: data.otb ? 'yes' : 'no',
                    bounties: data.bounties ?? '0',
                    rebuys: data.rebuys ?? '0',
                    addOns: data.addOns ?? '0',
                };
            } catch (e) {
                return {
                    player: '-1',
                    earnings: '0',
                    itm: 'no',
                    otb: 'no',
                    bounties: '0',
                    rebuys: '0',
                    addOns: '0',
                };
            }
        })
        setRows(newRows);
    }

    // Get the players and game data from the server when the component mounts
    useEffect(() => {
        api.get('/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setAllPlayers(playersArr);
            })

        api.get(`/games/game/${id}`)
            .then((res) => {
                setGameData(res.data);
                setNumPlayers(res.data.numPlayers);
                buildRows(res.data, res.data.numPlayers);
                setValErrors(Array.from({ length: res.data.numPlayers }, () => ({
                    player: false,
                    earnings: false,
                    bounties: false,
                    rebuys: false,
                    addOns: false
                })));
            })
            .catch((error) => {
                console.log(error);
                // If the user is not logged in, redirect to login page and show alert
                if (error.status === 401) {
                    setAlert({ message: 'Must be signed in to edit games.', severity: 'error', open: true });
                    navigate(`/login`);
                }
                // If the game is not found, redirect to not found page
                else if (error.status === 404) {
                    navigate(`/notfound`);
                }
            });

    }, [id]);

    // Whenever the number of players changes or the data is loaded for the first time, 
    // we want to rebuild the rows and update the valErrors array
    useEffect(() => {
        if (!gameData) return;

        buildRows(gameData, numPlayers);

        // If the number of players is the same as the gameData.numPlayers, we don't need to do anything
        // But we want to make sure that we build rows before, in case the number of players changes on the select back to gameData.numPlayers but not on the gameData object
        if (numPlayers == gameData.numPlayers) return;

        // If the number of players is greater than the gameData.numPlayers, we need to extend the valErrors array
        // However, if the number of players is less than the gameData.numPlayers, we don't need to do anything because we will simply ignore the extra players
        // but we might need them if the user changes the number of players back to a higher number
        const tempArr = [...valErrors];
        if (numPlayers > gameData.numPlayers) {
            setValErrors(tempArr.concat(Array.from({ length: numPlayers - gameData.numPlayers }, () => {
                return ({
                    player: true,
                    earnings: false,
                    bounties: false,
                    rebuys: false,
                    addOns: false
                })
            })));
        }
    }, [numPlayers, gameData]);

    const updateGame = async (e) => {
        let gameInfo = [];
        let prizePool = 20 * numPlayers; //Without counting the bounties

        for (let i = 0; i < numPlayers; i++) {
            gameInfo.push({
                player: e.target[i * 14].value,
                profit: parseInt(e.target[(i * 14) + 2].value),
                //This will be true only if the string equals yes, and false otherwise
                itm: e.target[(i * 14) + 4].value === 'yes',
                otb: e.target[(i * 14) + 6].value === 'yes',
                bounties: parseInt(e.target[(i * 14) + 8].value),
                rebuys: parseInt(e.target[(i * 14) + 10].value),
                addOns: parseInt(e.target[(i * 14) + 12].value)
            })

            //Update the original prize pool to reflect add ons and rebuys
            prizePool += parseInt(gameInfo[i].addOns) + parseInt(gameInfo[i].rebuys * 20);
        }
        // If user is logged in, we will be able to update the game, otherwise we will redirect to login page
        try {
            // Send patch request and send the data to the server side
            // The format is nameWeAreGivingIt : variableThatAlreadyExists, the first name is what will be received in the back end
            await api.patch(`/players/edit/${gameData._id}`, {
                oldLeaderboard: gameData.leaderboard, leaderboard: gameInfo, prizePool, numPlayers
            });

            // Redirect and pass the new game data to the next page with the alert
            setAlert({ message: 'Game updated.', severity: 'success', open: true });
            navigate(link);
        }
        // ProtectedRoute should prevent this from running, but just in case, we add another layer of error handling
        catch (error) {
            console.log(error);
            // If the user is not logged in, redirect to login page and show alert
            if (error.status === 401) {
                setAlert({ message: 'Must be signed in to edit games.', severity: 'error', open: true });
                console.log('User not logged in, redirecting to login page...');
                navigate(`/login`);
            }

            // If the user is logged in, but is not an admin, redirect back to the game page and show alert
            else if (error.status === 403) {
                setAlert({ message: 'Unauthorized.', severity: 'error', open: true });
                navigate(`${link}`);
            }
        }
    }

    const handleSubmit = async (e) => {
        //Preventing default form behavior, so we can work with the data
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
                setAlert({ open: true, message: 'Validation failed. Ensure all fields are filled out correctly and no players are repeated.', severity: 'error' });
                setSubmitted(false);
                return;
            }

            // Add the player to the set to ensure no duplicates
            inGamePlayers.add(e.target[i * 14].value);
        }

        //Update game
        await updateGame(e);
    }

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
            <h1>Edit Game</h1>
            <FormControl fullWidth sx={{ alignItems: 'center' }}>
                <TextField
                    select
                    label='Number of Players'
                    // If numPlayers is 0, we set it to 5 by default, otherwise we use the current value
                    // This is to avoid out of range errors when the gameData has not been loaded yet
                    value={numPlayers == 0 ? 5 : numPlayers}
                    sx={{ width: '15%' }}
                    onChange={(e) => {
                        setNumPlayers(Number(e.target.value))
                    }}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                </TextField>
            </FormControl>
            <Box component='form'
                method="POST"
                action="http://localhost:8080/players/edit/:id?_method=PATCH"
                onSubmit={handleSubmit} //handle submit
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
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
                            {gameData == null ? <TableRow>
                                <TableCell align='center'>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow> :
                                rows.map((row, i) => {
                                    return (
                                        <TableRow key={i + 1}>
                                            <TableCell align="center">{i + 1}</TableCell>
                                            <TableCell align="center">
                                                {/* defaultValue set to load current data for all fields*/}
                                                {/* valErrors[i]?.player will return undefined instead of throwing an error when we change the size
                                             of the array. Here we are saying use valErrors[i].players if it exists, otherwise use false*/}
                                                <TextField select error={valErrors[i]?.player ?? false} helperText={valErrors[i]?.player ? 'Select a player' : ''}
                                                    onChange={(e) => {
                                                        // Update the rows array with the new player value
                                                        const updatedRows = [...rows];
                                                        updatedRows[i].player = e.target.value;
                                                        setRows(updatedRows);

                                                        const updatedErrors = [...valErrors];
                                                        // If the value is -1, it means the player has not been selected, we set the error to true
                                                        if (e.target.value == '-1') {
                                                            updatedErrors[i].player = true;
                                                        } else {
                                                            updatedErrors[i].player = false;
                                                        }
                                                        // Update the valErrors array with the new error status
                                                        setValErrors(updatedErrors);
                                                    }}
                                                    value={row.player ?? '-1'} id={`${i + 1}`} name={`player-${i}`}>
                                                    <MenuItem value='-1'>Select a player</MenuItem>
                                                    {/* Add all the options */}
                                                    {allPlayers.map((player, i) => {
                                                        return (
                                                            <MenuItem key={i + 1} value={player._id}>{`${player.firstName} ${player.lastName}`}</MenuItem>
                                                        )
                                                    })}
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField name="earnings" error={valErrors[i]?.earnings ?? false} helperText={valErrors[i]?.earnings ? 'Enter a valid number' : ''}
                                                    onChange={(e) => {
                                                        // Update the rows array with the new earnings value
                                                        const updatedRows = [...rows];
                                                        updatedRows[i].earnings = e.target.value;
                                                        setRows(updatedRows);

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
                                                    }}
                                                    value={row.earnings} sx={{ width: '35%' }}></TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    select id="itm-select" onChange={(e) => {
                                                        // Update the rows array with the new ITM (In the Money) value
                                                        const updatedRows = [...rows];
                                                        updatedRows[i].itm = e.target.value;
                                                        setRows(updatedRows);
                                                        // The only valid values are 'yes' and 'no', so we don't need to worry about errors.
                                                    }}
                                                    value={row.itm}
                                                    name="itm"
                                                >
                                                    <MenuItem value='yes'>Yes</MenuItem>
                                                    <MenuItem value='no'>No</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    select id="otb-select" onChange={(e) => {
                                                        // Update the rows array with the new OTB (On the Bubble) value
                                                        const updatedRows = [...rows];
                                                        updatedRows[i].otb = e.target.value;
                                                        setRows(updatedRows);
                                                        // The only valid values are 'yes' and 'no', so we don't need to worry about errors.
                                                    }}
                                                    value={row.otb}
                                                    name="otb"
                                                >
                                                    <MenuItem value='yes'>Yes</MenuItem>
                                                    <MenuItem value='no'>No</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField name="bounties" error={valErrors[i]?.bounties ?? false} helperText={valErrors[i]?.bounties ? 'Enter a positive integer' : ''}
                                                    onChange={(e) => {
                                                        // Update the rows array with the new bounties value
                                                        const updatedRows = [...rows];
                                                        updatedRows[i].bounties = e.target.value;
                                                        setRows(updatedRows);

                                                        // Similar logic as the earnings field, but we also want to check if the value is a positive integer
                                                        const updatedErrors = [...valErrors];
                                                        if (e.target.value.trim() == '' || Number.isNaN(Number(e.target.value)) ||
                                                            e.target.value < 0 || !Number.isInteger(parseFloat(e.target.value))) {
                                                            updatedErrors[i].bounties = true;
                                                        } else {
                                                            updatedErrors[i].bounties = false;
                                                        }
                                                        setValErrors(updatedErrors);
                                                    }}
                                                    value={row.bounties} sx={{ width: '35%' }}></TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField name="rebuys" error={valErrors[i]?.rebuys ?? false} helperText={valErrors[i]?.rebuys ? 'Enter a positive integer' : ''}
                                                    onChange={(e) => {
                                                        // Update the rows array with the new rebuys value
                                                        const updatedRows = [...rows];
                                                        updatedRows[i].rebuys = e.target.value;
                                                        setRows(updatedRows);

                                                        // Similar logic as the bounties field, but we also want to check if the value is a positive integer
                                                        const updatedErrors = [...valErrors];
                                                        if (e.target.value.trim() == '' || Number.isNaN(Number(e.target.value)) ||
                                                            e.target.value < 0 || !Number.isInteger(parseFloat(e.target.value))) {
                                                            updatedErrors[i].rebuys = true;
                                                        } else {
                                                            updatedErrors[i].rebuys = false;
                                                        }
                                                        setValErrors(updatedErrors);
                                                    }}
                                                    value={row.rebuys} sx={{ width: '35%' }}></TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField name="addOns" error={valErrors[i]?.addOns ?? false} helperText={valErrors[i]?.addOns ? 'Enter a positive integer' : ''}
                                                    onChange={(e) => {
                                                        // Update the rows array with the new addOns value
                                                        const updatedRows = [...rows];
                                                        updatedRows[i].addOns = e.target.value;
                                                        setRows(updatedRows);

                                                        // Similar logic as the bounties field, but we also want to check if the value is a positive integer
                                                        const updatedErrors = [...valErrors];
                                                        if (e.target.value.trim() == '' || Number.isNaN(Number(e.target.value)) ||
                                                            e.target.value < 0 || !Number.isInteger(parseFloat(e.target.value))) {
                                                            updatedErrors[i].addOns = true;
                                                        } else {
                                                            updatedErrors[i].addOns = false;
                                                        }
                                                        setValErrors(updatedErrors);
                                                    }}
                                                    value={row.addOns} sx={{ width: '35%' }}></TextField>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack direction='row' spacing={2} sx={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                    <Button loading={submitted} loadingPosition="start" type='submit' variant="contained" color="success" endIcon={<SaveAltIcon />}>Save Changes</Button>
                    <Button disabled={submitted} variant="contained" color='error' onClick={() => {
                        setAlert({ ...alert, open: false });
                        navigate(link, { state: { gameData } }); //short hand notation equivalent to gameData: gameData
                    }} endIcon={<CancelIcon />}>Cancel</Button>
                </Stack>
            </Box>
        </Box>
    )
}