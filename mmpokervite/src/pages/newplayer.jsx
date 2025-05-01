import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Collapse, Alert, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ReactFlagsSelect from "react-flags-select";
import '../App.css';

export default function NewPlayer() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [nationality, setNationality] = useState("");
    const [openAlert, setOpenAlert] = useState(false);

    // //Submit handler
    const postPlayer = (e) => {
        //Prevent redirect to server side response: res.send(req.body)
        e.preventDefault();

        //Save full name in a variable, if we use useState for the name, it won't get the last character
        const finalName = `${firstName} ${lastName}`
        //Send post request for express to handle and clear the inputs of the form
        axios.post('http://localhost:8080/players', {
            name: finalName,
            country: nationality
        }).then((response) => {
            //Set submitted to true to let react know to redirect
            setSubmitted(true);
            setFirstName('');
            setLastName('');
        }).catch((error) => {
            setOpenAlert(true);
            console.log(error);
        });
    }
    return (
        <div>
            {/* Alert to show if operation fails. Syntax from MUI */}
            <Collapse in={openAlert}>
                <Alert severity='error' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    Must be signed in to add a player.
                </Alert>
            </Collapse>
            <Box>
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
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                        sx={{ width: '30%', marginBottom: '1rem' }} required />
                    <TextField id="last"
                        label="Last Name"
                        variant="outlined" name='last' value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                        sx={{ width: '30%', marginBottom: '1rem' }} required />
                    {/* Read ReactFlagsSelect docs if needed */}
                    <ReactFlagsSelect selected={nationality}
                        onSelect={(code) => setNationality(code)} id="flags-select"
                        countries={["US", "AR", "MX", "NI", "ES", "VE"]}
                        customLabels={{ "VE": "Venezuela" }} />
                    <Button variant="contained" size='large' type='submit' sx={{ marginTop: '1rem' }}>Add Player</Button>
                </Box>
                {/* When submitted is true, react will redirect back to the players page */}
                {submitted ? <Navigate to='/players' replace={true} /> : null}
            </Box>
        </div>
    )
}