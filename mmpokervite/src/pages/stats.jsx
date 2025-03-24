import { useEffect, useState } from 'react';
import { Box, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function Stats() {
    const [mode, setMode] = useState('most');

    const handleChange = (e, newValue) => {
        setMode(newValue);
    }

    return (
        <Box>
            <h1>Stats</h1>
            <h2>Hall of Fame</h2>
            <h2>GOAT of all time: Moi</h2>

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

            <p>Categories:
                Most Wins
                Most Times In the Money
                Most Profit
                Most Times On The Bubble
                Most Games Played
                Most Rebuys
                Most Add Ons ($)
                Best Average Profit
            </p>
        </Box>

    )
}