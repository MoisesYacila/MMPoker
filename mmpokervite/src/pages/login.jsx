import { Box, Button, Card, CardContent, FormControl, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function LogIn() {

    const handleSubmit = (e) => {
        console.log("Form submitted");
        // Prevent the default form submission behavior
        e.preventDefault();

        // Post request to the server with form data
        axios.post('http://localhost:8080/login', {
            username: e.target.username.value,
            password: e.target.password.value
        }, {
            withCredentials: true // Important for CORS validation
        }).then((res) => {
            console.log(res.data);
        }).catch(err => {
            console.error('Login failed:', err.response?.data || err.message);
        });

    }

    return (
        <Box component='form'
            action='http://localhost:8080/login'
            method='POST'
            onSubmit={handleSubmit}
            sx={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <Card sx={{ width: '30%', textAlign: 'center', height: '40vh' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Typography sx={{ marginBottom: '1rem', fontWeight: 'bold' }} variant="h4">Log in</Typography>
                    <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                        label='Username' variant="outlined" name="username"></TextField>
                    <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                        label='Password' variant="outlined" type="password" name="password"></TextField>
                    <Button type="sumbit" variant="contained" sx={{ marginBottom: '1rem', width: '80%' }}>Log In</Button>
                    <Typography sx={{ marginBottom: '1rem' }}>New to MMPoker? <Link to='/signup'>Create Account</Link> </Typography>
                </CardContent>
            </Card>
        </Box>

    )
}