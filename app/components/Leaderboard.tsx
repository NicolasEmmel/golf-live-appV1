'use client'; // Use this in any component that runs client-side logic (SWR)

import React, { useState } from 'react';
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
  totalDrinks: number;
}>;

const Leaderboard = ({ initialLeaderboard }: { initialLeaderboard: Leaderboard }) => {
  const version: string = "1.1";
  // Use SWR to revalidate the leaderboard every second
  const { data: leaderboard, error } = useSWR('/api/leaderboard', fetcher, {
    fallbackData: initialLeaderboard, // Start with initial server-side data
    refreshInterval: 1000, // Revalidate every 1 second
  });

  const [sortKey, setSortKey] = useState<string>('toPar');
  const [sortOrder, setSortOrder] = useState<boolean>(true); // true for ascending, false for descending

  if (error) return <div>Error loading leaderboard</div>;
  if (!leaderboard) return <div>Loading...</div>;

  // Filter out players who haven't played at least one hole
  const filteredLeaderboard = leaderboard.filter((player: Leaderboard[0]) => player.holesPlayed > 0);

  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => {
    const direction = sortOrder ? 1 : -1;
    if (a[sortKey] < b[sortKey]) return -1 * direction;
    if (a[sortKey] > b[sortKey]) return 1 * direction;
    return 0;
  });

  const handleSort = (key: keyof Leaderboard[0]) => {
    if (sortKey === key) {
      setSortOrder(!sortOrder); // Toggle sort order if the same column is clicked
    } else {
      setSortKey(key); // Set new sort key and default to ascending order
      setSortOrder(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Mulligan Cup 2024 Live-Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="table-sm w-full">
          <thead className="text-left">
            <tr>
              <th>Pos</th>
              <th>Player</th>
              <th onClick={() => handleSort('toPar')} className="cursor-pointer">To Par</th>
              <th>Thru</th>
              <th onClick={() => handleSort('bruttoScore')} className="cursor-pointer">Brutto</th>
              <th onClick={() => handleSort('nettoScore')} className="cursor-pointer">Netto</th>
              <th onClick={() => handleSort('totalPutts')} className="cursor-pointer">Putts</th>
              <th onClick={() => handleSort('totalMulligans')} className="cursor-pointer">Mulligans</th>
              <th onClick={() => handleSort('totalDrinks')} className="cursor-pointer">Drinks (Schläger)</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {sortedLeaderboard.map((player, index) => (
              <tr key={index} className="border-y-2">
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.toPar}</td>
                <td>{player.holesPlayed}</td>
                <td>{player.bruttoScore}</td>
                <td>{player.nettoScore}</td>
                <td>{player.totalPutts}</td>
                <td>{player.totalMulligans}</td>
                <td>{player.totalDrinks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
