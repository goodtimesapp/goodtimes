// @ts-ignore
import Model from './../radiks/src/model';
import { number, any, string } from 'prop-types';
import Comment from './Comment';

export let posts: any;

export class Post extends Model {
  static className = 'Post';

  static schema = {
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
    }
  };

  async afterFetch() {
    posts = await Comment.fetchList({
      // @ts-ignore
      postId: this.id,
    })
  }

}
