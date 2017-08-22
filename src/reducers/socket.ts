import { Action, Types } from '../actions';

export type State = SocketIOClient.Socket | null;

const initialState: State = null;

export function reduce(state = initialState, action: Action) {
    switch (action.type) {
        case 'connected':
            return action.socket;
        default:
            return state;
    }
}
