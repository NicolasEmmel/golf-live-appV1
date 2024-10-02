'use client'
import { useState } from 'react';

interface Player {
  name: string;
  handicap: string;
  flightNumber: string;
}

const TournamentPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [handicap, setHandicap] = useState('');
  const [flightNumber, setFlightNumber] = useState('');

  // Add player to the list
  const addPlayer = () => {
    setPlayers([...players, { name, handicap, flightNumber }]);
    setName(''); // Clear the inputs
    setHandicap('');
    setFlightNumber('');
  };

  // Initialize the tournament with all players
  const initializeTournament = async () => {
    try {
      const response = await fetch('/api/initializeTournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ players }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Tournament initialized successfully');
        setPlayers([]); // Clear the player list
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error initializing tournament:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Initialize Tournament</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Player Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input text-gray-400 input-bordered w-full mb-2"
        />
        <input
          type="number"
          placeholder="Handicap"
          value={handicap}
          onChange={(e) => setHandicap(e.target.value)}
          className="input text-gray-400 input-bordered w-full mb-2"
        />
        <input
          type="number"
          placeholder="Flight Number"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          className="input text-gray-400 input-bordered w-full mb-2"
        />
        <button className="btn btn-accent w-full" onClick={addPlayer}>
          Add Player
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Players Added:</h2>
      <ul className="list-disc list-inside mb-4">
        {players.map((player, index) => (
          <li key={index}>{`${player.name} (Handicap: ${player.handicap}, Flight: ${player.flightNumber})`}</li>
        ))}
      </ul>

      <button className="btn btn-accent w-full" onClick={initializeTournament}>
        Initialize Tournament
      </button>
    </div>
  );
};

export default TournamentPage;
