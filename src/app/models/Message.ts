import Model from 'radiks/src/model';


export default class Message extends Model {
  static className = 'Message';

  static schema = {
    content: {
      type: String,
      decrypted: true,
    },
    image: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
      decrypted: true,
    }
  };

}
