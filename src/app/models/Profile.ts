// @ts-ignore
import Model from './../radiks/src/model';

export  class Profile extends Model {
  static className = 'Profile';
  static schema = {
    firstName: {
      type: String,
      decrypted: true,
    },
    image: {
      type: String,
      decrypted: true,
    }
  };
}
