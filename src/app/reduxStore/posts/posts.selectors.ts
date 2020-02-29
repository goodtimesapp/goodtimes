import { createSelector } from 'reselect';
import { IState } from './posts.state';

const postsSelector = createSelector((state: IState) => state, state => state);

export const selectors = {
    postsSelector
}