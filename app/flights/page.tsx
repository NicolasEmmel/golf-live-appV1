'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';

interface Flight {
  flight: number;
  players: { name: string, id: number }[];
}

const FlightsPage = () => {
  mutate('/api/flight');
  const fetcher = () => fetch('/api/flight').then((res) => res.json());
  const { data, error, isLoading } = useSWR('/api/flight', fetcher);
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading flights</div>;

  const flights: Flight[] = data;

  // Function to navigate to the specific flight page
  const handleFlightClick = (flightId: number) => {
    router.push(`/flight?flightId=${flightId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Flight Selection</h1>
      <div className="grid grid-cols-2 gap-4">
        {flights.map((flight, flightIndex) => (
          <button key={`flight-${flight.flight}-${flightIndex}`} onClick={() => handleFlightClick(flight.flight)} className="btn btn-secondary text-sm w-full py-3 h-auto rounded-lg shadow-md" >
              {flight.players.map((player, index) => (
                <div key={player.id}>{player.name}</div>
              ))}

          </button>
        ))}
      </div>
    </div>
  );
};

export default FlightsPage;
