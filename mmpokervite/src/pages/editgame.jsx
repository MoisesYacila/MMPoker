import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import {
    FormControl, TextField, MenuItem,
    TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, Stack, Button, Collapse, Alert, IconButton
} from "@mui/material";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import ClearIcon from '@mui/icons-material/Clear';

export default function EditGame() {

    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const gameData = location.state.gameData;
    const allPlayers = location.state.players;
    const initialPlayers = gameData.numPlayers;
    const navigate = useNavigate();
    const link = `/games/${gameData._id}`; //This link is for the redirect

    const [numPlayers, setNumPlayers] = useState(initialPlayers);
    const [rows, setRows] = useState([]);
    const [success, setSucess] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    //Using the Array.from function to build each row on the edit page
    //el is the current element, which is unused here
    function buildRows() {
        let rowPlayer, rowEarnings, rowITM, rowOTB, rowBounties, rowRebuys, rowAddOns;
        let newRows = Array.from({ length: numPlayers }, (el, i) => {
            // If we change the number of players, gameData.leaderboard[i] might be undefined, so we can use a try/catch to handle that
            // If undefined, set everything to default values
            try {
                rowPlayer = gameData.leaderboard[i].player;
                rowEarnings = gameData.leaderboard[i].profit;
                rowITM = gameData.leaderboard[i].itm ? 'yes' : 'no';
                rowOTB = gameData.leaderboard[i].otb ? 'yes' : 'no';
                rowBounties = gameData.leaderboard[i].bounties;
                rowRebuys = gameData.leaderboard[i].rebuys;
                rowAddOns = gameData.leaderboard[i].addOns;
            } catch (e) {
                rowPlayer = '-1';
                rowEarnings = '0';
                rowITM = 'no';
                rowOTB = 'no';
                rowBounties = '0';
                rowRebuys = '0';
                rowAddOns = '0';
            }
            return (
                <TableRow key={i + 1}>
                    <TableCell align="center">{i + 1}</TableCell>
                    <TableCell align="center">
                        {/* defaultValue set to load current data for all fields*/}
                        <TextField select
                            defaultValue={rowPlayer} id={`${i + 1}`} name={`player-${i}`}>
                            <MenuItem value='-1'>Select a player</MenuItem>
                            {/* Add all the options */}
                            {allPlayers.map((player, i) => {
                                return (
                                    <MenuItem key={i + 1} value={player._id}>{player.name}</MenuItem>
                                )
                            })}
                        </TextField>
                    </TableCell>
                    <TableCell align="center">
                        <TextField name="earnings" defaultValue={rowEarnings} sx={{ width: '35%' }}></TextField>
                    </TableCell>
                    <TableCell align="center">
                        <TextField
                            select
                            id="itm-select"
                            defaultValue={rowITM}
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
                            defaultValue={rowOTB}
                            name="otb"
                        >
                            <MenuItem value='yes'>Yes</MenuItem>
                            <MenuItem value='no'>No</MenuItem>
                        </TextField>
                    </TableCell>
                    <TableCell align="center">
                        <TextField name="bounties" defaultValue={rowBounties} sx={{ width: '35%' }}></TextField>
                    </TableCell>
                    <TableCell align="center">
                        <TextField name="rebuys" defaultValue={rowRebuys} sx={{ width: '35%' }}></TextField>
                    </TableCell>
                    <TableCell align="center">
                        <TextField name="addOns" defaultValue={rowAddOns} sx={{ width: '35%' }}></TextField>
                    </TableCell>
                </TableRow>
            )
        })
        setRows(newRows);
    }

    //Only call buildRows when numPlayers changes
    useEffect(() => {
        buildRows(numPlayers);
        console.log(gameData);
    }, [numPlayers])

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

        //Send patch request and send the data to the server side
        //The format is nameWeAreGivingIt : variableThatAlreadyExists, the first name is what will be received in the back end
        await axios.patch(`http://localhost:8080/players/edit/${gameData._id}`, { oldData: gameData, newData: gameInfo })
            .then((response) => {
                setSucess(true); //set success to true to know we can redirect
                console.log(response);
            }).catch((error) => {
                console.log(error);
                setOpenAlert(true); //show alert if error occurs
            });
    }

    const handleSubmit = async (e) => {
        //Preventing default form behavior, so we can work with the data
        e.preventDefault();

        //Update game
        await updateGame(e);

        // If the user is logged in, we'll redirect them to the updated game page
        if (success) {
            await axios.get(`http://localhost:8080/games/game/${gameData._id}`)
                .then((res) => {
                    //redirect and pass the new game data to show on the next page
                    navigate(link, { state: { gameData: res.data } });
                });
        }
    }

    return (
        <div>
            {/* Alert to show if operation fails. Syntax from MUI */}
            <Collapse in={openAlert}>
                <Alert severity='error' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    Must be signed in to edit a game.
                </Alert>
            </Collapse>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <h1>Edit Game</h1>
                <FormControl fullWidth sx={{ alignItems: 'center' }}>
                    <TextField
                        select
                        label='Number of Players'
                        defaultValue={initialPlayers} //original number of players
                        sx={{ width: '15%' }}
                        onChange={(e) => {
                            setNumPlayers(e.target.value)
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
                                {rows}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack direction='row' spacing={2} sx={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                        <Button type='submit' variant="contained" color="success" endIcon={<SaveAltIcon />}>Save Changes</Button>
                        <Button variant="contained" color='error' onClick={() => {
                            navigate(link, { state: { gameData } }); //short hand notation equivalent to gameData: gameData
                        }} endIcon={<CancelIcon />}>Cancel</Button>
                    </Stack>
                </Box>
            </Box>
        </div>
    )
}