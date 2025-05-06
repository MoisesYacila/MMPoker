import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import './navigation.css';
import { useUser } from '../UserContext';

//Using styled function which is provided by Material UI to override default styles on reusable components
const LinkButton = styled(Button)({
    textTransform: 'none'
})

export default function Navigation() {
    const { loggedIn } = useUser();
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
                            <LinkButton>
                                <Typography><Link to='/logout'>Log Out</Link></Typography>
                            </LinkButton>
                        ) : (
                            <LinkButton>
                                <Typography><Link to='/login'>Log In</Link></Typography>
                            </LinkButton>
                        )
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}