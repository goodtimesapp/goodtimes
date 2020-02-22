// @ts-ignore
import { Model } from 'radiks';
import { Attrs } from './Attrs';
import { ACL } from './ACL';


export class ActiveUser extends Model {
  static className = 'ActiveUser';

  // @ts-ignore
  attrs: IActiveUser;
  
  static schema  = {
    userId: {
      type: String
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    },
    awayMessage: {
      type: String
    },
    acl: {
      // @ts-ignore
      type: ACL,
      decrypted: true,
    },
    userGroupId: {
      type: String,
      decrypted: true,
    }
  };
}

export interface IActiveUser extends Attrs {
  user: string;
  avatar?: string;
  awayMessage: string;
  acl: ACL, // access control level
  userGroupId: string;
}


