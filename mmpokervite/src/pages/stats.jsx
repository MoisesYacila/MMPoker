import api from '../api/axios';
import { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, CircularProgress, ToggleButton, ToggleButtonGroup, Typography,
    List, ListItem, ListItemText, ListItemButton
} from '@mui/material';
import { errorLog } from '../utils/logger.js';


export default function Stats() {
    const [mode, setMode] = useState('most');
    const [totalLeaders, setTotalLeaders] = useState({});
    const [averageLeaders, setAverageLeaders] = useState({});
    const [loading, setLoading] = useState(true);

    // Handle toggle button change
    const handleChange = async (e, newValue) => {
        // If newValue is null, do nothing, as that means the user clicked the already selected button
        if (newValue == null) return;

        // Fetch average leaders when switching to average mode (load once)
        if (newValue === 'average' && !averageLeaders.bestAvgProfit) {
            // Reset loading state to show loading spinner
            setLoading(true);
            await api.get('/players/leaders/average')
                .then((res) => {
                    // The aggregation returns an array with a single object containing the data
                    // If there is no data, the object will contain empty arrays
                    setAverageLeaders(res.data[0]);
                    setLoading(false);
                })
                .catch((err) => {
                   errorLog('Failed fetching average leaders', err); 
                });
        }
        setMode(newValue);
    }

    // This function will format the numbers to be either an integer or a float with 2 decimal points to show on the page
    const formatNum = (num) => {
        return Number.isInteger(num) ? num : num.toFixed(2);
    }

    useEffect(() => {
        // Get the total leaders from the DB
        async function getTotalLeaders() {
            await api.get('/players/leaders/total')
                .then((res) => {
                    // The aggregation returns an array with a single object containing the data
                    // If there is no data, the object will contain empty arrays
                    setTotalLeaders(res.data[0]);
                    setLoading(false);
                })
                .catch((err) => {
                    errorLog('Failed fetching total leaders', err);
                });
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

            {/* Show this text when there is no data to show. We can tell if the length of any of the inner arrays is 0, or if we don't have the properties in the object */}
            {mode === 'most' && (!totalLeaders.mostGames || totalLeaders.mostGames.length === 0) && !loading ? <Typography variant='h5' sx={{ marginTop: '2rem', textAlign: 'center' }}>No data to show. Global stats will appear here.</Typography> : null}
            {/* sx for masonry style layout */}
            { mode === 'most' && totalLeaders.mostGames?.length > 0 ? <Box className='total-stats' sx={{ marginTop: '2rem', columnCount: { sm: 1, md: 2, lg: 3, xl: 4 }, marginX: '1rem' }}>
                {/* From Material UI */}
                <Card className='stats-card'>
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
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${player.gamesPlayed}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most On The Bubble
                        </Typography>
                        <List>
                            {totalLeaders.mostOTB ? totalLeaders.mostOTB.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${player.onTheBubble}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Wins
                        </Typography>
                        <List>
                            {totalLeaders.mostWins ? totalLeaders.mostWins.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${player.wins}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most In The Money
                        </Typography>
                        <List>
                            {totalLeaders.mostITM ? totalLeaders.mostITM.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${player.itmFinishes}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Bounties
                        </Typography>
                        <List>
                            {totalLeaders.mostBounties ? totalLeaders.mostBounties.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${player.bounties}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Profit
                        </Typography>
                        <List>
                            {totalLeaders.mostWinnings ? totalLeaders.mostWinnings.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: $${player.winnings}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Rebuys
                        </Typography>
                        <List>
                            {totalLeaders.mostRebuys ? totalLeaders.mostRebuys.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${player.rebuys}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Add Ons
                        </Typography>
                        <List>
                            {totalLeaders.mostAddOns ? totalLeaders.mostAddOns.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: $${player.addOns}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
            </Box> : null}


            {loading ? <Box sx={{ textAlign: 'center' }}>
                <CircularProgress sx={{ marginTop: '2rem' }} />
            </Box> : null}
            {/* Show this text when there is no data to show. We can tell if the length of any of the inner arrays is 0, or if we don't have the properties in the object */}
            {mode === 'average' && (!averageLeaders.bestAvgProfit || averageLeaders.bestAvgProfit.length === 0) && !loading ? <Typography variant='h5' sx={{ marginTop: '2rem', textAlign: 'center' }}>No data to show. Average stats will appear here.</Typography> : null}
            {/* sx for masonry style layout */}
            {mode === 'average' && averageLeaders.bestAvgProfit?.length > 0 ? <Box className='average-stats' sx={{ marginTop: '2rem', columnCount: { sm: 1, md: 2, lg: 3 }, marginX: '1rem' }} >
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Best Average Profit
                        </Typography>
                        <List>
                            {/* We might not have the data by the time the first render happens, so if we don't have anything, render null */}
                            {/* This avoids undefined error */}
                            {averageLeaders.bestAvgProfit ? averageLeaders.bestAvgProfit.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: $${formatNum(player.avgProfit)}`} />
                                    </ListItemButton>
                                </ListItem>)
                            })
                                : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Best In The Money %
                        </Typography>
                        <List>
                            {averageLeaders.bestITM ? averageLeaders.bestITM.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${formatNum(player.itmPercentage * 100)}%`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most On The Bubble %
                        </Typography>
                        <List>
                            {averageLeaders.mostOTB ? averageLeaders.mostOTB.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${formatNum(player.otbPercentage * 100)}%`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Bounties per Game
                        </Typography>
                        <List>
                            {averageLeaders.mostAvgBounties ? averageLeaders.mostAvgBounties.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${formatNum(player.avgBounties)}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Rebuys per Game
                        </Typography>
                        <List>
                            {averageLeaders.mostAvgRebuys ? averageLeaders.mostAvgRebuys.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: ${formatNum(player.avgRebuys)}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
                <Card className='stats-card'>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Add Ons per Game
                        </Typography>
                        <List>
                            {averageLeaders.mostAvgAddOns ? averageLeaders.mostAvgAddOns.map((player, i) => {
                                return (<ListItem disablePadding key={i}>
                                    <ListItemButton>
                                        <ListItemText sx={{ textAlign: 'center' }} primary={`1st. ${player.firstName} ${player.lastName}: $${formatNum(player.avgAddOns)}`} />
                                    </ListItemButton>
                                </ListItem>)
                            }) : null
                            }
                        </List>
                    </CardContent>
                </Card>
            </Box> : null}
            
        </Box>

    )
}