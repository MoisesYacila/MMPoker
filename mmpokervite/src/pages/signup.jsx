import { useState } from 'react';
import {
    Box, Button, Card, CardContent,
    TextField, Typography, Collapse, Alert, IconButton
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { useUser } from '../UserContext';

export default function SignUp() {
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();
    const { setLoggedIn } = useUser();

    const handleSubmit = (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Post request to the server with form data
        axios.post('http://localhost:8080/signup', {
            email: e.target.email.value,
            username: e.target.username.value,
            firstName: e.target.first.value,
            lastName: e.target.last.value,
            password: e.target.password.value
        }, { withCredentials: true }).then((res) => {
            console.log(res.data);
            setLoggedIn(true);
            navigate('/leaderboard');
        }).catch(err => {
            console.error('Sign up failed:', err.response?.data || err.message);
            // Show alert if signup fails
            setOpenAlert(true);
        });

        console.log("Form submitted");
    }

    return (
        <div>
            {/* Alert to show if signup fails. Syntax from MUI */}
            <Collapse in={openAlert}>
                <Alert severity='error' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    Unable to sign up. A user with the given username or email is already registered.
                </Alert>
            </Collapse>
            {/* Form to create a new account
            name is used to get the value of the input field in the handleSubmit function */}
            <Box component='form'
                action='http://localhost:8080/signup'
                method='POST'
                onSubmit={handleSubmit}
                sx={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
                <Card sx={{ width: '30%', textAlign: 'center', height: '65vh' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Typography sx={{ marginBottom: '1rem', fontWeight: 'bold' }} variant="h5">Create your MMPoker account</Typography>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            label='Email' variant="outlined" type="email" name="email"></TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            label='Username' variant="outlined" name="username"></TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            label='First Name' variant="outlined" name="first"></TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            label='Last Name' variant="outlined" name="last"></TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            label='Password' variant="outlined" type="password" name="password"></TextField>
                        <Button type="submit" variant="contained" sx={{ marginBottom: '1rem', width: '80%' }}>Create account</Button>
                        <Typography sx={{ marginBottom: '1rem' }}>Already have an account? <Link to='/login'>Log in</Link> </Typography>
                    </CardContent>
                </Card>
            </Box>
        </div>

    );
}