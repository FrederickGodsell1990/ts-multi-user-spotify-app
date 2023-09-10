import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const sendSpotifyDetailsToServer = async (inputValue) => {
  // You can perform actions with inputValue here, such as sending it to a server

try{  
  const testGet = await axios.get('http://localhost:3333/test_endpoint')
console.log(testGet);
}
catch(error){
}

}

function App() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = e.target.querySelector('input').value;
    sendSpotifyDetailsToServer(inputValue);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}> 
        <input
          type="text"
          placeholder="Enter Spotify details"
        />
        <button type="submit">Search artist</button>
      </form>
    </div>
  );
}
export default App;
