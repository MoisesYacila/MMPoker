import { Box, Card } from '@mui/material';

export default function ServerDown() {
    return (
        <Box sx={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card sx={{ width: '66%', backgroundColor: '#f7c8c9' }}>
                <h1>503 - Service Unavailable</h1>
                <p>Oh no. The dealer&apos;s taking a break. </p>
                <p>Our server is down. Please try again later.</p>
            </Card>
        </Box>
    );
}