'use client'
import Link from 'next/link';

const TournamentPage = () => {
  return (
    <div>
      <div className='flex items-center justify-center text-xl font-bold mb-10'>
        <h1>Mulligan-Cup 2024</h1>
      </div>

      <div className='mt-2 mb-2 grid grid-cols-2 gap-8 justify-between'>
        <Link className="btn btn-secondary w-full" href="/leaderboard">
          Zum Leaderboard
        </Link>
        <Link className="btn btn-secondary w-full" href="/flights">
          Zu den Flights
        </Link>
      </div>
    </div>
  );
};

export default TournamentPage;
