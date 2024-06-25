import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function Game() {
    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const gameData = location.state.gameData;

    //date is a string in the gameData object, so we create a Date object to work with it more efficiently
    const gameDate = new Date(gameData.date);

    //We will save the names for the leaderboard, since they are not saved in the Game object
    const [playerName, setPlayerName] = useState([]);

    useEffect(() => {
        //For useEffect don't use async callback, instead we can do it like this
        async function getPlayerNames() {
            let playerArr = [];
            //forEach doesn't support async operation, so we can 'for of' loop
            for (let player of gameData.leaderboard) {
                await axios.get(`http://localhost:8080/players/${player.player}`)
                    .then((res) => {
                        playerArr.push(res.data.name);
                    });
            }
            setPlayerName(playerArr);
        }

        getPlayerNames();
    }, []);



    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Home Game</h1>
            <h2>{`${gameDate.getFullYear()}/${gameDate.getMonth()}/${gameDate.getDate()}`}</h2>

            <TableContainer sx={{ width: '75%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Empty cells look better than name and position in my opinion */}
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align='center'>Earnings ($)</TableCell>
                            <TableCell align='center'>Rebuys</TableCell>
                            <TableCell align='center'>Add Ons ($)</TableCell>
                            <TableCell align='center'>Bounties</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            gameData.leaderboard.map((player, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{playerName[i]}</TableCell>
                                        <TableCell align='center'>{player.profit}</TableCell>
                                        <TableCell align='center'>{player.rebuys}</TableCell>
                                        <TableCell align='center'>{player.addOns}</TableCell>
                                        <TableCell align='center'>{player.bounties}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}