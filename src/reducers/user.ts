import { Action, Types } from '../actions';

export type State = {
    nickname: string,
    nicknameUpdating: boolean,
};

const initialState: State = {
    nickname: '',
    nicknameUpdating: false,
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'nickname-change-request':
        return { ...state, nicknameUpdating: true };
        case 'nickname-change-succeed':
        return { ...state, nickname: action.nickname, nicknameUpdating: false };
        default:
        return state;
    }
}
