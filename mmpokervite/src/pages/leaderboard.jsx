import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

export default function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [orderBy, setOrderBy] = useState('winnings');
    //This gets all the players from the DB and saves their data in the players array
    useEffect(() => {
        axios.get('http://localhost:8080/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setPlayers(playersArr);
            })
    }, [])
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Leaderboard</h1>
            <Link to='/leaderboard/new'>Add Game</Link>
            <TableContainer sx={{ marginTop: '1rem', marginBottom: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align='center'>
                                <TableSortLabel>
                                    Games Played
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align='center'>
                                <TableSortLabel>
                                    Wins
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel>
                                    ITM
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel>
                                    OTB
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel>
                                    Bounties
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel>
                                    Rebuys
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel>
                                    Add Ons
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel>
                                    Earnings ($)
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player, i) => {
                            return (
                                <TableRow key={player._id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell >{player.name}</TableCell>
                                    <TableCell align='center'>{player.gamesPlayed}</TableCell>
                                    <TableCell align='center'>{player.wins}</TableCell>
                                    <TableCell align='center'>{player.itmFinishes}</TableCell>
                                    <TableCell align='center'>{player.onTheBubble}</TableCell>
                                    <TableCell align='center'>{player.bounties}</TableCell>
                                    <TableCell align='center'>{player.rebuys}</TableCell>
                                    <TableCell align='center'>{player.addOns}</TableCell>
                                    <TableCell align='center'>{player.winnings}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>


    )
}