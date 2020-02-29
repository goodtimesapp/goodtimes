import { User } from 'radiks/src';
import { Post } from './../../models/Post';

export async function getPostsApi(filter: any = {}): Promise<any>{
    await User.createWithCurrentUser();
    let posts = Post.fetchList(filter);
    return posts;
}