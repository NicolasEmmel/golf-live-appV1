'use client'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import AddStrokes from './AddStrokes';
import HoleSelector from './HoleSelector';
import funcs from '../lib/getHoles';
import { hole, holescore } from '@prisma/client';

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
        [playerId: number]: { [holeId: number]: { strokes: number; putts: number; mulligans: number } };
    }>({});

    const [selectedOption, setSelectedOption] = useState<number>(1);



    // Handle stroke changes for a specific player on a specific hole
    const handleScoreChange = (playerId: number, holeId: number, strokes: number, putts: number, mulligans: number) => {
        setScores((prevScores) => ({
            ...prevScores,
            [playerId]: {
                ...prevScores[playerId],
                [holeId]: {
                    strokes,
                    putts,
                    mulligans,
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
                        <h2 className="text-xl font-normal text-center mb-2">PAR {currentHole.par} - 540m</h2>
                    </div>


                    <div className="overflow-x-auto flex-grow">
                        {flight.map((player) => (
                            <div key={player.id} className='flex flex-col mb-2 gap-s'>
                                <div className='flex text-center text-xl'>{player.name}</div>
                                <AddStrokes
                                    holeId={currentHole.holeid}
                                    par={currentHole.par}
                                    strokes={scores[player.id]?.[currentHole.holeid]?.strokes ?? currentHole.par}
                                    putts={scores[player.id]?.[currentHole.holeid]?.putts ?? 0}
                                    mulligans={scores[player.id]?.[currentHole.holeid]?.mulligans ?? 0}
                                    onScoreChange={(strokes, putts, mulligans) => handleScoreChange(player.id, currentHole.holeid, strokes, putts, mulligans)}>
                                </AddStrokes>
                            </div>

                        ))}
                    </div>
                </div>
            )}
            <div className='btm-nav bottom-20 bg-primary'>
                <HoleSelector selectedOption={selectedOption} onHoleChange={handleHoleChange} />
            </div>
            <div className='btm-nav bg-accent'>
                <button className="btn btn-success w-full mt-4" onClick={submitScores}>
                    Submit Scores
                </button>
            </div>

        </>
    )
}

export default Flight