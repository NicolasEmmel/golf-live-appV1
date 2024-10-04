'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Player {
  name: string;
  handicap: string;
  flightNumber: string;
  gender: string; // Add gender to the Player interface
}

const TournamentPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [handicap, setHandicap] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [gender, setGender] = useState('Male'); // Gender state
  const router = useRouter();

  // Add player to the list
  const addPlayer = () => {
    // Ensure all fields are filled before adding a player
    if (name && handicap && flightNumber && gender) {
      setPlayers([...players, { name, handicap, flightNumber, gender }]);
      setName(''); // Clear the inputs
      setHandicap('');
      setFlightNumber('');
      setGender('Male'); // Clear the gender selection
    } else {
      alert("Please fill out all fields, including gender.");
    }
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
        router.push("/leaderboard");
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
        <div className="mb-2">
          <div className="flex items-center">
            <label className="mr-4">
              <input
                type="radio"
                value="Male"
                checked={gender === 'Male'}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                value="Female"
                checked={gender === 'Female'}
                onChange={(e) => setGender(e.target.value)}
                className="mr-2"
              />
              Female
            </label>
          </div>
        </div>
        <button className="btn btn-accent w-full" onClick={addPlayer}>
          Add Player
        </button>
      </div>

      <button className="btn btn-accent w-full" onClick={initializeTournament}>
        Initialize Tournament
      </button>

      <div className='mt-2 mb-2 flex gap-10'>
        <Link className="border-b-2" href="/leaderboard">
          Zum Leaderboard
        </Link>
        <Link className="border-b-2" href="/flights">
          Zu den Flights
        </Link>
      </div>


      <h2 className="text-xl font-bold mb-2">Players Added:</h2>
      <ul className="list-disc list-inside mb-4 max-h-72 overflow-scroll">
        {players.map((player, index) => (
          <li key={index}>{`${player.name} (Handicap: ${player.handicap}, Flight: ${player.flightNumber})`}</li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentPage;
