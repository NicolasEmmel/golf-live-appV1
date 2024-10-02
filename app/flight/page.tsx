'use client'
import React from 'react'
import Flight from '../components/Flight';
import useSWR from 'swr';
import { hole } from '@prisma/client';

interface Props {
    searchParams: { flightId: number }
}

let holes: hole[];
let players: Flight;




const FlightPage = ({ searchParams: { flightId } }: Props) => {
    function GetHoles() {
        const fetcher = () => fetch('/api/holes').then((res) => res.json());
        const { data, error, isLoading } = useSWR('/api/holes', fetcher);
    
        if(isLoading) return (<div>Loading</div>)
    
        holes = data;
    }
    
    function GetFlight(flightId: number) {
        const fetcherPlayers = () => fetch('/api/flight/' + flightId.toString()).then((res) => res.json());
        const { data, error, isLoading } = useSWR('/api/flight/' + flightId.toString(), fetcherPlayers);
    
        if(isLoading) return (<div>Loading</div>)
    
        players = data;
    }

    GetHoles();
    GetFlight(flightId);

    if(!holes) return(<div>Loading Holes</div>)

    if(!players) return(<div>Loading Flight</div>)




    return (<Flight holes={holes} flight={players} searchParams={{ flightId: flightId }}></Flight>)
}

export default FlightPage