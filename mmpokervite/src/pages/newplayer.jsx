import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Collapse, Alert, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import api from '../api/axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlagsSelect from "react-flags-select";
import '../App.css';
import { useAlert } from '../AlertContext';
import { errorLog } from '../utils/logger.js';

export default function NewPlayer() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [nationality, setNationality] = useState("");
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [nationalityError, setNationalityError] = useState(true);
    const { alert, setAlert } = useAlert();
    const navigate = useNavigate();

    // Submit handler
    const postPlayer = (e) => {
        // Prevent redirect to server side response: res.send(req.body)
        e.preventDefault();

        // Prevent multiple submissions
        if (submitted) return;
        setSubmitted(true);

        if (firstNameError || lastNameError || nationalityError) {
            // If there are errors, do not submit the form and show an alert
            setAlert({ message: 'Validation failed. Ensure all fields are filled out correctly and a nationality is selected.', severity: 'error', open: true });
            setSubmitted(false);
            return;
        }

        // Send post request for express to handle and clear the inputs of the form
        api.post('/players', {
            firstName, lastName,
            nationality
        }).then(() => {
            setFirstName('');
            setLastName('');
            setAlert({ message: 'New player added.', severity: 'success', open: true });
            navigate('/players');
        }).catch((error) => {
            if (error.status === 401) {
                setAlert({ message: 'You must be logged in to perform this action.', severity: 'error', open: true });
            }
            else {
                setAlert({ message: 'Error creating player. Please try again.', severity: 'error', open: true });
            }
            errorLog(error);
        });
    }

    const validateName = (name) => {
        // RegEx to check if the input is a valid name, it checks for letters, accents, apostrophes, and hyphens
        let trimmedName = name.trim();
        return /^[A-Za-zÀ-ÿ' -]+$/.test(trimmedName) && trimmedName.length >= 2 && trimmedName.length <= 40;
    }

    return (
        <Box>
            {/* Alert to show if client side validation fails. Syntax from MUI */}
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
            <h1>Add New Player</h1>
            <Box component="form"
                action='http://localhost:8080/players' method='POST'
                onSubmit={postPlayer} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2rem'
                }}>
                <TextField id="first"
                    label="First Name"
                    variant="outlined" name='first' value={firstName}
                    error={firstNameError}
                    helperText={firstNameError ? "Enter a valid name with at least 2 characters" : ""}
                    onChange={(e) => {
                        // Validate first name input
                        validateName(e.target.value) ? setFirstNameError(false) : setFirstNameError(true);
                        setFirstName(e.target.value);
                    }}
                    sx={{ width: '30%', marginBottom: '1rem' }} required />
                <TextField id="last"
                    label="Last Name"
                    variant="outlined" name='last' value={lastName}
                    error={lastNameError}
                    helperText={lastNameError ? "Enter a valid name with at least 2 characters" : ""}
                    onChange={(e) => {
                        // Validate last name input
                        validateName(e.target.value) ? setLastNameError(false) : setLastNameError(true);
                        setLastName(e.target.value);
                    }}
                    sx={{ width: '30%', marginBottom: '1rem' }} required />
                {/* Read ReactFlagsSelect docs if needed */}
                <ReactFlagsSelect selected={nationality}
                    onSelect={(code) => {
                        setNationality(code);
                        setNationalityError(false);
                    }} id="flags-select"
                    searchable
                    customLabels={{ "VE": "Venezuela", "BO": "Bolivia", "IR": "Iran", "LA": "Laos", "MK": "Macedonia", "MD": "Moldova", "VN": "Vietnam" }} />
                <Button loading={submitted} loadingPosition='start' variant="contained" size='large' type='submit' sx={{ marginTop: '1rem' }}>Add Player</Button>
            </Box>
        </Box>
    )
}