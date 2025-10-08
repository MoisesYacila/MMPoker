import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import {
    Alert, Collapse, IconButton, Button, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useAlert } from '../AlertContext';
import { useUser } from '../UserContext';


export default function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [order, setOrder] = useState('asc');
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin } = useUser();

    let { openAlertLink } = location.state || {};
    const [openAlert, setOpenAlert] = useState(openAlertLink);
    const [disabled, setDisabled] = useState(false);
    const { alertMessage, severity } = useAlert();

    //This gets all the players from the DB and saves their data in the players array
    useEffect(() => {
        api.get('/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                // By default, we'll show the players sorted by their winnings
                playersArr.sort((a, b) => { return b.winnings - a.winnings });
                setPlayers(playersArr);
            })
        // .catch((err) => { console.log(err) })
    }, [])
    return (
        //Move div styles to css file
        <div style={{ textAlign: 'center' }}>
            {/* Alert to show login/logout feedback. Syntax from MUI */}
            <Collapse in={openAlert}>
                <Alert severity={severity} sx={{ backgroundColor: severity == 'success' ? '#c8e6c9' : '#fdeded' }} action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    {alertMessage}
                </Alert>
            </Collapse>
            <h1>Leaderboard</h1>
            {isAdmin ? <Link to='/leaderboard/new'>Add Game</Link> : null}
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
                                    <TableCell >
                                        {/* When we click on a player's button, we want to request their info from the DB
                                        and pass it in the navigate state object for retrieval at the player's page */}
                                        <Button disabled={disabled} sx={{ textTransform: 'none' }} onClick={async () => {
                                            // Disable the button to prevent multiple clicks
                                            setDisabled(true);

                                            const link = `/players/${player._id}`;
                                            await api.get(link)
                                                .then((res) => {
                                                    navigate(link, { state: { playerData: res.data } });
                                                });
                                        }}>{`${player.firstName} ${player.lastName}`}</Button>
                                    </TableCell>
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