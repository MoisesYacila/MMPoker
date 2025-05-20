import { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAlert } from '../AlertContext';

export default function NewGame() {
    const [players, setPlayers] = useState([]);
    const [numPlayers, setNumPlayers] = useState(5);
    const [rows, setRows] = useState(Array(5));
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const { setAlertMessage, setSeverity } = useAlert();

    //Gets the players from DB and adds the data to players array
    useEffect(() => {
        axios.get('http://localhost:8080/players')
            .then((res) => {
                let playersArr = [];
                res.data.forEach(player => playersArr.push(player));
                setPlayers(playersArr);
            })
    }, []);

    //WILL DO THIS AT A LATER TIME
    // const handlePlayerSelectChange = (event, child) => {
    // console.log(event);
    //When we select a player, we want the player to own the current row, and disappear from the other selects
    // }

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
                itm: e.target[(i * 14) + 4].value,
                otb: e.target[(i * 14) + 6].value,
                bounties: e.target[(i * 14) + 8].value,
                rebuys: e.target[(i * 14) + 10].value,
                addOns: e.target[(i * 14) + 12].value
            })

            //Update the original prize pool to reflect add ons and rebuys
            prizePool += parseInt(gameData[i].addOns) + parseInt(gameData[i].rebuys * 20);
        }

        console.log(prizePool);

        //Send patch request and send the data to the server side
        await axios.patch("http://localhost:8080/players", { data: gameData }, { withCredentials: true })
            .then((response) => {
                setSubmitted(true); //to know when to redirect
                console.log(response);
            }).catch((error) => {
                console.log(error);
                navigate(`/login`, { state: { message: 'Must be signed in to create a game.', openAlertLink: true } });
            });

        //Send post request to create a the new game
        await axios.post('http://localhost:8080/games', {
            data: gameData,
            numPlayers: numPlayers,
            prizePool: prizePool
        }, { withCredentials: true })
            .then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error);
                if (error.status === 401) {
                    navigate(`/login`, { state: { message: 'Must be signed in to create a game.', openAlertLink: true } });
                }
                else if (error.status === 403) {
                    setAlertMessage('You do not have permission to create a game.');
                    setSeverity('error');
                    navigate(`/leaderboard`, { state: { openAlertLink: true } });
                }

            });
    }

    //Submit handler for the form
    const handleSubmit = async (e) => {
        //Prevents res.send response on server side
        e.preventDefault();
        await updatePlayers(e);
    }

    function buildRows(num) {
        for (let i = 0; i < num; i++) {
            rows[i] = <TableRow key={i + 1}>
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="center">
                    <TextField select
                        defaultValue='-1' id={`${i + 1}`} name={`player-${i}`}>
                        <MenuItem value='-1'>Select a player</MenuItem>
                        {players.map((player, i) => {
                            return (
                                <MenuItem key={i + 1} value={player._id}>{player.name}</MenuItem>
                            )
                        })}
                    </TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField name="earnings" sx={{ width: '35%' }}></TextField>
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
                    <TextField name="bounties" defaultValue={0} sx={{ width: '35%' }}></TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField name="rebuys" defaultValue={0} sx={{ width: '35%' }}></TextField>
                </TableCell>
                <TableCell align="center">
                    <TextField name="addOns" defaultValue={0} sx={{ width: '35%' }}></TextField>
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
        buildRows(num);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
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
                <Button variant="contained" type="submit"
                    sx={{ width: '8%', marginBottom: '1rem' }}
                >
                    Add Game
                </Button>
            </Box>
            {/* When submitted, redirect back to the leaderboard page */}
            {submitted ? <Navigate to='/leaderboard' replace={true} /> : null}
        </Box>
    )
}