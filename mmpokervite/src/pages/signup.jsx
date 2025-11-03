import { useState } from 'react';
import {
    Box, Button, Card, CardContent,
    TextField, Typography, Collapse, Alert, IconButton
} from "@mui/material";
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { useUser } from '../UserContext';
import { useAlert } from '../AlertContext';
import { isValidEmail, isValidFullName, isValidUsername } from '../../../shared/validators';

export default function SignUp() {
    const { alert, setAlert } = useAlert();
    const navigate = useNavigate();
    const { setLoggedIn, setIsAdmin, setId, setUserFullName } = useUser();
    const [disabled, setDisabled] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        // No errors initially
        username: {
            isTaken: false,
            invalidFormat: false
        }
        ,
        email: {
            isTaken: false,
            invalidFormat: false
        }
    });

    const handleSubmit = (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Prevent multiple submissions
        if (disabled) return;
        setDisabled(true);

        let first = e.target.first.value.trim();
        let last = e.target.last.value.trim();
        let fullName = `${first} ${last}`;

        // Validate full name format
        if (!isValidFullName(fullName) || first.length < 2 || last.length < 2) {
            setDisabled(false);
            setAlert({ message: 'Enter a valid full name with at least 4 characters.', severity: 'error', open: true });
            return;
        }

        // Post request to the server with form data
        api.post('/signup', {
            email: e.target.email.value,
            username: e.target.username.value,
            firstName: e.target.first.value,
            lastName: e.target.last.value,
            password: e.target.password.value
        }).then((res) => {
            console.log(res.data);
            setLoggedIn(true);
            setIsAdmin(res.data.admin);
            setId(res.data._id);
            setUserFullName(res.data.fullName || ''); // Set the user's full name if available
            setAlert({ message: 'Welcome to MMPoker.', severity: 'success', open: true });
            navigate('/leaderboard');
        }).catch(err => {
            console.error('Sign up failed:', err.response?.data || err.message);
            // Show alert if signup fails
            setAlert({ message: 'Unable to sign up. A user with the given username or email is already registered.', severity: 'error', open: true });
        });
        console.log("Form submitted");
    }

    // Get the appropriate helper text for the email and username
    const getEmailHelperText = () => {
        if (validationErrors.email.isTaken) {
            return 'Email is already taken.';
        } else if (validationErrors.email.invalidFormat) {
            return 'Enter a valid email address.';
        }
        else {
            return '';
        }
    }
    const getUsernameHelperText = () => {
        if (validationErrors.username.isTaken) {
            return 'Username is already taken.';
        } else if (validationErrors.username.invalidFormat) {
            return 'Username must be 3-30 characters, alphanumeric characters or  _ - . allowed.';
        }
        else {
            return '';
        }
    }

    return (
        <div>
            {/* Alert to show if signup fails. Syntax from MUI */}
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
                        {/* onBlur is a good choice because we don't need to check every time the value changes, but we can check when the user clicks away */}
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }} onBlur={async (e) => {
                            // If the email format is invalid, set the error and return early
                            if (!isValidEmail(e.target.value)) {
                                setDisabled(true);
                                setValidationErrors({ ...validationErrors, email: { ...validationErrors.email, invalidFormat: true } });
                                return;
                            }

                            // Validate email uniqueness
                            // In a GET request, we must send data as params
                            // When we get the response back, we only update the email error state
                            await api.get(`/accounts/validateData/`, { params: { email: e.target.value.trim() } })
                                .then((res) => {
                                    console.log('Email validation response:', res.data);
                                    setValidationErrors({ ...validationErrors, email: { ...validationErrors.email, isTaken: res.data.isEmailTaken } });
                                    setDisabled(res.data.isEmailTaken);
                                })
                                .catch((error) => {
                                    console.error('Error validating email:', error);
                                });
                        }}
                            // Reset email errors when user starts typing
                            onChange={() => {
                                setValidationErrors({ ...validationErrors, email: { isTaken: false, invalidFormat: false } });
                                setDisabled(false);
                            }}
                            error={validationErrors.email.isTaken || validationErrors.email.invalidFormat}
                            helperText={getEmailHelperText()}
                            label='Email' variant="outlined" type="email" name="email">
                        </TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }} onBlur={async (e) => {
                            // If the username format is invalid, set the error and return early
                            if (!isValidUsername(e.target.value)) {
                                setValidationErrors({ ...validationErrors, username: { ...validationErrors.username, invalidFormat: true } });
                                setDisabled(true);
                                return;
                            }

                            // Validate username uniqueness
                            // In a GET request, we must send data as params
                            // When we get the response back, we only update the username error state
                            await api.get(`/accounts/validateData/`, { params: { username: e.target.value.trim() } })
                                .then((res) => {
                                    console.log('Username validation response:', res.data);
                                    setValidationErrors({ ...validationErrors, username: { ...validationErrors.username, isTaken: res.data.isUsernameTaken } });
                                    setDisabled(res.data.isUsernameTaken);
                                })
                                .catch((error) => {
                                    console.error('Error validating username:', error);
                                });
                        }}
                            // Clear username error when user starts typing
                            onChange={() => {
                                setValidationErrors({ ...validationErrors, username: { isTaken: false, invalidFormat: false } });
                                setDisabled(false);
                            }}
                            error={validationErrors.username.isTaken || validationErrors.username.invalidFormat}
                            helperText={getUsernameHelperText()}
                            label='Username' variant="outlined" name="username"></TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            onChange={() => { setDisabled(false) }}
                            label='First Name' variant="outlined" name="first"></TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            onChange={() => { setDisabled(false) }}
                            label='Last Name' variant="outlined" name="last"></TextField>
                        <TextField required sx={{ marginBottom: '1rem', width: '80%' }}
                            label='Password' variant="outlined" type="password" name="password"></TextField>
                        <Button disabled={disabled} type="submit" variant="contained" sx={{ marginBottom: '1rem', width: '80%' }}>Create account</Button>
                        <Typography sx={{ marginBottom: '1rem' }}>Already have an account? <Link to='/login' onClick={() => { setAlert({ ...alert, open: false }); }}>Log in</Link> </Typography>
                    </CardContent>
                </Card>
            </Box>
        </div>

    );
}