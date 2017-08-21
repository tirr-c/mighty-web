import { Action, Types } from '../actions';

export type State = {
    nickname: string,
    nicknameUpdating: boolean,
    roomId: string
};

const initialState: State = {
    nickname: '',
    nicknameUpdating: false,
    roomId: ''
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'nickname-change-request':
        return { ...state, nicknameUpdating: true };
        case 'nickname-change-succeed':
        return { ...state, nickname: action.nickname, nicknameUpdating: false };
        case 'join-room': {
            if ('userId' in action) {
                return state;
            } else {
                return { ...state, roomId: action.roomId };
            }
        }
        case 'leave-room': {
            if ('userId' in action) {
                return state;
            } else {
                return { ...state, roomId: '' };
            }
        }
        default:
        return state;
    }
}
