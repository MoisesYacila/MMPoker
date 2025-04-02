import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography,
    List, ListItem, ListItemText, ListItemButton, Divider
} from '@mui/material';


export default function Stats() {
    const [mode, setMode] = useState('most');
    const [totalLeaders, setTotalLeaders] = useState({});
    const [averageLeaders, setAverageLeaders] = useState({});

    // We will toggle the hide class to only show one of the two categories of stats
    const handleChange = async (e, newValue) => {
        if (averageLeaders.bestAverageProfit == null) {
            await axios.get('http://localhost:8080/players/leaders/average')
                .then((res) => {
                    setAverageLeaders(res.data);
                    console.log(res.data);
                })
        }
        // Value will be null if we click on the same button multiple times
        // Toggle classes only when the value actually changes
        if (newValue != null) {
            setMode(newValue);
            const box1 = document.querySelector('.total-stats');
            const box2 = document.querySelector('.average-stats');

            // We will display only one of the two modes and hide the other by toggling the hide class on the Box elements
            box1.classList.toggle('hide');
            box2.classList.toggle('hide');
            console.log('Value is ' + newValue);
        }
    }

    useEffect(() => {
        // Get the total leaders from the DB
        async function getTotalLeaders() {
            await axios.get('http://localhost:8080/players/leaders/total')
                .then((res) => {
                    setTotalLeaders(res.data[0]);
                })
        }
        getTotalLeaders();
    }, []);

    return (
        <Box>
            <h1>Stats</h1>
            <h2>All Time Leaders</h2>

            {/* From Material UI */}
            <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleChange}
                color='primary'
                sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
                <ToggleButton sx={{ width: '40%' }} value='most'>Total Stats</ToggleButton>
                <ToggleButton sx={{ width: '40%' }} value='average'>Average Stats</ToggleButton>
            </ToggleButtonGroup>

            {/* Set of total stats */}
            {/* display: 'flex',  , flexWrap: 'wrap', justifyContent: 'space-around'  */}
            {/* , alignSelf: 'flex-start' */}
            <Box className='total-stats'>
                {/* From Material UI */}
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Games Played
                        </Typography>
                        <List>
                            {/* We might not have the data by the time the first render happens, so if we don't have anything, render null */}
                            {/* This avoids undefined error */}
                            {totalLeaders.mostGames ? totalLeaders.mostGames.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: ${player.gamesPlayed}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most On The Bubble
                        </Typography>
                        <List>
                            {totalLeaders.mostOTB ? totalLeaders.mostOTB.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: ${player.onTheBubble}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Wins
                        </Typography>
                        <List>
                            {totalLeaders.mostWins ? totalLeaders.mostWins.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: ${player.wins}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most In The Money
                        </Typography>
                        <List>
                            {totalLeaders.mostITM ? totalLeaders.mostITM.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: ${player.itmFinishes}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Bounties
                        </Typography>
                        <List>
                            {totalLeaders.mostBounties ? totalLeaders.mostBounties.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: ${player.bounties}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Profit
                        </Typography>
                        <List>
                            {totalLeaders.mostWinnings ? totalLeaders.mostWinnings.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: $${player.winnings}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Rebuys
                        </Typography>
                        <List>
                            {totalLeaders.mostRebuys ? totalLeaders.mostRebuys.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: ${player.rebuys}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='total-stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Add Ons
                        </Typography>
                        <List>
                            {totalLeaders.mostAddOns ? totalLeaders.mostAddOns.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.name}: $${player.addOns}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
            </Box>

            {/* Set of average stats. This set is hidden on load and will appear when user clicks on the average stats button */}
            <Box className='average-stats hide' sx={{ display: 'flex', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Best Average Profit
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Best In The Money %
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most On The Bubble %
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Bounties per Game
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Rebuys per Game
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Add Ons per Game ($)
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>

    )
}