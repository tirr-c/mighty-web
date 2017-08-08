import { Action, Types } from '../actions';

export type State = {
    nickname: string,
    roomId: string
};

const initialState: State = {
    nickname: '',
    roomId: ''
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'nickname-change-succeed':
        return { ...state, nickname: action.nickname };
        case 'join-room': {
            if (!('userId' in action)) {
                return { ...state, roomId: action.roomId };
            } else {
                return state;
            }
        }
        case 'leave-room': {
            if (!('userId' in action)) {
                return { ...state, roomId: '' };
            } else {
                return state;
            }
        }
        default:
        return state;
    }
}
