'use client'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import AddStrokes from './AddStrokes';
import HoleSelector from './HoleSelector';
import funcs from '../lib/getHoles';
import { hole, holescore } from '@prisma/client';
import Link from 'next/link';

type Flight = Array<{
    id: number;
    name: string;
    handicap: number;
    flight: number;
}>;

interface Props {
    searchParams: { flightId: Number },
    holes: hole[],
    flight: Flight
}


const Flight = ({ searchParams: { flightId }, holes, flight }: Props) => {
    const [scores, setScores] = useState<{
        [playerId: number]: { [holeId: number]: { strokes: number; putts: number; mulligans: number; drinks: number } };
    }>({});

    const [selectedOption, setSelectedOption] = useState<number>(1);



    // Handle stroke changes for a specific player on a specific hole
    const handleScoreChange = (playerId: number, holeId: number, strokes: number, putts: number, mulligans: number, drinks: number) => {
        setScores((prevScores) => ({
            ...prevScores,
            [playerId]: {
                ...prevScores[playerId],
                [holeId]: {
                    strokes,
                    putts,
                    mulligans,
                    drinks
                },
            },
        }));
    };

    const handleHoleChange = (holeId: number) => {
        setSelectedOption(holeId);
    };


    const currentHole = holes.find((hole) => hole.holeid === selectedOption);

    // Initialize default scores to par value when the hole changes
    useEffect(() => {
        if (currentHole) {
            setScores((prevScores) => {
                const updatedScores = { ...prevScores };
                flight.forEach((player) => {
                    if (!updatedScores[player.id]?.[currentHole.holeid]) {
                        updatedScores[player.id] = {
                            ...updatedScores[player.id],
                            [currentHole.holeid]: {
                                strokes: currentHole.par, // Default to par
                                putts: 0, // Default to 0
                                mulligans: 0, // Default to 0
                                drinks: 0
                            },
                        };
                    }
                });
                return updatedScores;
            });
        }
    }, [selectedOption, currentHole, flight]);


    const submitScores = async () => {
        if (!currentHole) {
            alert('No hole selected or hole data is missing');
            return;
        }

        // Ensure that currentHole is defined before proceeding
        const holeScores = flight.map((player) => ({
            playerId: player.id,
            holeId: currentHole.holeid, // Since currentHole is confirmed to exist, no need for optional chaining here
            strokes: scores[player.id]?.[currentHole.holeid]?.strokes ?? currentHole.par, // Use default value if undefined
            putts: scores[player.id]?.[currentHole.holeid]?.putts ?? 0, // Use default value if undefined
            mulligans: scores[player.id]?.[currentHole.holeid]?.mulligans ?? 0, // Use default value if undefined
            drinks: scores[player.id]?.[currentHole.holeid]?.drinks ?? 0
        }));


        try {
            const response = await fetch('/api/submitScores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ holeScores }),
            });

            if (response.ok) {

            } else {
                alert('Failed to submit scores.');
            }
        } catch (error) {
            console.error('Error submitting scores:', error);
            alert('An error occurred while submitting scores.');
        }
    };


    return (
        <>
            {currentHole && (
                <div className='flex flex-col min-h-svh p-4'>
                    <div>
                        <h1 className="text-2xl font-bold text-center ">LOCH {selectedOption}</h1>
                        <h2 className="text-xl font-normal text-center mb-2">PAR {currentHole.par}</h2>
                    </div>


                    <div className="overflow-x-auto">
                        {flight.map((player) => (
                            <div key={player.id} className='flex flex-col mb-2 gap-s'>

                                <AddStrokes
                                    holeId={currentHole.holeid}
                                    name={player.name}
                                    strokes={scores[player.id]?.[currentHole.holeid]?.strokes ?? currentHole.par}
                                    putts={scores[player.id]?.[currentHole.holeid]?.putts ?? 0}
                                    drinks={scores[player.id]?.[currentHole.holeid]?.drinks ?? 0}
                                    mulligan={scores[player.id]?.[currentHole.holeid]?.mulligans ?? 0}
                                    onScoreChange={(strokes, putts, drinks, mulligans) => handleScoreChange(player.id, currentHole.holeid, strokes, putts, mulligans, drinks)}>
                                </AddStrokes>
                            </div>

                        ))}
                    </div>
                </div>
            )}
            <div className='btm-nav bottom-20 bg-primary'>
                <HoleSelector selectedOption={selectedOption} onHoleChange={handleHoleChange} />
            </div>
            <div className='btm-nav bg-accent grid grid-cols-5 items-center px-4 gap-2'>
                <Link href='/leaderboard' className='btn btn-secondary text-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>
                </Link>
                <Link href='/randomizer' className='btn btn-secondary text-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                    </svg>
                </Link>
                <button className="btn btn-secondary w-full text-center col-span-3" onClick={submitScores}>
                    Loch Bestätigen
                </button>
            </div>

        </>
    )
}

export default Flight