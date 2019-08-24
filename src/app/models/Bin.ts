import {Location} from './Location';

export interface Bin {
    _id: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    location: Location 
}