import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button,
    Collapse, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
    TextField
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from '../UserContext';

export default function Account() {
    const { id } = useUser();
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        fullName: ''
    });
    const [accountData, setAccountData] = useState({});
    const [tempAccountData, setTempAccountData] = useState({});
    const [validationErrors, setValidationErrors] = useState({
        // No errors initially
        username: false,
        email: {
            isTaken: false,
            isGoogle: false,
            invalidFormat: false
        },
        fullName: false
    });

    // Fetching account data using the user ID from the UserContext
    useEffect(() => {
        axios.get(`http://localhost:8080/accounts/${id}`, { withCredentials: true })
            .then((res) => {
                console.log('Account data:', res.data);
                setAccountData({ ...res.data, usernameChanged: false, emailChanged: false, fullNameChanged: false });

                // Check if the account is linked to Google
                if (res.data.googleId) {
                    setValidationErrors({
                        ...validationErrors,
                        email: { ...validationErrors.email, isGoogle: true }
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching account data:', error);
            });
    }, [id]);

    // Get the appropriate helper text for the email field
    const getEmailHelperText = () => {
        if (validationErrors.email.isGoogle) {
            return 'Email linked to Google account. Unable to change.';
        } else if (validationErrors.email.isTaken) {
            return 'Email is already taken.';
        } else if (validationErrors.email.invalidFormat) {
            return 'Enter a valid email address.';
        }
        else {
            return '';
        }
    }

    const isValidEmail = (email) => {
        // RegEx to check if the input is a valid email format
        let trimmedEmail = email.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    }

    const disableButton = () => {
        // Disable if there are any validation errors or if all fields are empty
        let allEmpty = form.username.trim() === '' && form.email.trim() === '' && form.fullName.trim() === '';
        return (validationErrors.username || validationErrors.fullName || validationErrors.email.isTaken || allEmpty);
    }

    const validateName = (name) => {
        // RegEx to check if the input is a valid name, it checks for letters, accents, apostrophes, and hyphens
        let trimmedName = name.trim();
        return /^[A-Za-zÀ-ÿ' -]+$/.test(trimmedName) && trimmedName.length >= 5 && trimmedName.length <= 40;
    }

    return (
        <div>
            <Collapse in={openAlert}>
                <Alert severity='success' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    Account updated successfully.
                </Alert>
            </Collapse>
            <Box sx={{ textAlign: 'center', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Account</h1>
                <h2>Settings</h2>

                {/* Accordion components to display account settings */}
                {/* MUI Syntax */}
                <Accordion sx={{ width: '50%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Profile Info
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>Username: {accountData.username}</p>
                        <p>Email: {accountData.email}</p>
                        <p>Full Name: {accountData.fullName}</p>
                        <p>Admin: {accountData.admin ? 'Yes' : 'No'}</p>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: '50%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Preferences
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>Language: English</p>
                        <p>Theme: Light</p>
                        <p>Currency: USD</p>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: '50%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        League Management
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>Current League: Moi&apos;s Poker Nights</p>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: '50%' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Edit Profile
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* Form to edit account details */}
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <TextField
                                label="New Username"
                                variant="outlined"
                                name="username"
                                value={form.username}
                                // Using onBlur to validate when the user leaves the input field
                                // Makes less API calls than onChange
                                onBlur={async (e) => {
                                    if (e.target.value.trim() !== '') {
                                        // If any field has been changed, use tempAccountData to keep track of changes
                                        // Otherwise, use accountData
                                        if (tempAccountData?.usernameChanged || tempAccountData?.emailChanged || tempAccountData?.fullNameChanged)
                                            setTempAccountData({ ...tempAccountData, username: e.target.value.trim(), usernameChanged: true })
                                        else
                                            setTempAccountData({ ...accountData, username: e.target.value.trim(), usernameChanged: true })

                                        // Validate username uniqueness
                                        // In a GET request, we must send data as params
                                        // We send the entire account data along with the new username to exclude the current user's username from the check 
                                        // and when we get the response back, we only update the username error state
                                        await axios.get(`http://localhost:8080/accounts/validateData/`, { params: { ...accountData, username: e.target.value.trim() }, withCredentials: true })
                                            .then((res) => {
                                                console.log('Username validation response:', res.data);
                                                setValidationErrors({ ...validationErrors, username: res.data.isUsernameTaken });
                                            })
                                            .catch((error) => {
                                                console.error('Error validating username:', error);
                                            });
                                    }
                                    else {
                                        // If the input is empty, reset the tempAccountData for username
                                        setTempAccountData({ ...tempAccountData, username: '', usernameChanged: false });
                                    }
                                }}
                                onChange={(e) => {
                                    // Clear username error when user starts typing and update form state
                                    setValidationErrors({ ...validationErrors, username: false });
                                    setForm({ ...form, username: e.target.value });
                                }}
                                error={validationErrors.username}
                                helperText={validationErrors.username ? 'Username is already taken.' : ''}
                                sx={{ width: '40%', marginBottom: '1rem' }}
                            />
                            <TextField
                                label="New Email"
                                variant="outlined"
                                name="email"
                                type='email'
                                value={form.email}
                                disabled={validationErrors.email.isGoogle} // Disable if it's a Google account

                                // Same logic as username field
                                onBlur={async (e) => {
                                    if (e.target.value.trim() !== '') {
                                        // If the email format is invalid, set the error and return early
                                        if (!isValidEmail(e.target.value)) {
                                            setValidationErrors({ ...validationErrors, email: { ...validationErrors.email, invalidFormat: true } });
                                            return;
                                        }
                                        if (tempAccountData?.usernameChanged || tempAccountData?.emailChanged || tempAccountData?.fullNameChanged)
                                            setTempAccountData({ ...tempAccountData, email: e.target.value.trim(), emailChanged: true })
                                        else
                                            setTempAccountData({ ...accountData, email: e.target.value.trim(), emailChanged: true })

                                        await axios.get(`http://localhost:8080/accounts/validateData/`, { params: { ...accountData, email: e.target.value.trim() }, withCredentials: true })
                                            .then((res) => {
                                                console.log('Email validation response:', res.data);
                                                setValidationErrors({ ...validationErrors, email: { ...validationErrors.email, isTaken: res.data.isEmailTaken } });
                                            })
                                            .catch((error) => {
                                                console.error('Error validating email:', error);
                                            });
                                    }
                                    else {
                                        setTempAccountData({ ...tempAccountData, email: '', emailChanged: false });
                                    }
                                }}
                                onChange={(e) => {
                                    setValidationErrors({ ...validationErrors, email: false });
                                    setForm({ ...form, email: e.target.value });
                                }}
                                error={validationErrors.email.isTaken || validationErrors.email.invalidFormat}
                                helperText={getEmailHelperText()}
                                sx={{ width: '40%', marginBottom: '1rem' }}
                            />
                            <TextField
                                label="New Full Name"
                                variant="outlined"
                                name="fullName"
                                value={form.fullName}
                                // Same logic as username and email fields except we don't need to check uniqueness
                                onBlur={(e) => {
                                    if (e.target.value.trim() !== '') {
                                        if (validateName(e.target.value)) {
                                            setValidationErrors({ ...validationErrors, fullName: false });

                                            if (tempAccountData?.usernameChanged || tempAccountData?.emailChanged || tempAccountData?.fullNameChanged)
                                                setTempAccountData({ ...tempAccountData, fullName: e.target.value.trim(), fullNameChanged: true })
                                            else
                                                setTempAccountData({ ...accountData, fullName: e.target.value.trim(), fullNameChanged: true })
                                        }
                                        else {
                                            setValidationErrors({ ...validationErrors, fullName: true });
                                        }
                                    }
                                    else {
                                        setTempAccountData({ ...tempAccountData, fullName: '', fullNameChanged: false });
                                    }
                                }}
                                onChange={(e) => {
                                    setValidationErrors({ ...validationErrors, fullName: false });
                                    setForm({ ...form, fullName: e.target.value });
                                }}
                                error={validationErrors.fullName}
                                helperText={validationErrors.fullName ? 'Enter a valid name with at least 5 characters.' : ''}
                                sx={{ width: '40%', marginBottom: '1rem' }}
                            />
                            <div>
                                {/* Disable the button if there are any errors in the validation */}
                                <Button variant="contained" sx={{ marginRight: '1rem' }} disabled={disableButton()}
                                    onClick={() => {
                                        // Open the dialog to confirm changes
                                        setOpenDialog(true);
                                        console.log('Temp Account Data:', tempAccountData);
                                    }}>
                                    Save Changes
                                </Button>
                            </div>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Button variant='contained' sx={{ marginTop: '1rem' }}>
                    Log Out
                </Button>
                <Button variant='contained' sx={{ marginTop: '1rem', marginBottom: '1.5rem' }} color='error'>
                    Delete Account
                </Button>

                {/* Dialog to confirm account changes */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Verify account changes</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to apply these changes to your account?</p>
                        <ul>
                            {tempAccountData.usernameChanged ? <li>New Username: {tempAccountData.username}</li> : ''}
                            {tempAccountData.emailChanged ? <li>New Email: {tempAccountData.email}</li> : ''}
                            {tempAccountData.fullNameChanged ? <li>New Full Name: {tempAccountData.fullName}</li> : ''}
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button loading={submitted} onClick={async () => {
                            setSubmitted(true);
                            // Send the info to the backend to update the account
                            await axios.patch(`http://localhost:8080/accounts/${id}`, { ...tempAccountData }, { withCredentials: true })
                                .then((res) => {
                                    console.log('Account updated successfully:', res.data);
                                    // Update the account data with the new info and reset the form and temp data
                                    setAccountData(res.data);
                                    setForm({ username: '', email: '', fullName: '' });
                                    setTempAccountData({});
                                    setSubmitted(false);
                                    setOpenAlert(true);
                                }
                                ).catch((err) => {
                                    console.error('Error updating account:', err);
                                    setSubmitted(false);
                                });
                            setOpenDialog(false);
                        }}>Confirm</Button>
                        <Button disabled={submitted} onClick={() => setOpenDialog(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    )
}