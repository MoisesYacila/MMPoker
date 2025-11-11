import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1rem', marginBottom: '1em' }}>
            <footer className='footer'>&copy; MMPoker 2025</footer>
            <Link to='/privacy'>Privacy Policy</Link>
        </Box>
    )
}