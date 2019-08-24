// @ts-ignore
import Model from './../radiks/lib/model.js';

export default class Vote extends Model {
  static className = 'Vote';

  static schema = {
    messageId: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    }
  }
};
