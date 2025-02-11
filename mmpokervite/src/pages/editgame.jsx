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
    const [players, setPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState(gameData.numPlayers);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <h1>Edit Game</h1>
            <FormControl fullWidth sx={{ alignItems: 'center' }}>
                <TextField
                    select
                    label='Number of Players'
                    defaultValue={numPlayers} //current number of players
                    sx={{ width: '15%' }}
                    onChange={() => { }} //Try doing when you build the rows and not using a seperate function for it
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
                            <TableBody>

                            </TableBody>
                        </TableHead>
                    </Table>
                </TableContainer>

            </Box>
        </Box>

    )

}