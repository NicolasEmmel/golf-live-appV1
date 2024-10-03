// components/Leaderboard.tsx
'use client'; // Use this in any component that runs client-side logic (SWR)

import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Leaderboard = Array<{
  name: string;
  toPar: number;
  bruttoScore: number;
  nettoScore: number;
  holesPlayed: number;
  totalPutts: number;
  totalMulligans: number;
}>;

const Leaderboard = ({ initialLeaderboard }: { initialLeaderboard: Leaderboard }) => {
  // Use SWR to revalidate the leaderboard every second
  const { data: leaderboard, error } = useSWR('/api/leaderboard', fetcher, {
    fallbackData: initialLeaderboard, // Start with initial server-side data
    refreshInterval: 1000, // Revalidate every 1 second
  });

  if (error) return <div>Error loading leaderboard</div>;
  if (!leaderboard) return <div>Loading...</div>;

  const test: Leaderboard = leaderboard;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Mulligan Cup 2024 Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="table-sm w-full">
          <thead className="text-left">
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th>To Par</th>
              <th>Thru</th>
              <th>Brutto</th>
              <th>Netto</th>
              <th>Putts</th>
              <th>Mulligans</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {test.map((player, index) => (
              <tr key={index} className="border-y-2">
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.toPar}</td>
                <td>{player.holesPlayed}</td>
                <td>{player.bruttoScore}</td>
                <td>{player.nettoScore}</td>
                <td>{player.totalPutts}</td>
                <td>{player.totalMulligans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
