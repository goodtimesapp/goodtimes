// @ts-ignore
import Model from './../radiks/lib/model.js';


export default class Message extends Model {
  static className = 'Message';

  static schema = {
    content: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
      decrypted: true,
    },
    _id: {
        type: String,
        decrypted: true
    }
  };

}
