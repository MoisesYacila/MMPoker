import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useState } from 'react';

export default function NewPlayer() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    //Submit handler
    const postPlayer = (e) => {
        //Prevent redirect to server side response: res.send(req.body)
        e.preventDefault();

        //Save full name in a variable, if we use useState for the name, it won't get the last character
        const finalName = `${firstName} ${lastName}`
        //Send post request for express to handle and clear the inputs of the form
        axios.post('http://localhost:8080/players', {
            name: finalName
        }).then((response) => {
            console.log(response)
            setFirstName('');
            setLastName('');
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
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
                <Button variant="contained" size='large' type='submit'>Add Player</Button>
            </Box>
        </Box>

    )
}