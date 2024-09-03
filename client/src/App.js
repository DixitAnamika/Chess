import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [positions, setPositions] = useState({
    Knight: '',
    Rook: '',
    Bishop: '',
    Queen: ''
  });
  const [results, setResults] = useState({
    Knight: [],
    Rook: [],
    Bishop: [],
    Queen: []
  });

  const handleChange = (e) => {
    setPositions({
      ...positions,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const knightResponse = await axios.post('http://localhost:3000/chess/knight', { positions });
      const rookResponse = await axios.post('http://localhost:3000/chess/rook', { positions });
      const bishopResponse = await axios.post('http://localhost:3000/chess/bishop', { positions });
      const queenResponse = await axios.post('http://localhost:3000/chess/queen', { positions });

      setResults({
        Knight: knightResponse.data.valid_moves,
        Rook: rookResponse.data.valid_moves,
        Bishop: bishopResponse.data.valid_moves,
        Queen: queenResponse.data.valid_moves
      });
    } catch (error) {
      console.error('Error fetching chess moves:', error);
    }
  };

  return (
    <div className="App">
      <h1>Chess Piece Moves</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Knight:
          <input
            type="text"
            name="Knight"
            value={positions.Knight}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Rook:
          <input
            type="text"
            name="Rook"
            value={positions.Rook}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Bishop:
          <input
            type="text"
            name="Bishop"
            value={positions.Bishop}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Queen:
          <input
            type="text"
            name="Queen"
            value={positions.Queen}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Get Moves</button>
      </form>
      <div>
        <h2>Results:</h2>
        <h3>Knight Moves:</h3>
        <ul>
          {results.Knight.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
        <h3>Rook Moves:</h3>
        <ul>
          {results.Rook.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
        <h3>Bishop Moves:</h3>
        <ul>
          {results.Bishop.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
        <h3>Queen Moves:</h3>
        <ul>
          {results.Queen.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
