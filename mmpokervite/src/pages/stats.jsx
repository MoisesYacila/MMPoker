import { useEffect, useState } from 'react';
import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function Stats() {
    const [mode, setMode] = useState('most');

    // We will toggle the hide class to only show one of the two categories of stats
    const handleChange = (e, newValue) => {
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
            <Box className='total-stats' sx={{ display: 'flex', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {/* From Material UI */}
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Games Played
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Wins
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Profit
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most In The Money
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most On The Bubble
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Rebuys
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ margin: '1rem 1rem', width: '25%' }}>
                    <CardContent>
                        <Typography variant='h5' component='div' align='center'>
                            Most Add Ons ($)
                        </Typography>
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