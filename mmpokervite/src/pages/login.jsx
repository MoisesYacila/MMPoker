import { useState } from 'react';
import {
    Box, Button, Card, CardContent, 
    TextField, Typography, Collapse, Alert, IconButton
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext'
import { useAlert } from '../AlertContext';

export default function LogIn() {
    const navigate = useNavigate();
    const location = useLocation();
    // Get the error message from the previous page or an empty object if not available
    let { message, openAlertLink } = location.state || {};
    const [openAlert, setOpenAlert] = useState(false);
    const [openAlert2, setOpenAlert2] = useState(openAlertLink);
    const { setLoggedIn } = useUser();
    const { setAlertMessage } = useAlert();

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
            setLoggedIn(true);
            // Redirect to the leaderboard page after successful login
            setAlertMessage('Welcome');
            navigate('/leaderboard', { state: { openAlertLink: true } });
        }).catch(err => {
            console.error('Login failed:', err.response?.data || err.message);
            // Show alert if login fails
            setOpenAlert(true);
        });

    }

    return (
        <div>
            {/* Alert to show if login fails. Syntax from MUI */}
            <Collapse in={openAlert}>
                <Alert severity='error' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    Invalid credentials. Please check your username and password.
                </Alert>
            </Collapse>
            <Collapse in={openAlert2}>
                <Alert severity='error' action={
                    <IconButton onClick={() => {
                        setOpenAlert2(false);
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    {message}
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
                        <Button type="sumbit" variant="contained" sx={{ marginBottom: '1rem', width: '80%' }}>Log In</Button>
                        <Typography sx={{ marginBottom: '1rem' }}>New to MMPoker? <Link to='/signup'>Create Account</Link> </Typography>
                    </CardContent>
                </Card>
            </Box>
        </div>


    )
}