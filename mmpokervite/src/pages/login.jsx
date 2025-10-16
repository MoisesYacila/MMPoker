import { useState } from 'react';
import {
    Box, Button, Card, CardContent,
    TextField, Typography, Collapse, Alert, IconButton
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import GoogleIcon from '@mui/icons-material/Google';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'
import { useAlert } from '../AlertContext';

export default function LogIn() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const { setLoggedIn, setIsAdmin, setId, setUserFullName, setUsername } = useUser();
    const { alert, setAlert } = useAlert();

    const handleSubmit = (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Prevent multiple submissions
        if (submitted) return;
        setSubmitted(true);

        // Post request to the server with form data
        api.post('/login', {
            username: e.target.username.value,
            password: e.target.password.value
        }).then((res) => {
            console.log(res.data);
            setLoggedIn(true);
            setIsAdmin(res.data.user.isAdmin);
            setId(res.data.user.id);
            setUsername(res.data.user.username);
            setUserFullName(res.data.user.fullName || '');

            // Redirect to the leaderboard page after successful login
            setAlert({ message: 'Welcome', severity: 'success', open: true });
            navigate('/leaderboard');
        }).catch(err => {
            console.error('Login failed:', err.response?.data || err.message);
            // Show alert if login fails
            setAlert({ message: 'Invalid credentials. Please check your username and password.', severity: 'error', open: true });
            // Reset submitted state on error
            setSubmitted(false);
        });

    }

    // Call to the backend to initiate Google login
    // This will redirect the user to the Google login page
    const handleGoogleLogin = () => {
        // Prevent multiple submissions
        if (submitted) return;
        setSubmitted(true);

        // We cannot use axios here because Google login requires a pure redirect
        window.location.href = "http://localhost:8080/auth/google";
    }

    return (
        <div>
            {/* Alert to show if login fails. Syntax from MUI */}
            <Collapse in={alert.open}>
                <Alert severity={alert.severity} action={
                    <IconButton onClick={() => {
                        setAlert({ ...alert, open: false });
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    {alert.message}
                </Alert>
            </Collapse>
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
                        <Button loading={submitted} loadingPosition='start' type="sumbit" variant="contained" sx={{ marginBottom: '1rem', width: '80%' }}>Log In</Button>
                        <Button loading={submitted} loadingPosition='start' variant='outlined' onClick={handleGoogleLogin}
                            sx={{ display: 'flex', marginBottom: '1rem', width: '80%' }}>
                            <GoogleIcon sx={{ marginRight: '1rem' }}></GoogleIcon>Log In with Google
                        </Button>
                        <Typography sx={{ marginBottom: '1rem' }}>New to MMPoker? <Link to='/signup' onClick={() => { setAlert({ ...alert, open: false }); }}>Create Account</Link> </Typography>
                    </CardContent>
                </Card>
            </Box>
        </div>
    )
}