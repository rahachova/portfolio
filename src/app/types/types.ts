export type Car = {
    id: number;
    name: string;
    color: string;
};

export type CarStart = {
    distance: number;
    velocity: number;
};

export type Winner = {
    id?: number;
    time: number;
    wins: number;
};

export type FullWinner = Car & Winner;

export type Sorting = 'id' | 'wins' | 'time';

export type Order = 'ASC' | 'DESC';
