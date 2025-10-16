import api from '../api/axios';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import './navigation.css';
import { useUser } from '../UserContext';
import { useAlert } from '../AlertContext';

//Using styled function which is provided by Material UI to override default styles on reusable components
const LinkButton = styled(Button)({
    textTransform: 'none'
})

export default function Navigation() {
    // We are using the custom hooks we made to handle several states in the application
    const { loggedIn, setLoggedIn, setIsAdmin, setId } = useUser();
    const { alert, setAlert } = useAlert();

    const navigate = useNavigate();

    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleMenuOpen = (e) => {
        setMenuAnchor(e.currentTarget);
    }

    // Log out handler function
    const handleLogout = () => {
        // Call the logout route, reset user context and redirect to the leaderboard page with an alert
        api.get('/logout')
            .then(() => {
                setLoggedIn(false);
                setIsAdmin(false);
                setAlert({ message: 'Logged out.', severity: 'success', open: true });
                setId(null);
                navigate('/leaderboard');
                console.log('User logged out');
            })
    }

    // Use this function on all Links to reset any possible stale alerts
    const closeAlert = () => {
        setAlert({ ...alert, open: false });
    }

    return (
        <Box className='navigation'>
            <AppBar position='sticky' sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, justifyContent: 'space-around' }}>
                        <Link to='/' onClick={() => { closeAlert() }}>MMPoker League Manager</Link>
                    </Typography>
                    <LinkButton>
                        <Typography><Link to='/leaderboard' onClick={() => { closeAlert() }}>Leaderboard</Link></Typography>
                    </LinkButton>
                    <LinkButton>
                        <Typography><Link to='/players' onClick={() => { closeAlert() }}>Players</Link></Typography>
                    </LinkButton>
                    <LinkButton>
                        <Typography><Link to='/updates' onClick={() => { closeAlert() }}>Updates</Link></Typography>
                    </LinkButton>
                    <LinkButton>
                        <Typography><Link to='/stats' onClick={() => { closeAlert() }}>Stats</Link></Typography>
                    </LinkButton>
                    {
                        loggedIn ? (
                            <IconButton sx={{ color: 'white' }} onClick={(e) => handleMenuOpen(e)}>
                                <AccountCircleIcon>
                                </AccountCircleIcon>
                            </IconButton>
                        ) :
                            (
                                <LinkButton>
                                    <Typography><Link to='/login' onClick={() => { closeAlert() }}>Log in</Link></Typography>
                                </LinkButton>)
                    }
                </Toolbar>
            </AppBar>
            {/* Menu for logged in users to show their profile and logout */}
            {/* MUI Syntax */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                <MenuItem onClick={() => {
                    closeAlert();
                    setMenuAnchor(null);
                    navigate('/account');
                }}>Account</MenuItem>
                <MenuItem onClick={() => {
                    closeAlert();
                    setMenuAnchor(null);
                    handleLogout();
                }}>Log out</MenuItem>
            </Menu>
        </Box>
    );
}