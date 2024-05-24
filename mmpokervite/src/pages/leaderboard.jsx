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
    const [order, setOrder] = useState('asc');
    //This gets all the players from the DB and saves their data in the players array
    useEffect(() => {
        axios.get('http://localhost:8080/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setPlayers(playersArr);
            })
        // .catch((err) => { console.log(err) })
    }, [])
    return (
        //Move div styles to css file
        <div style={{ textAlign: 'center' }}>
            <h1>Leaderboard</h1>
            <Link to='/leaderboard/new'>Add Game</Link>
            <TableContainer sx={{ marginTop: '1rem', marginBottom: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Empty cells look better than name and position in my opinion */}
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align='center'>
                                {/* Arrow button to sort by category */}
                                <TableSortLabel direction={order} onClick={() => {
                                    //Similar to intial load of data, but this time we sort the data and change
                                    //the flag to change the direction of the arrow
                                    let sorted = []
                                    players.forEach(player => sorted.push(player))
                                    //order should only ever be 'asc' or 'desc'
                                    //sort in descending order
                                    if (order === 'asc') {
                                        sorted.sort((a, b) => { return b.gamesPlayed - a.gamesPlayed });
                                        setOrder('desc');
                                    }
                                    //sort in ascending order
                                    else {
                                        sorted.sort((a, b) => { return a.gamesPlayed - b.gamesPlayed });
                                        setOrder('asc');
                                    }
                                    setPlayers(sorted);
                                }}>
                                    Games Played
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align='center'>
                                <TableSortLabel direction={order} onClick={() => {
                                    let sorted = []
                                    players.forEach(player => sorted.push(player))
                                    //order should only ever be 'asc' or 'desc'
                                    //sort in descending order
                                    if (order === 'asc') {
                                        sorted.sort((a, b) => { return b.wins - a.wins });
                                        setOrder('desc');
                                    }
                                    //sort in ascending order
                                    else {
                                        sorted.sort((a, b) => { return a.wins - b.wins });
                                        setOrder('asc');
                                    }
                                    setPlayers(sorted);
                                }}>
                                    Wins
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel direction={order} onClick={() => {
                                    let sorted = []
                                    players.forEach(player => sorted.push(player))
                                    //order should only ever be 'asc' or 'desc'
                                    //sort in descending order
                                    if (order === 'asc') {
                                        sorted.sort((a, b) => { return b.itmFinishes - a.itmFinishes });
                                        setOrder('desc');
                                    }
                                    //sort in ascending order
                                    else {
                                        sorted.sort((a, b) => { return a.itmFinishes - b.itmFinishes });
                                        setOrder('asc');
                                    }
                                    setPlayers(sorted);
                                }}>
                                    ITM
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel direction={order} onClick={() => {
                                    let sorted = []
                                    players.forEach(player => sorted.push(player))
                                    //order should only ever be 'asc' or 'desc'
                                    //sort in descending order
                                    if (order === 'asc') {
                                        sorted.sort((a, b) => { return b.onTheBubble - a.onTheBubble });
                                        setOrder('desc');
                                    }
                                    //sort in ascending order
                                    else {
                                        sorted.sort((a, b) => { return a.onTheBubble - b.onTheBubble });
                                        setOrder('asc');
                                    }
                                    setPlayers(sorted);
                                }}>
                                    OTB
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel direction={order} onClick={() => {
                                    let sorted = []
                                    players.forEach(player => sorted.push(player))
                                    //order should only ever be 'asc' or 'desc'
                                    //sort in descending order
                                    if (order === 'asc') {
                                        sorted.sort((a, b) => { return b.bounties - a.bounties });
                                        setOrder('desc');
                                    }
                                    //sort in ascending order
                                    else {
                                        sorted.sort((a, b) => { return a.bounties - b.bounties });
                                        setOrder('asc');
                                    }
                                    setPlayers(sorted);
                                }}>
                                    Bounties
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center' onClick={() => {
                                let sorted = []
                                players.forEach(player => sorted.push(player))
                                //order should only ever be 'asc' or 'desc'
                                //sort in descending order
                                if (order === 'asc') {
                                    sorted.sort((a, b) => { return b.rebuys - a.rebuys });
                                    setOrder('desc');
                                }
                                //sort in ascending order
                                else {
                                    sorted.sort((a, b) => { return a.rebuys - b.rebuys });
                                    setOrder('asc');
                                }
                                setPlayers(sorted);
                            }}>
                                <TableSortLabel direction={order}>
                                    Rebuys
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center' onClick={() => {
                                let sorted = []
                                players.forEach(player => sorted.push(player))
                                //order should only ever be 'asc' or 'desc'
                                //sort in descending order
                                if (order === 'asc') {
                                    sorted.sort((a, b) => { return b.addOns - a.addOns });
                                    setOrder('desc');
                                }
                                //sort in ascending order
                                else {
                                    sorted.sort((a, b) => { return a.addOns - b.addOns });
                                    setOrder('asc');
                                }
                                setPlayers(sorted);
                            }}>
                                <TableSortLabel direction={order}>
                                    Add Ons ($)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <TableSortLabel direction={order} onClick={() => {
                                    let sorted = []
                                    players.forEach(player => sorted.push(player))
                                    //order should only ever be 'asc' or 'desc'
                                    //sort in descending order
                                    if (order === 'asc') {
                                        sorted.sort((a, b) => { return b.winnings - a.winnings });
                                        setOrder('desc');
                                    }
                                    //sort in ascending order
                                    else {
                                        sorted.sort((a, b) => { return a.winnings - b.winnings });
                                        setOrder('asc');
                                    }
                                    setPlayers(sorted);
                                }}>
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