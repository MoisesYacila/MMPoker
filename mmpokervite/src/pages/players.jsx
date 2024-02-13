import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

export default function Players() {
    return (
        <div>
            <h1>Players</h1>
            <Box sx={{ textAlign: 'center' }}>
                <Link to='/players/new'>Add Player</Link>
            </Box>

        </div>

    )
}