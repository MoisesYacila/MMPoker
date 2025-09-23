import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from '../UserContext';

export default function Account() {
    const { id } = useUser();
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [accountData, setAccountData] = useState({});
    const [tempAccountData, setTempAccountData] = useState({});
    const [validationErrors, setValidationErrors] = useState({
        // No errors initially
        username: false,
        email: {
            isTaken: false,
            isGoogle: false
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
        } else {
            return '';
        }
    }

    const validateName = (name) => {
        // RegEx to check if the input is a valid name, it checks for letters, accents, apostrophes, and hyphens
        let trimmedName = name.trim();
        return /^[A-Za-zÀ-ÿ' -]+$/.test(trimmedName) && trimmedName.length >= 5 && trimmedName.length <= 40;
    }

    return (
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
                            // Using onBlur to validate when the user leaves the input field
                            // Makes less API calls than onChange
                            onBlur={async (e) => {
                                if (e.target.value.trim() !== '') {
                                    console.log('Username changed to:', e.target.value);

                                    // If any field has been changed, use tempAccountData to keep track of changes
                                    // Otherwise, use accountData
                                    if (tempAccountData?.usernameChanged || tempAccountData?.emailChanged || tempAccountData?.fullNameChanged)
                                        setTempAccountData({ ...tempAccountData, username: e.target.value, usernameChanged: true })
                                    else
                                        setTempAccountData({ ...accountData, username: e.target.value, usernameChanged: true })

                                    // Validate username uniqueness
                                    // In a GET request, we must send data as params
                                    await axios.get(`http://localhost:8080/accounts/validateData/`, { params: { ...accountData, username: e.target.value }, withCredentials: true })
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
                            onChange={() => {
                                // Clear username error when user starts typing
                                setValidationErrors({ ...validationErrors, username: false });
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
                            disabled={validationErrors.email.isGoogle} // Disable if it's a Google account

                            // Same logic as username field
                            onBlur={async (e) => {
                                if (e.target.value.trim() !== '') {
                                    console.log('Email changed to:', e.target.value);

                                    if (tempAccountData?.usernameChanged || tempAccountData?.emailChanged || tempAccountData?.fullNameChanged)
                                        setTempAccountData({ ...tempAccountData, email: e.target.value, emailChanged: true })
                                    else
                                        setTempAccountData({ ...accountData, email: e.target.value, emailChanged: true })

                                    await axios.get(`http://localhost:8080/accounts/validateData/`, { params: { ...accountData, email: e.target.value }, withCredentials: true })
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
                            onChange={() => { setValidationErrors({ ...validationErrors, email: false }); }}
                            error={validationErrors.email.isTaken}
                            helperText={getEmailHelperText()}
                            sx={{ width: '40%', marginBottom: '1rem' }}
                        />
                        <TextField
                            label="New Full Name"
                            variant="outlined"
                            name="fullName"

                            // Same logic as username and email fields except we don't need to check uniqueness
                            onBlur={(e) => {
                                if (e.target.value.trim() !== '') {
                                    if (validateName(e.target.value)) {
                                        setValidationErrors({ ...validationErrors, fullName: false });
                                        console.log('Full Name changed to:', e.target.value);

                                        if (tempAccountData?.usernameChanged || tempAccountData?.emailChanged || tempAccountData?.fullNameChanged)
                                            setTempAccountData({ ...tempAccountData, fullName: e.target.value, fullNameChanged: true })
                                        else
                                            setTempAccountData({ ...accountData, fullName: e.target.value, fullNameChanged: true })
                                    }
                                    else {
                                        setValidationErrors({ ...validationErrors, fullName: true });
                                    }
                                }
                                else {
                                    setTempAccountData({ ...tempAccountData, fullName: '', fullNameChanged: false });
                                }
                            }}
                            onChange={() => { setValidationErrors({ ...validationErrors, fullName: false }); }}
                            error={validationErrors.fullName}
                            helperText={validationErrors.fullName ? 'Enter a valid name with at least 5 characters.' : ''}
                            sx={{ width: '40%', marginBottom: '1rem' }}
                        />
                        <div>
                            {/* Disable the button if there are any errors in the validation */}
                            <Button variant="contained" sx={{ marginRight: '1rem' }} disabled={validationErrors.username || validationErrors.fullName || validationErrors.email.isTaken}
                                onClick={() => {
                                    // Open the dialog to confirm changes
                                    setOpen(true);
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
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Verify account changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to apply these changes to your account?
                        <ul>
                            {tempAccountData.usernameChanged ? <li>New Username: {tempAccountData.username}</li> : ''}
                            {tempAccountData.emailChanged ? <li>New Email: {tempAccountData.email}</li> : ''}
                            {tempAccountData.fullNameChanged ? <li>New Full Name: {tempAccountData.fullName}</li> : ''}
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button loading={submitted} onClick={async () => { }}>Confirm</Button>
                    <Button disabled={submitted} onClick={() => setOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}