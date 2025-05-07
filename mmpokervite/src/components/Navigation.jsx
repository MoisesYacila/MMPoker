import * as React from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import './navigation.css';
import { useUser } from '../UserContext';
import { useAlert } from '../AlertContext';

//Using styled function which is provided by Material UI to override default styles on reusable components
const LinkButton = styled(Button)({
    textTransform: 'none'
})

export default function Navigation() {
    // We are using the useUser hook to get and set the loggedIn state from the UserContext
    const { loggedIn, setLoggedIn } = useUser();
    const { setAlertMessage } = useAlert();

    const navigate = useNavigate();

    // Log out handler function
    const handleLogout = () => {
        // Call the logout route, set the loggedIn state to false and redirect to the leaderboard page
        axios.get('http://localhost:8080/logout', { withCredentials: true })
            .then((res) => {
                setLoggedIn(false);
                setAlertMessage('Logged out.');
                navigate('/leaderboard', { state: { openAlertLink: true } });
                console.log('User logged out');
            })
    }

    return (
        <Box className='navigation'>
            <AppBar position='sticky' sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, justifyContent: 'space-around' }}>
                        <Link to='/'>M&M Poker Nights</Link>
                    </Typography>
                    <LinkButton>
                        <Typography><Link to='/leaderboard'>Leaderboard</Link></Typography>
                    </LinkButton>
                    <LinkButton>
                        <Typography><Link to='/players'>Players</Link></Typography>
                    </LinkButton>
                    <LinkButton>
                        <Typography><Link to='/forum'>Forum</Link></Typography>
                    </LinkButton>
                    <LinkButton>
                        <Typography><Link to='/stats'>Stats</Link></Typography>
                    </LinkButton>
                    {
                        loggedIn ? (
                            <Button variant='text' sx={{ textTransform: 'none', color: 'white' }}
                                onClick={handleLogout}
                            >
                                <Typography>Log out</Typography>
                            </Button>) :
                            (
                                <LinkButton>
                                    <Typography><Link to='/login'>Log in</Link></Typography>
                                </LinkButton>)
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}