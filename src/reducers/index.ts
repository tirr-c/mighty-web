import * as User from './user';
import * as Scene from './scene';
import { combineReducers } from 'redux';

export type State = {
    user: User.State,
    scene: Scene.State
};

export const reduce = combineReducers<State>({
    user: User.reduce,
    scene: Scene.reduce
});