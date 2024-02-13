import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

export default function NewPlayer() {
    const postPlayer = () => {
        axios.post('http://localhost:8080/players', {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value
        }).then((response) => {
            console.log(response);
        })
    }
    return (
        <Box>
            <h1>Add New Player</h1>
            <Box component="form" action='http://localhost:8080/players' method='POST' autoComplete='off' sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2rem'
            }}>
                <TextField id="first-name"
                    label="First Name"
                    variant="outlined" name='first-name'
                    sx={{ width: '30%', marginBottom: '1rem' }} />
                <TextField id="last-name"
                    label="Last Name"
                    variant="outlined" name='last-name'
                    sx={{ width: '30%', marginBottom: '1rem' }} />
                <Button variant="contained" size='large' type='submit' onClick={() => { postPlayer() }}>Add Player</Button>
            </Box>
        </Box>

    )
}