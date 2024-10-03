// app/leaderboard/page.tsx
import React from 'react';
import Leaderboard from '../components/Leaderboard';

// Async Server Component to fetch the initial leaderboard data
async function LeaderboardPage() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/leaderboard`, {
    cache: 'no-store', // Ensure the data is fetched fresh
  });
  const initialLeaderboard = await res.json();

  return <Leaderboard initialLeaderboard={initialLeaderboard} />;
}

export default LeaderboardPage;
