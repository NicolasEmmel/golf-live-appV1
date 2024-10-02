import { hole } from '@prisma/client';
import React from 'react'
import useSWR from 'swr';

interface Props {
    selectedOption: number;
    onHoleChange: (holeid: number) => void;
}

const HoleSelector: React.FC<Props> = ({ selectedOption, onHoleChange }) => {
    const fetcher = () => fetch('/api/holes').then((res) => res.json());
    const { data, error, isLoading } = useSWR('/api/holes', fetcher);

    const holes: hole[] = data;

    return (
        <div className='p-1 flex flex-col gap-2 items-center'>
            <div className='flex gap-1'>
                {holes.map((hole) => (
                    hole.holeid < (10) &&
                    <input
                        onChange={() => onHoleChange(hole.holeid)} checked={selectedOption === hole.holeid} key={hole.holeid} type="radio" value={hole.holeid} aria-label={hole.holeid.toString()} name='hole' className='btn p-1 min-h-8 h-8 w-8' />
                ))}
            </div>
            <div className='flex gap-1'>
                {holes.map((hole) => (
                    hole.holeid > (9) &&
                    <input
                        onChange={() => onHoleChange(hole.holeid)} checked={selectedOption === hole.holeid} key={hole.holeid} type="radio" value={hole.holeid} aria-label={hole.holeid.toString()} name='hole' className='btn p-1 min-h-8 h-8 w-8' />
                ))}
            </div>
        </div>
    )
}

export default HoleSelector