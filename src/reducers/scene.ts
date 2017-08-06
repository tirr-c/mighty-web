import { Action, Types } from '../actions';

export const enum Scene {
    Connecting,
    Login,
    Lobby,
    Room
}

export type State = {
    scene: Scene
}

const initialState: State = {
    scene: Scene.Connecting
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'connection-connected':
        if (state.scene === Scene.Connecting) {
            return { scene: Scene.Login };
        } else {
            return state;
        }
        case 'user-nickname-change-succeed':
        if (state.scene === Scene.Login) {
            return { scene: Scene.Lobby };
        } else {
            return state;
        }
        default:
        return state;
    }
}