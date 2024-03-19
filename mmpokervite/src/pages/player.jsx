import { useLocation } from 'react-router-dom';

export default function Player() {
    //useLocation helps retrieve the data we passed in the navigate function that took us to this page
    const location = useLocation();
    const playerData = location.state.playerData;
    return (
        <div>
            <h1>{playerData.name}</h1>
            <h2>Earnings: ${playerData.winnings}</h2>
            <h2>Games Played: {playerData.gamesPlayed}</h2>
            <h2>Wins: {playerData.wins}</h2>
            <h2>In the Money Finishes: {playerData.itmFinishes}</h2>
            <h2>Bubble Finishes: {playerData.onTheBubble}</h2>
            <h2>Bounties: {playerData.bounties}</h2>
            <h2>Rebuys: {playerData.rebuys}</h2>
            <h2>Add Ons: {playerData.addOns}</h2>


        </div>
    )
}