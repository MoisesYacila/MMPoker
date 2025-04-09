import { Box, Button, Card, CardContent, FormControl, TextField, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

export default function LogIn() {
    return (
        <Box component='form' sx={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <Card sx={{ width: '30%', textAlign: 'center', height: '40vh' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Typography sx={{ marginBottom: '1rem', fontWeight: 'bold' }} variant="h4">Log in</Typography>
                    <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                        label='Email' variant="outlined" type="email"></TextField>
                    <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                        label='Password' variant="outlined" type="password"></TextField>
                    <Button variant="contained" sx={{ marginBottom: '1rem', width: '80%' }}>Sign In</Button>
                    <Typography sx={{ marginBottom: '1rem' }}>New to MMPoker? <Link to='/signup'>Create Account</Link> </Typography>
                </CardContent>
            </Card>
        </Box>

    )
}