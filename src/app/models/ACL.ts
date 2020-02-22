
export interface ACL {
    location: Array<number>;
    distance: number;
    readers: Array<any>; // ['nicktee.id', 'jason.id'] = only specific users || ['*'] = global to geospatial radius || [] = private to you
    expires: number;
    geohash: string;
}

/// example ACL
//   export let acl: ACL = {
//     distance : 1000,
//     location : [43, 12],
//     readers: ['*'],
//     expires: 123245,
//     geohash: 'a'
//   }