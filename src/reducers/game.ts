import { Action, Types } from '../actions';

export type State = {
    id: string,
    members: string[]
};

const initialState: State = {
    id: '',
    members: []
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'join-room': {
            if ('userId' in action) {
                if (state.id !== action.roomId) return state;
                return { ...state, members: action.userList };
            } else {
                return { ...state, id: action.roomId, members: action.userList };
            }
        }
        case 'leave-room': {
            if ('userId' in action) {
                if (state.id !== action.roomId) return state;
                return { ...state, members: action.userList };
            } else {
                return { id: '', members: [] }; // reset
            }
        }
        default:
            return state;
    }
}
