import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Alert, Box, Button, Collapse, IconButton, TextField } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear';
import ReactFlagsSelect from "react-flags-select";

export default function EditPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playerData, setPlayerData] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nationality, setNationality] = useState("");
    const [validationErrors, setValidationErrors] = useState({
        firstName: false,
        lastName: false,
        nationality: false
    });
    const [submitted, setSubmitted] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        // Fetch player data from the server when the component mounts
        // You can use the player ID from the URL params to fetch specific player data
        if (playerData) return; // Avoid refetching if we already have the data
        axios.get(`http://localhost:8080/players/${id}`)
            .then((res) => {
                setPlayerData(res.data);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setNationality(res.data.nationality);
            })
            .catch((err) => {
                console.error('Error fetching player data:', err);
            });
    }, [playerData]);

    const validateName = (name) => {
        // RegEx to check if the input is a valid name, it checks for letters, accents, apostrophes, and hyphens
        let trimmedName = name.trim();
        return /^[A-Za-zÀ-ÿ' -]+$/.test(trimmedName) && trimmedName.length >= 2 && trimmedName.length <= 40;
    }

    // Handle form submission to update player data
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (submitted) return;
        setSubmitted(true);

        if (validationErrors.firstName || validationErrors.lastName || validationErrors.nationality) {
            // If there are errors, do not submit the form
            setSubmitted(false);
            setOpenAlert(true);
            return;
        }

        axios.patch(`http://localhost:8080/players/player/${id}`, {
            firstName,
            lastName,
            nationality
        }, { withCredentials: true }).then(() => {
            console.log('Player updated successfully');
            navigate(`/players/${id}`);

        }).catch((err) => {
            console.error('Error updating player:', err);
            setSubmitted(false);
            setOpenAlert(true);
        });
    }

    return (
        <Box>
            {/* Alert to show if client side validation fails. Syntax from MUI */}
            <Collapse in={openAlert}>
                <Alert severity='error' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    Validation failed. Ensure all fields are filled out correctly and a nationality is selected.
                </Alert>
            </Collapse>
            <Box component='form' action='http://localhost:8080/players?_method=PATCH' method='POST' onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2rem'
                }}>
                <h1>Edit Player</h1>
                <TextField label="First Name" variant="outlined" name='firstName' value={firstName}
                    error={validationErrors.firstName}
                    helperText={validationErrors.firstName ? "Enter a valid name with at least 2 characters" : ""}
                    onChange={(e) => {
                        // Validate first name input
                        // If valid, set the error state to false, otherwise true which shows the error message
                        validateName(e.target.value) ? setValidationErrors({ ...validationErrors, firstName: false }) : setValidationErrors({ ...validationErrors, firstName: true });
                        setFirstName(e.target.value);
                    }}
                    sx={{ width: '30%', marginBottom: '1rem' }} required>
                </TextField>
                <TextField label="Last Name" variant="outlined" name='lastName' value={lastName}
                    error={validationErrors.lastName}
                    helperText={validationErrors.lastName ? "Enter a valid name with at least 2 characters" : ""}
                    onChange={(e) => {
                        // Validate last name input
                        validateName(e.target.value) ? setValidationErrors({ ...validationErrors, lastName: false }) : setValidationErrors({ ...validationErrors, lastName: true });
                        setLastName(e.target.value);
                    }}
                    sx={{ width: '30%', marginBottom: '1rem' }} required>
                </TextField>
                <ReactFlagsSelect selected={nationality}
                    onSelect={(code) => {
                        setNationality(code);
                        setValidationErrors({ ...validationErrors, nationality: false });
                    }} id="flags-select"
                    searchable
                    customLabels={{ "VE": "Venezuela", "BO": "Bolivia", "IR": "Iran", "LA": "Laos", "MK": "Macedonia", "MD": "Moldova", "VN": "Vietnam" }} />
                <Button loading={submitted} loadingPosition='start' variant="contained" size='large' type='submit' sx={{ marginTop: '1rem' }}>Save Changes</Button>
            </Box >
        </Box>

    )
}