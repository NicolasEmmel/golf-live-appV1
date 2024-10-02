'use client'
import { hole } from "@prisma/client";
import useSWR from "swr";

export default function GetHoles(){
    const fetcher = () => fetch('/api/holes').then((res) => res.json());
    const { data, error, isLoading } = useSWR('/api/holes', fetcher);

    

    const holes: hole[] = data;

    return holes;
}