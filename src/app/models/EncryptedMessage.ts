// @ts-ignore
import Model from './../radiks/src/model';

export default class EncryptedMessage extends Model {
  static className = 'EncryptedMessage';

  static schema = {
    content: {
      type: String,
    },
    category: {
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
    },
    userGroupId: {
      type: String,
      decrypted: true,
    }
  };
}
