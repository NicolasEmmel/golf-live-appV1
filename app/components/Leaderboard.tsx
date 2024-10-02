import React from 'react'
import useSWR from 'swr';

type Leaderboard = Array<{
  name: string;
  toPar: number;
  bruttoScore: number;
  nettoScore: number;
  holesPlayed: number;
  totalPutts: number;
  totalMulligans: number;
}>;
;

const Leaderboard = () => {
  const fetcher = () => fetch('/api/leaderboard').then((res) => res.json());
  //const { data, error, isLoading } = useSWR('/api/leaderboard', fetcher, { refreshInterval: 1000 });
  const { data, error, isLoading } = useSWR('/api/leaderboard', fetcher);

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error...</div>

  const leaderboard: Leaderboard = data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Mulligan Cup 2024 Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="table-sm w-full">
          <thead className='text-left'>
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
          <tbody className='font-medium'>
          {leaderboard.map((player, index) => (
              <tr key={index} className='border-y-2'>
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
  )
}

export default Leaderboard