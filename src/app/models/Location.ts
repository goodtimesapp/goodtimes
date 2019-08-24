export interface Location {
    createdAt?: string;
    description?: string;
    enabled?: boolean;
    externalId?: string;
    geometry?: any;
    geometryCenter?: any;
    geometryRadius?: number;
    live?: boolean;
    tag?: string;
    type?: string;
    updatedAt?: string;
    _id?: string,
    radius?: string,
    coordinates?: string
}

export interface Coordinate {
    latitude: number;
    longitude: number;
}