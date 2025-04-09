import { Box, Button, Card, CardContent, FormControl, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function SignUp() {

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
        });

        console.log("Form submitted");
    }

    return (
        // Form to create a new account
        // name is used to get the value of the input field in the handleSubmit function
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
    );
};