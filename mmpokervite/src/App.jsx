import './App.css';
import axios from 'axios';

function App() {

  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      console.log(data);
    });
  }

  return (
    <div>
      <h1>M&M Poker Nights</h1>
      <button onClick={apiCall}>Explore</button>
    </div>
  )
}

export default App
