import { Post } from './../../models/Post';

export interface IState {
    posts: Array<Post>;
    markers: Array<any>;
    error: any;
}

export const initialState: IState = {
    posts: [
        new Post({
            _id: '44',
            image: 'https://banter-pub.imgix.net/users/nicktee.id',
            user: 'Nick',
            tags: ["#coffee"],
            hashtagColor: "#4c9aff",
            time: "5 mins",
            content: "44",
            pullRight: true,
            location: [2, 3],
            clientGuid: '30c9854a-290b-4bfa-b089-8e0864444007',
            geohash: 'a'
        })
    ],
    markers: [
        {
            name: 'Nick',
            coordinate: {
                latitude: 47.122036,
                longitude: -88.564358
            },
            image: 'https://banter-pub.imgix.net/users/nicktee.id'
        }
    ],
    error: {}
}
