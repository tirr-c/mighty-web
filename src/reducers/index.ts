import * as User from './user';
import * as Scene from './scene';
import * as Lobby from './lobby';
import * as Socket from './socket';
import * as Game from './game';
import { combineReducers } from 'redux';

export type State = {
    user: User.State,
    scene: Scene.State,
    lobby: Lobby.State,
    socket: Socket.State,
    game: Game.State
};

export const reduce = combineReducers<State>({
    user: User.reduce,
    scene: Scene.reduce,
    lobby: Lobby.reduce,
    socket: Socket.reduce,
    game: Game.reduce
});
