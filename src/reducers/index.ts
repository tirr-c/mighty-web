import * as User from './user';
import * as Scene from './scene';
import * as Lobby from './lobby';
import { combineReducers } from 'redux';

export type State = {
    user: User.State,
    scene: Scene.State,
    lobby: Lobby.State
};

export const reduce = combineReducers<State>({
    user: User.reduce,
    scene: Scene.reduce,
    lobby: Lobby.reduce
});
