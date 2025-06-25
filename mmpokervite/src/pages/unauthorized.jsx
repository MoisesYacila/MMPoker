import { Box, Card } from '@mui/material';

export default function Unauthorized() {
    return (
        <Box sx={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card sx={{ width: '66%', backgroundColor: '#f7c8c9' }}>
                <h1>403 - Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
                <p>Please check the URL or return to the home page.</p>
            </Card>
        </Box>
    );
}