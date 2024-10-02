import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

interface Props {
    //playerId: number,
    holeId: number,
    par: number,
    strokes: number,
    putts: number,
    mulligans: number,
    onScoreChange: (strokes: number, putts: number, mulligans: number) => void;
}

const loading: boolean = false


const AddStrokes: React.FC<Props> = ({ holeId, par, strokes, putts, mulligans, onScoreChange }) => {
    const [currentStrokes, setCurrentStrokes] = useState(strokes);
    const [currentPutts, setCurrentPutts] = useState(putts);
    const [currentMulligans, setCurrentMulligans] = useState(mulligans);

    useEffect(() => {
        setCurrentStrokes(strokes); // Update strokes when hole changes
        setCurrentPutts(putts);
        setCurrentMulligans(mulligans);
    }, [holeId, strokes, putts, mulligans]);

    const handleAddStroke = (event: React.MouseEvent<HTMLButtonElement>, inc: number) => {
        const newStrokes = currentStrokes + inc;
        setCurrentStrokes(newStrokes);
        onScoreChange(newStrokes, currentPutts, currentMulligans);
    };

    const handleAddPutts = (event: React.MouseEvent<HTMLButtonElement>, inc: number) => {
        const newPutts = currentPutts + inc;
        setCurrentPutts(newPutts);
        onScoreChange(currentStrokes, newPutts, currentMulligans);
    };

    const handleAddMulligans = (event: React.MouseEvent<HTMLButtonElement>, inc: number) => {
        const newMulligans = currentMulligans + inc;
        setCurrentMulligans(newMulligans);
        onScoreChange(currentStrokes, currentPutts, newMulligans);
    };

    return (
        <div className='flex gap-3 justify-between'>

            <div className='border rounded-md grid grid-cols-3 p-2 gap-x-3'>
                <div className='col-span-2'><label>Schläge</label></div>
                <div className='flex items-center col-start-1'><label className='text-2xl'>{currentStrokes}</label></div>
                <div className='flex flex-col gap-2 justify-center col-start-3 row-start-1 row-span-2'>
                    <button onClick={(event) => handleAddStroke(event, 1)} className='btn btn-circle btn-xs text-white'>+</button>
                    <button onClick={(event) => handleAddStroke(event, -1)} className='btn btn-circle btn-xs text-white'>-</button>
                </div>
            </div>

            <div className='border rounded-md grid grid-cols-3 p-2 gap-x-3'>
                <div className='col-span-2'><label>Putts</label></div>
                <div className='flex items-center col-start-1'><label className='text-2xl'>{currentPutts}</label></div>
                <div className='flex flex-col gap-2 justify-center col-start-3 row-start-1 row-span-2'>
                    <button onClick={(event) => handleAddPutts(event, 1)} className='btn btn-circle btn-xs text-white'>+</button>
                    <button onClick={(event) => handleAddPutts(event, -1)} className='btn btn-circle btn-xs text-white'>-</button>
                </div>
            </div>

            <div className='border rounded-md grid grid-cols-3 p-2 gap-x-3'>
                <div className='col-span-2'><label>Mullis</label></div>
                <div className='flex items-center col-start-1'><label className='text-2xl'>{currentMulligans}</label></div>
                <div className='flex flex-col gap-2 justify-center col-start-3 row-start-1 row-span-2'>
                    <button onClick={(event) => handleAddMulligans(event, 1)} className='btn btn-circle btn-xs text-white'>+</button>
                    <button onClick={(event) => handleAddMulligans(event, -1)} className='btn btn-circle btn-xs text-white'>-</button>
                </div>
            </div>
        </div>


    )
}

export default AddStrokes