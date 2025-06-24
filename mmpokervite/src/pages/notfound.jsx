import { Box, Card } from '@mui/material';

export default function NotFound() {
    return (
        <Box sx={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card sx={{ width: '66%', backgroundColor: '#f7c8c9' }}>
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
                <p>Please check the URL or return to the home page.</p>
            </Card>
        </Box>
    );
}