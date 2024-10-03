import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

interface Props {
    //playerId: number,
    holeId: number,
    name: string,
    strokes: number,
    putts: number,
    mulligan: number,
    drinks: number
    onScoreChange: (strokes: number, putts: number, drinks: number, mulligans: number) => void;
}

const loading: boolean = false


const AddStrokes: React.FC<Props> = ({ holeId, name, strokes, putts, drinks, mulligan, onScoreChange }) => {
    const [currentStrokes, setCurrentStrokes] = useState(strokes);
    const [currentPutts, setCurrentPutts] = useState(putts);
    const [currentdrinks, setCurrentdrinks] = useState(drinks);
    const [currentMulligan, setMulligan] = useState(mulligan);

    useEffect(() => {
        setCurrentStrokes(strokes); // Update strokes when hole changes
        setCurrentPutts(putts);
        setCurrentdrinks(drinks);
        setMulligan(mulligan);
    }, [holeId, strokes, putts, drinks, mulligan]);

    const handleAddStroke = (event: React.MouseEvent<HTMLButtonElement>, inc: number) => {
        const newStrokes = currentStrokes + inc;
        setCurrentStrokes(newStrokes);
        onScoreChange(newStrokes, currentPutts, currentdrinks, mulligan);
    };

    const handleAddPutts = (event: React.MouseEvent<HTMLButtonElement>, inc: number) => {
        const newPutts = currentPutts + inc;
        setCurrentPutts(newPutts);
        onScoreChange(currentStrokes, newPutts, currentdrinks, mulligan);
    };

    const handleAdddrinks = (event: React.MouseEvent<HTMLButtonElement>, inc: number) => {
        const newdrinks = currentdrinks + inc;
        setCurrentdrinks(newdrinks);
        onScoreChange(currentStrokes, currentPutts, newdrinks, mulligan);
    };

    const handleSetMulligan = () => {
        let newMulligan = 1;
        if (currentMulligan > 0) newMulligan = 0;
        setMulligan(newMulligan);
        onScoreChange(currentStrokes, currentPutts, currentdrinks, newMulligan);
    }

    return (
        <div>
            <div className='flex text-center text-xl justify-between items-center'>
                <label htmlFor="">{name}</label>
                <label className="cursor-pointer label">
                    <span className="label-text text-white">Mulligan</span>
                    <input type="checkbox" checked={mulligan > 0} onChange={() => handleSetMulligan()} className="checkbox checkbox-secondary ml-4" />
                </label>
            </div>

            <div className='flex gap-3 justify-between'>

                <div className='border rounded-md grid grid-cols-3 p-2 gap-x-3'>
                    <div className='col-span-2'><label>Schläge</label></div>
                    <div className='flex items-center col-start-1'><label className='text-2xl'>{currentStrokes}</label></div>
                    <div className='flex flex-col gap-2 justify-center col-start-3 row-start-1 row-span-2'>
                        <button onClick={(event) => handleAddStroke(event, 1)} className='btn btn-circle bg-secondary border-primary btn-xs text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        <button onClick={(event) => handleAddStroke(event, -1)} className='btn btn-circle bg-secondary border-primary btn-xs text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='border rounded-md grid grid-cols-3 p-2 gap-x-3'>
                    <div className='col-span-2'><label>Putts</label></div>
                    <div className='flex items-center col-start-1'><label className='text-2xl'>{currentPutts}</label></div>
                    <div className='flex flex-col gap-2 justify-center col-start-3 row-start-1 row-span-2'>
                        <button onClick={(event) => handleAddPutts(event, 1)} className='btn btn-circle bg-secondary border-primary btn-xs text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        <button onClick={(event) => handleAddPutts(event, -1)} className='btn btn-circle bg-secondary border-primary btn-xs text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='border rounded-md grid grid-cols-3 p-2 gap-x-3'>
                    <div className='col-span-2'><label>Drinks</label></div>
                    <div className='flex items-center col-start-1'><label className='text-2xl'>{currentdrinks}</label></div>
                    <div className='flex flex-col gap-2 justify-center col-start-3 row-start-1 row-span-2'>
                        <button onClick={(event) => handleAdddrinks(event, 1)} className='btn btn-circle bg-secondary border-primary btn-xs text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        <button onClick={(event) => handleAdddrinks(event, -1)} className='btn btn-circle bg-secondary border-primary btn-xs text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>



    )
}

export default AddStrokes