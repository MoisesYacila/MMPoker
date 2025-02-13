import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import {
    FormControl, TextField, MenuItem,
    TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody
} from "@mui/material";

export default function EditGame() {
    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const gameData = location.state.gameData;
    const allPlayers = location.state.players;
    const initialPlayers = gameData.numPlayers;

    const [numPlayers, setNumPlayers] = useState(initialPlayers);
    const [rows, setRows] = useState([]);

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
        buildRows(numPlayers)
        console.log(gameData);
    }, [numPlayers])

    return (
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
                action="http://localhost:8080/players?_method=PATCH"
                onSubmit={() => { }} //handle submit
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

            </Box>
        </Box>

    )

}