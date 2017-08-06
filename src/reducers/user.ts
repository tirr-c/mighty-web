import { Action, Types } from '../actions';

export type State = {
    nickname: string
};

const initialState: State = {
    nickname: ''
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'user-nickname-change-succeed':
        return { nickname: action.nickname };
        default:
        return state;
    }
}