// @ts-ignore
import Model from './../radiks/src/model';
import { number, any, string } from 'prop-types';
import Comment from './Comment';

export let posts: any;

export class Post extends Model {
  static className = 'Post';

  // @ts-ignore
  attrs: IPost;
  
  static schema  = {
    description: {
      type: String,
      decrypted: true,
    },
    image: {
      type: String, // base64
      decrypted: true,
    },
    createdBy: {
      type: String,
      decrypted: true,
    },
    likes: {
      type: number,
      decrypted: true,
    },
    placeId :{
      type: string,
      decrypted: true
    },
    geohash :{
      type: string,
      decrypted: true
    },
    content : {
      type: string,
      decrypted: true
    },
    tags: {
      type: Array,
      decrypted: true
    },
    updatedAt: {
      type: number,
      decrypted: true
    },
    latitude: {
      type: number,
      decrypted: true
    },
    longitude: {
      type: number,
      decrypted: true
    },
    location: {
      type: Array,
      decrypted: true
    },
    isSynced: {
      type: Boolean,
      decrypted: true
    },
    clientGuid: {
      type: string,
      decrypted: true
    }
  };
  
  

  async afterFetch() {
    posts = await Comment.fetchList({
      // @ts-ignore
      postId: this.id,
    })
  }

}

export interface IPost {
  _id: string;
  user: string;
  description?: string;
  image: string;
  avatar?: string;
  createdBy?: string;
  likes?: number;
  placeId: string;
  geohash: string;
  content : string;
  tags: Array<string>;
  updatedAt?: number;
  latitude? : number;
  longitude?: number;
  location: Array<number>;
  isSynced?: Boolean;
  clientGuid: string;
  hashtagColor: string;
  time: string;
  pullRight: boolean;
}