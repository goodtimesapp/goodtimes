// @ts-ignore
import Model from './../radiks/src/model';
import { number, any } from 'prop-types';


export default class Comment extends Model {
  static className = 'Comment';

  static schema = {
    text: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
      decrypted: true,
    },
    postId: {
      type: String,
      decrypted: true,
    }
  };

}
