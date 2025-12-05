import api from '../api/axios';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
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
    const [openDrawer, setOpenDrawer] = useState(false);

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
        <AppBar className='navigation' position='sticky' sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, justifyContent: 'space-around' }}>
                    <Link to='/' onClick={() => {
                        closeAlert();
                        setOpenDrawer(false);
                    }}>MMPoker League Manager</Link>
                </Typography>

                {/* Desktop navbar will show on screen sizes md and larger */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
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
                </Box>
                {/* Hamburger icon for the menu will show on screens smaller than md size */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton color="inherit" onClick={() => setOpenDrawer(!openDrawer)}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>

            {/* Mobile menu content will show on screens smaller than md size*/}
            <Collapse in={openDrawer} timeout={{ enter: 450, exit: 450 }} unmountOnExit>
                <List sx={{ display: { xs: 'block', md: 'none' } }}>
                    <ListItem sx={{ display: 'block' }} disablePadding>
                        <ListItemButton onClick={() => {
                            closeAlert();
                            setOpenDrawer(false);
                            navigate('/leaderboard');
                        }}>
                            <ListItemText>Leaderboard</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ display: 'block' }} disablePadding>
                        <ListItemButton onClick={() => {
                            closeAlert();
                            setOpenDrawer(false);
                            navigate('/players');
                        }}>
                            <ListItemText>Players</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ display: 'block' }} disablePadding>
                        <ListItemButton onClick={() => {
                            closeAlert();
                            setOpenDrawer(false);
                            navigate('/updates');
                        }}>
                            <ListItemText>Updates</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ display: 'block' }} disablePadding>
                        <ListItemButton onClick={() => {
                            closeAlert();
                            setOpenDrawer(false);
                            navigate('/stats');
                        }}>
                            <ListItemText>Stats</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    {/* The next 3 items will show or not depending on the login status */}
                    {/* Show if logged in */}
                    <ListItem sx={{ display: 'block' }} disablePadding>
                        <ListItemButton
                            sx={{ display: loggedIn ? 'block' : 'none' }}
                            onClick={() => {
                                closeAlert();
                                setOpenDrawer(false);
                                navigate('/account');
                            }}>
                            <ListItemText>Account</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    {/* Show if logged in */}
                    <ListItem sx={{ display: 'block' }} disablePadding>
                        <ListItemButton
                            sx={{ display: loggedIn ? 'block' : 'none' }}
                            onClick={() => {
                                closeAlert();
                                setOpenDrawer(false);
                                handleLogout();
                            }}>
                            <ListItemText>Log out</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    {/* Show if not logged in */}
                    <ListItem sx={{ display: 'block' }} disablePadding>
                        <ListItemButton
                            sx={{ display: loggedIn ? 'none' : 'block' }}
                            onClick={() => {
                                closeAlert();
                                setOpenDrawer(false);
                                navigate('/login');
                            }}>
                            <ListItemText>Log in</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>

            {/* Menu for logged in users to show their profile and logout. It will only show on screen sizes larger than md */}
            {/* MUI Syntax */}
            <Menu sx={{ display: { xs: 'none', md: 'flex' } }} anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
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
        </AppBar>
    );
}