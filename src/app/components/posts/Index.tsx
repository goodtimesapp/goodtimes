import { connect } from 'react-redux';
import { State } from './../../reduxStore/index';
import { 
  posts,
  putPost,
  getPosts
} from './../../reduxStore/posts/posts.store';
import { placeState } from './../../reduxStore/places/place.store';

import PostComponent from './Posts';
import { stat } from 'fs';

// Global State
const mapStateToProps: any = (state: State) => ({
  posts: posts(state.posts),
  placeState: placeState(state.places)
})

// Actions to dispatch
const mapDispatchToProps = {
    putPost: putPost,
    getPosts: getPosts
}

export let PostsPage = connect<any, any, any>(mapStateToProps, mapDispatchToProps)(PostComponent);
