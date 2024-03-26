import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import '../App.css';

export default function Player() {
    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const playerData = location.state.playerData;
    return (
        <div>
            <h1>{playerData.name}</h1>
            <div className='player-data'>
                <Typography variant='h4'>Earnings: ${playerData.winnings}</Typography>
                <Typography variant='h4'>Games Played: {playerData.gamesPlayed}</Typography>
                <Typography variant='h4'>Wins: {playerData.wins}</Typography>
                <Typography variant='h4'>In the Money: {playerData.itmFinishes}</Typography>
            </div>
            <div className='player-data'>
                <Typography variant='h4'>On the Bubble: {playerData.onTheBubble}</Typography>
                <Typography variant='h4'>Bounties: {playerData.bounties}</Typography>
                <Typography variant='h4'>Rebuys: {playerData.rebuys}</Typography>
                <Typography variant='h4'>Add Ons: ${playerData.addOns}</Typography>
            </div>
        </div>
    )
}