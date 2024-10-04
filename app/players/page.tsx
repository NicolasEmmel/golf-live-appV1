'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';

interface Player {
    id: number;
    name: string;
    handicap: string;
    flight: string;
    gender: string;
}

const PlayerPage = () => {
    const router = useRouter();
    const fetcher = () => fetch('/api/players').then((res) => res.json());
    const { data: players, error, isLoading } = useSWR('/api/players', fetcher);

    const [name, setName] = useState('');
    const [handicap, setHandicap] = useState('');
    const [flight, setFlight] = useState('');
    const [gender, setGender] = useState('');
    const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null); // Track player being edited

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading players</div>;

    // Add a new player
    const addPlayer = async () => {
        if (name && handicap && flight && gender) {
            const newPlayer = { name, handicap, flight, gender };
            await fetch('/api/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPlayer),
            });
            router.refresh();
            mutate('/api/players');
        } else {
            alert('Please fill in all fields');
        }
    };

    // Edit an existing player (prepopulate form)
    const startEditPlayer = (player: Player) => {
        setEditingPlayerId(player.id);
        setName(player.name);
        setHandicap(player.handicap);
        setFlight(player.flight);
        setGender(player.gender);
    };

    // Update the player
    const updatePlayer = async () => {
        if (editingPlayerId) {
            const updatedPlayer = { name, handicap, flight, gender };
            await fetch(`/api/players/${editingPlayerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPlayer),
            });
            setEditingPlayerId(null); // Reset editing mode
            setName(''); // Clear form
            setHandicap('');
            setFlight('');
            setGender('');
            mutate('/api/players');
            router.refresh(); // Reload data
        }
    };

    // Delete an existing player
    const deletePlayer = async (id: number) => {
        try {
            await fetch(`/api/players/${id}`, {
                method: 'DELETE',
            });
            mutate('/api/players');
        } catch (error) {
        }


        router.refresh();
    };

    return (
        <div className="container mx-auto p-4 maxHeightFlight overflow-y-scroll">
            <h1 className="text-2xl font-bold mb-4">Manage Players</h1>

            {/* Add or edit player form */}
            <div className="mb-4">
                <h2 className="text-xl font-bold">{editingPlayerId ? 'Edit Player' : 'Add Player'}</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered mb-2 text-gray-400"
                />
                <input
                    type="number"
                    placeholder="Handicap"
                    value={handicap}
                    onChange={(e) => setHandicap(e.target.value)}
                    className="input input-bordered mb-2 text-gray-400"
                />
                <input
                    type="number"
                    placeholder="Flight Number"
                    value={flight}
                    onChange={(e) => setFlight(e.target.value)}
                    className="input input-bordered mb-2 text-gray-400"
                />
                <div className="mb-2">
                    <label>Gender: </label>
                    <input
                        type="radio"
                        value="Male"
                        checked={gender === 'Male'}
                        onChange={() => setGender('Male')}
                    /> Male
                    <input
                        type="radio"
                        value="Female"
                        checked={gender === 'Female'}
                        onChange={() => setGender('Female')}
                    /> Female
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={editingPlayerId ? updatePlayer : addPlayer}
                >
                    {editingPlayerId ? 'Update Player' : 'Add Player'}
                </button>
            </div>

            {/* Display and manage existing players */}
            <h2 className="text-xl font-bold mb-2">Existing Players</h2>
            <ul>
                {players.map((player: Player) => (
                    <li key={player.id} className="mb-2 border p-2">
                        <div>
                            <strong>{player.name}</strong> (Handicap: {player.handicap}, Flight: {player.flight}, Gender: {player.gender})
                        </div>
                        <button
                            className="btn btn-secondary mr-2"
                            onClick={() => startEditPlayer(player)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-error"
                            onClick={() => deletePlayer(player.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerPage;
