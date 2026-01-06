import { useState, useEffect } from 'react';
import {
    Box, Button, Card, CardContent,
    TextField, Typography, Collapse, Alert, IconButton
} from "@mui/material";
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { useUser } from '../UserContext';
import { useAlert } from '../AlertContext';
import { isValidEmail, isValidFullName, isValidUsername, isValidPassword } from '../../../shared/validators';
import { log, errorLog } from '../utils/logger.js';

export default function SignUp() {
    const { alert, setAlert } = useAlert();
    const navigate = useNavigate();
    const { setLoggedIn, loggedIn, setIsAdmin, setId, setUserFullName } = useUser();
    const [disabled, setDisabled] = useState(false);
    // The form will be controlled, so we need to store the values in state
    const [form, setForm] = useState({ email: '', username: '', first: '', last: '', password: '' });
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
        },
        password: false
    });

    useEffect(() => {
        // If the user is already logged in, redirect to the leaderboard
        if (loggedIn) {
            setAlert({ message: 'User currently logged in.', severity: 'info', open: true });
            navigate('/leaderboard');
        }
    }, [loggedIn]);

    const handleSubmit = (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Prevent multiple submissions
        if (disabled) return;
        setDisabled(true);

        // Since the form is controlled, we can get the values from state, destructuring for convenience
        const { first, last, email, username, password } = form;
        let fullName = `${first} ${last}`;

        // Validate full name format
        if (!isValidFullName(fullName) || first.length < 2 || last.length < 2) {
            setDisabled(false);
            setAlert({ message: 'Enter a valid full name with at least 4 characters. First and last name must have a minimum length of 2.', severity: 'error', open: true });
            return;
        }

        // Post request to the server with form data
        api.post('/signup', {
            email,
            username,
            firstName: first,
            lastName: last,
            password
        }).then((res) => {
            log(res.data);
            setLoggedIn(true);
            setIsAdmin(res.data.admin);
            setId(res.data._id);
            setUserFullName(res.data.fullName || ''); // Set the user's full name if available
            setAlert({ message: 'Welcome to MMPoker.', severity: 'success', open: true });
            navigate('/leaderboard');
        }).catch(err => {
            errorLog('Sign up failed:', err.response?.data || err.message);
            // Show alert if signup fails
            setAlert({ message: 'Unable to sign up. A user with the given username or email is already registered.', severity: 'error', open: true });
        });
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
            {/* The form is controlled, meaning, every input is linked to a state variable through the value attribute */}
            <Box component='form'
                onSubmit={handleSubmit}
                sx={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
                <Card sx={{ width: { xs: '90%', sm: '70%', md: '50%', lg: '30%' }, textAlign: 'center' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingY: 3 }}>
                        <Typography sx={{ marginBottom: '1rem', fontWeight: 'bold' }} variant="h5">Create your MMPoker account</Typography>
                        {/* onBlur is a good choice because we don't need to check every time the value changes, but we can check when the user clicks away */}
                        <TextField required value={form.email} sx={{ marginBottom: '1rem', width: { xs: '100%', sm: '80%' } }} onBlur={async (e) => {
                            // Trim whitespace from email
                            const trimmedEmail = e.target.value.trim();
                            setForm(prev => ({ ...prev, email: trimmedEmail }));

                            // If the email format is invalid, set the error and return early
                            if (!isValidEmail(trimmedEmail)) {
                                setDisabled(true);
                                setValidationErrors(prev => ({ ...prev, email: { ...prev.email, invalidFormat: true } }));
                                return;
                            }

                            // Validate email uniqueness
                            // In a GET request, we must send data as params
                            // When we get the response back, we only update the email error state
                            await api.get(`/accounts/validateData/`, { params: { email: trimmedEmail } })
                                .then((res) => {
                                    log('Email validation response:', res.data);
                                    setValidationErrors(prev => ({ ...prev, email: { ...prev.email, isTaken: res.data.isEmailTaken } }));
                                    setDisabled(res.data.isEmailTaken);
                                })
                                .catch((error) => {
                                    errorLog('Error validating email:', error);
                                });
                        }}
                            // Reset email errors when user starts typing
                            onChange={(e) => {
                                setForm(prev => ({ ...prev, email: e.target.value }));
                                setValidationErrors(prev => ({ ...prev, email: { isTaken: false, invalidFormat: false } }));
                                setDisabled(false);
                            }}
                            error={validationErrors.email.isTaken || validationErrors.email.invalidFormat}
                            helperText={getEmailHelperText()}
                            label='Email' variant="outlined" type="email" name="email">
                        </TextField>
                        <TextField required value={form.username} sx={{ marginBottom: '1rem', width: { xs: '100%', sm: '80%' } }} onBlur={async (e) => {
                            // Trim whitespace from username
                            const trimmedUsername = e.target.value.trim();
                            setForm(prev => ({ ...prev, username: trimmedUsername }));

                            // If the username format is invalid, set the error and return early
                            if (!isValidUsername(trimmedUsername)) {
                                setValidationErrors(prev => ({ ...prev, username: { ...prev.username, invalidFormat: true } }));
                                setDisabled(true);
                                return;
                            }

                            // Validate username uniqueness
                            // In a GET request, we must send data as params
                            // When we get the response back, we only update the username error state
                            await api.get(`/accounts/validateData/`, { params: { username: trimmedUsername } })
                                .then((res) => {
                                    log('Username validation response:', res.data);
                                    setValidationErrors(prev => ({ ...prev, username: { ...prev.username, isTaken: res.data.isUsernameTaken } }));
                                    setDisabled(res.data.isUsernameTaken);
                                })
                                .catch((error) => {
                                    errorLog('Error validating username:', error);
                                });
                        }}
                            // Clear username error when user starts typing
                            onChange={(e) => {
                                setForm(prev => ({ ...prev, username: e.target.value }));
                                setValidationErrors(prev => ({ ...prev, username: { isTaken: false, invalidFormat: false } }));
                                setDisabled(false);
                            }}
                            error={validationErrors.username.isTaken || validationErrors.username.invalidFormat}
                            helperText={getUsernameHelperText()}
                            label='Username' variant="outlined" name="username"></TextField>
                        <TextField required value={form.first} sx={{ marginBottom: '1rem', width: { xs: '100%', sm: '80%' } }}
                            onBlur={(e) => {
                                // Trim whitespace from first name
                                const trimmedFirst = e.target.value.trim();
                                setForm(prev => ({ ...prev, first: trimmedFirst }));
                            }}
                            onChange={(e) => {
                                setForm(prev => ({ ...prev, first: e.target.value }));
                                setDisabled(false)
                            }}
                            label='First Name' variant="outlined" name="first"></TextField>
                        <TextField required value={form.last} sx={{ marginBottom: '1rem', width: { xs: '100%', sm: '80%' } }}
                            onBlur={(e) => {
                                // Trim whitespace from last name
                                const trimmedLast = e.target.value.trim();
                                setForm(prev => ({ ...prev, last: trimmedLast }));
                            }}
                            onChange={(e) => {
                                setForm(prev => ({ ...prev, last: e.target.value }));
                                setDisabled(false)
                            }}
                            label='Last Name' variant="outlined" name="last"></TextField>
                        <TextField required value={form.password} sx={{ marginBottom: '1rem', width: { xs: '100%', sm: '80%' } }}
                            label='Password' variant="outlined" type="password" name="password"
                            onBlur={(e) => {
                                // If the password format is invalid, set the error and disable the submit button
                                const isValid = isValidPassword(e.target.value);
                                setValidationErrors(prev => ({ ...prev, password: !isValid }));
                                setDisabled(!isValid);
                            }
                            }
                            // Reset password error when user starts typing
                            onChange={(e) => {
                                setForm(prev => ({ ...prev, password: e.target.value }));
                                setValidationErrors(prev => ({ ...prev, password: false }));
                                setDisabled(false);
                            }}
                            error={validationErrors.password} helperText={'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'}></TextField>
                        <Button disabled={disabled} type="submit" variant="contained" sx={{ marginBottom: '1rem', width: { xs: '100%', sm: '80%' } }}>Create account</Button>
                        <Typography sx={{ marginBottom: '1rem' }}>Already have an account? <Link to='/login' onClick={() => { setAlert({ ...alert, open: false }); }}>Log in</Link> </Typography>
                    </CardContent>
                </Card>
            </Box>
        </div>

    );
}