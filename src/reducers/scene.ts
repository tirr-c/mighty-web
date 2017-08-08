import { Action, Types } from '../actions';

export const enum Scene {
    Connecting,
    Login,
    Lobby,
    Room
}

export type State = {
    scene: Scene,
    connected: boolean
}

const initialState: State = {
    scene: Scene.Connecting,
    connected: false
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'connected':
        if (state.scene === Scene.Connecting) {
            return { scene: Scene.Login, connected: true };
        } else {
            return { ...state, connected: true };
        }
        case 'disconnected':
        return { ...state, connected: false };
        case 'nickname-change-succeed':
        if (state.scene === Scene.Login) {
            return { ...state, scene: Scene.Lobby };
        } else {
            return state;
        }
        case 'join-room':
        if ('userId' in action) {
            return state;
        } else {
            return { ...state, scene: Scene.Room };
        }
        case 'leave-room':
        if ('userId' in action) {
            return state;
        } else {
            return { ...state, scene: Scene.Lobby };
        }
        default:
        return state;
    }
}
