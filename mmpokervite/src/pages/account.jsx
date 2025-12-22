import api from '../api/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button,
    Collapse, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import { useUser } from '../UserContext';
import { useAlert } from '../AlertContext';
import { isValidEmail, isValidFullName, isValidUsername } from '../../../shared/validators';
import { log, errorLog } from '../utils/logger.js';

export default function Account() {
    const { id, isAdmin, setLoggedIn, setIsAdmin, setId } = useUser();
    const { alert, setAlert } = useAlert();
    const navigate = useNavigate();

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteDialog2, setOpenDeleteDialog2] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        fullName: ''
    });
    const [accountData, setAccountData] = useState({});
    const [tempAccountData, setTempAccountData] = useState({});
    const [accountToDelete, setAccountToDelete] = useState({});
    const [validationErrors, setValidationErrors] = useState({
        // No errors initially
        username: {
            isTaken: false,
            invalidFormat: false
        }
        ,
        email: {
            isTaken: false,
            isGoogle: false,
            invalidFormat: false
        },
        fullName: false
    });
    const [allAccounts, setAllAccounts] = useState([]);

    // Fetching account data using the user ID from the UserContext
    useEffect(() => {
        api.get(`/accounts/${id}`)
            .then((res) => {
                log('Account data:', res.data);
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
                errorLog('Error fetching account data:', error);
            });
    }, [id]);

    // Fetch all accounts for the admin panel
    useEffect(() => {
        getAllAccounts();
    }, []);

    // If the user is an admin, get all the accounts for the admin panel
    const getAllAccounts = async () => {
        // Using isAdmin from UserContext might be outdated, which might cause 401 errors and unexpected behavior, so we double check with the backend
        const adminCheck = await api.get('/isAdmin');
        if (!adminCheck.data.isAdmin) return;

        api.get('/accounts')
            .then((res) => {
                setAllAccounts(res.data);
                log('All accounts: ', res.data);
            })
            .catch((err) => { errorLog(err) });
    };

    // Log out handler function
    const handleLogout = async () => {
        // Call the logout route, reset the user context and redirect to the leaderboard page with the alert
        await api.get('/logout')
            .then(() => {
                setLoggedIn(false);
                setIsAdmin(false);
                setAlert({ message: 'Logged out.', severity: 'success', open: true });
                setId(null);
                navigate('/leaderboard');
            })
    }

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

    // Get the appropriate helper text for the username field
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

    const disableButton = () => {
        // Disable if there are any validation errors or if all fields are empty
        let allEmpty = form.username.trim() === '' && form.email.trim() === '' && form.fullName.trim() === '';
        return (validationErrors.username.isTaken || validationErrors.username.invalidFormat || validationErrors.fullName || validationErrors.email.isTaken || validationErrors.email.invalidFormat || allEmpty);
    }


    return (
        <div>
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
            <Box sx={{ textAlign: 'center', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Account</h1>
                <h2>Settings</h2>
                {/* Accordion components to display account settings */}
                {/* MUI Syntax. Width varies for responsive design */}
                <Accordion sx={{ width: { xs: '90%', sm: '70%', md: '50%' } }}>
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
                <Accordion sx={{ width: { xs: '90%', sm: '70%', md: '50%' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Preferences
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>Language: English</p>
                        <p>Theme: Light</p>
                        <p>Currency: USD</p>
                    </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: { xs: '90%', sm: '70%', md: '50%' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        League Management
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>Current League: Moi&apos;s Poker Nights</p>
                    </AccordionDetails>
                </Accordion>
                {/* Admin panel. Admins can delete non admin accounts from here */}
                {isAdmin ? <Accordion sx={{ width: { xs: '90%', sm: '70%', md: '50%' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Admin Panel
                    </AccordionSummary>
                    <AccordionDetails>
                        <h3>All accounts</h3>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {/* Wrapping the table in a TableContainer to make sure the table doesn't overflow and to make it horizontally scrollable */}
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Admin</TableCell>
                                            <TableCell align='center'>Delete?</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allAccounts.map((account, i) => {
                                            return (<TableRow key={i}>
                                                <TableCell>{account.username}</TableCell>
                                                <TableCell>{account.email}</TableCell>
                                                <TableCell>{account.admin ? 'Yes' : 'No'}</TableCell>
                                                {/* If the account is not an admin, then admins can delete it */}
                                                <TableCell align='center'>{!account.admin ?
                                                    <IconButton onClick={() => {
                                                        log(account);
                                                        setAccountToDelete(account);
                                                        setOpenDeleteDialog2(true)
                                                    }}>
                                                        <DeleteIcon></DeleteIcon>
                                                    </IconButton> :
                                                    <Tooltip title='Cannot delete admin&apos;s account. If you want to delete your account, use the button at the bottom of the page.'>
                                                        <InfoOutlineIcon />
                                                    </Tooltip>
                                                }</TableCell>
                                            </TableRow>);
                                        })}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </AccordionDetails>
                </Accordion> : null}
                <Accordion sx={{ width: { xs: '90%', sm: '70%', md: '50%' } }}>
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
                                        // If the username format is invalid, set the error and return early
                                        if (!isValidUsername(e.target.value)) {
                                            setValidationErrors({ ...validationErrors, username: { ...validationErrors.username, invalidFormat: true } });
                                            return;
                                        }
                                        // If any field has been changed, use tempAccountData to keep track of changes
                                        // Otherwise, use accountData
                                        if (tempAccountData?.usernameChanged || tempAccountData?.emailChanged || tempAccountData?.fullNameChanged)
                                            setTempAccountData({ ...tempAccountData, username: e.target.value.trim(), usernameChanged: true })
                                        else
                                            setTempAccountData({ ...accountData, username: e.target.value.trim(), usernameChanged: true })

                                        // Validate username uniqueness
                                        // In a GET request, we must send data as params
                                        // We send the entire account data along with the new username to exclude the current user's username from the check (if my username is "user123" and I didn't change it, it shouldn't say it's taken)
                                        // and when we get the response back, we only update the username error state
                                        await api.get(`/accounts/validateData/`, { params: { ...accountData, username: e.target.value.trim() } })
                                            .then((res) => {
                                                log('Username validation response:', res.data);
                                                setValidationErrors({ ...validationErrors, username: { ...validationErrors.username, isTaken: res.data.isUsernameTaken } });
                                            })
                                            .catch((error) => {
                                                errorLog('Error validating username:', error);
                                            });
                                    }
                                    else {
                                        // If the input is empty, reset the tempAccountData for username
                                        setTempAccountData({ ...tempAccountData, username: '', usernameChanged: false });
                                    }
                                }}
                                onChange={(e) => {
                                    // Clear username error when user starts typing and update form state
                                    setValidationErrors({ ...validationErrors, username: { isTaken: false, invalidFormat: false } });
                                    setForm({ ...form, username: e.target.value });
                                }}
                                error={validationErrors.username.isTaken || validationErrors.username.invalidFormat}
                                helperText={getUsernameHelperText()}
                                sx={{ width: { xs: '90%', sm: '70%', md: '60%', lg: '40%' }, marginBottom: '1rem' }}
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

                                        await api.get(`/accounts/validateData/`, { params: { ...accountData, email: e.target.value.trim() } })
                                            .then((res) => {
                                                log('Email validation response:', res.data);
                                                setValidationErrors({ ...validationErrors, email: { ...validationErrors.email, isTaken: res.data.isEmailTaken } });
                                            })
                                            .catch((error) => {
                                                errorLog('Error validating email:', error);
                                            });
                                    }
                                    else {
                                        setTempAccountData({ ...tempAccountData, email: '', emailChanged: false });
                                    }
                                }}
                                onChange={(e) => {
                                    setValidationErrors({ ...validationErrors, email: { isTaken: false, invalidFormat: false } });
                                    setForm({ ...form, email: e.target.value });
                                }}
                                error={validationErrors.email.isTaken || validationErrors.email.invalidFormat}
                                helperText={getEmailHelperText()}
                                sx={{ width: { xs: '90%', sm: '70%', md: '60%', lg: '40%' }, marginBottom: '1rem' }}
                            />
                            <TextField
                                label="New Full Name"
                                variant="outlined"
                                name="fullName"
                                value={form.fullName}
                                // Same logic as username and email fields except we don't need to check uniqueness
                                onBlur={(e) => {
                                    if (e.target.value.trim() !== '') {
                                        if (isValidFullName(e.target.value)) {
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
                                        // If the input is empty, remove fullName from tempAccountData
                                        setTempAccountData(prev => {
                                            if (!prev) return prev;

                                            // Disabling eslint here because we are using the variables to exclude them from the new object
                                            // eslint-disable-next-line no-unused-vars
                                            const { fullName, fullNameChanged, ...rest } = prev;
                                            return rest;
                                        });
                                    }
                                }}
                                onChange={(e) => {
                                    setValidationErrors({ ...validationErrors, fullName: false });
                                    setForm({ ...form, fullName: e.target.value });
                                }}
                                error={validationErrors.fullName}
                                helperText={validationErrors.fullName ? 'Enter a valid name with at least 5 characters.' : ''}
                                sx={{ width: { xs: '90%', sm: '70%', md: '60%', lg: '40%' }, marginBottom: '1rem' }}
                            />
                            <div>
                                {/* Disable the button if there are any errors in the validation */}
                                <Button variant="contained" sx={{ marginRight: '1rem' }} disabled={disableButton()}
                                    onClick={() => {
                                        // Open the dialog to confirm changes
                                        setOpenEditDialog(true);
                                    }}>
                                    Save Changes
                                </Button>
                            </div>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Button variant='contained' sx={{ marginTop: '1rem' }} onClick={handleLogout}>
                    Log Out
                </Button>
                <Button variant='contained' sx={{ marginTop: '1rem', marginBottom: '1.5rem' }} color='error'
                    onClick={() => setOpenDeleteDialog(true)}>
                    Delete Account
                </Button>

                {/* Dialog to confirm account changes */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
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
                            await api.patch(`/accounts/${id}`, { ...tempAccountData })
                                .then((res) => {
                                    log('Account updated successfully:', res.data);
                                    // Update the account data with the new info and reset the form and temp data
                                    // Also, re fetch all accounts for the admin panel
                                    setAccountData(res.data);
                                    setForm({ username: '', email: '', fullName: '' });
                                    setTempAccountData({});
                                    setSubmitted(false);
                                    setAlert({ message: 'Account updated successfully.', severity: 'success', open: true });
                                    getAllAccounts();
                                }
                                ).catch((err) => {
                                    errorLog('Error updating account:', err);
                                    setSubmitted(false);
                                });
                            setOpenEditDialog(false);
                        }}>Confirm</Button>
                        <Button disabled={submitted} onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                {/* Dialog to confirm account deletion */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Deleting account</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    </DialogContent>
                    <DialogActions>
                        <Button loading={submitted} color='error' onClick={async () => {
                            // Call the delete account route
                            setSubmitted(true);
                            await api.delete(`/accounts/${id}`)
                                .then(() => {
                                    // On success, log the user out and redirect to login page with an alert
                                    setSubmitted(false);
                                    setOpenDeleteDialog(false);
                                    setAlert({ message: 'Account deleted successfully.', severity: 'success', open: true });
                                    setLoggedIn(false);
                                    setIsAdmin(false);
                                    setId(null);
                                    navigate('/login');
                                })
                                .catch((err) => {
                                    errorLog('Error deleting account:', err);
                                });
                        }}>Delete</Button>
                        <Button disabled={submitted} onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDeleteDialog2} onClose={() => setOpenDeleteDialog2(false)}>
                    <DialogTitle>Deleting account</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to delete this account? This action cannot be undone.</p>
                        <ul>
                            <li>Username: {accountToDelete.username}</li>
                            <li>Email: {accountToDelete.email}</li>
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button loading={submitted} color='error' onClick={() => {
                            // Call the delete account route
                            setSubmitted(true);
                            api.delete(`/accounts/${accountToDelete._id}`)
                                .then(() => {
                                    // On success, log the user out and redirect to login page with an alert
                                    setSubmitted(false);
                                    setOpenDeleteDialog2(false);
                                    // Remove the account we just deleted from allAccounts. This change should trigger a re render for us to see the updated table
                                    setAllAccounts(allAccounts.filter((account) => account._id != accountToDelete._id));
                                    setAccountToDelete({});
                                    setAlert({ message: 'Account deleted successfully.', severity: 'success', open: true });
                                })
                                .catch((err) => {
                                    errorLog('Error deleting account:', err);
                                    setSubmitted(false);
                                    setOpenDeleteDialog2(false);
                                });
                        }}>Delete</Button>
                        <Button disabled={submitted} onClick={() => setOpenDeleteDialog2(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    )
}