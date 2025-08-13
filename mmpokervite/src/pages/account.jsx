import axios from 'axios';
import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from '../UserContext';

export default function Account() {
    const { id } = useUser();
    const [accountData, setAccountData] = useState({});

    // Fetching account data using the user ID from the UserContext
    useEffect(() => {
        axios.get(`http://localhost:8080/accounts/${id}`, { withCredentials: true })
            .then((res) => {
                console.log('Account data:', res.data);
                setAccountData(res.data);
            })
            .catch((error) => {
                console.error('Error fetching account data:', error);
            });
    }, [id]);

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
                    {/* Make sure not to edit anything if the fields are empty */}
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            label="New Username"
                            variant="outlined"
                            name="username"
                            // VALIDATE BEFORE SENDING TO SERVER
                            onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                            sx={{ width: '40%', marginBottom: '1rem' }}
                        />
                        <TextField
                            label="New Email"
                            variant="outlined"
                            name="email"
                            // VALIDATE BEFORE SENDING TO SERVER
                            onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                            sx={{ width: '40%', marginBottom: '1rem' }}
                        />
                        <TextField
                            label="New Full Name"
                            variant="outlined"
                            name="fullName"
                            // VALIDATE BEFORE SENDING TO SERVER
                            onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                            sx={{ width: '40%', marginBottom: '1rem' }}
                        />
                        <div>
                            <Button variant="contained" sx={{ marginRight: '1rem' }}>
                                Save Changes
                            </Button>
                            <Button variant="contained" color="error">
                                Cancel
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
        </Box>
    )
}