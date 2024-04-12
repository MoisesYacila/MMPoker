import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

export default function NewGame() {
    const [numPlayers, setNumPlayers] = useState(5);
    const [rows, setRows] = useState(Array(5));

    function buildRows(num) {
        for (let i = 0; i < num; i++) {
            rows[i] = <TableRow key={i + 1}>
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="center">
                    <TextField select
                        label="Player"
                        defaultValue='1'>
                        <MenuItem value={1}>Player 1</MenuItem>
                        <MenuItem value={2}>Player 2</MenuItem>
                        <MenuItem value={3}>Player 3</MenuItem>
                    </TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField></TextField>
                </TableCell>
                <TableCell align="center"><Checkbox></Checkbox></TableCell>
                <TableCell align="center"><Checkbox></Checkbox></TableCell>
                <TableCell align="center">
                    <TextField></TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField></TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField></TextField>
                </TableCell>
            </TableRow>
        }
    }

    buildRows(numPlayers);

    const handleChange = (event) => {
        // console.log(rows)
        setNumPlayers(event.target.value);
        // console.log(event.target.value);
        // console.log(numPlayers);
        setRows([]);
        buildRows(event.target.value);
    };

    return (
        <Box>
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

            <TableContainer sx={{ marginTop: '1rem', marginBottom: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">Player</TableCell>
                            <TableCell align="center">Earnings</TableCell>
                            <TableCell align="center">ITM</TableCell>
                            <TableCell align="center">OTB</TableCell>
                            <TableCell align="center">Bounties</TableCell>
                            <TableCell align="center">Rebuys</TableCell>
                            <TableCell align="center">Add Ons</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => {
                            return row;
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    )
}