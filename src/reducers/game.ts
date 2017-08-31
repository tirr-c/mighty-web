import { Action, Types } from '../actions';

export type State = {
    id: string,
    members: string[],
    ready: { [memberId: string]: boolean }
};

const initialState: State = {
    id: '',
    members: [],
    ready: {}
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'join-room': {
            if ('userId' in action) {
                return state;
            } else {
                return { ...state, id: action.roomId };
            }
        }
        case 'leave-room': {
            if ('userId' in action) {
                return state;
            } else {
                return initialState; // reset
            }
        }
        case 'member-state-changed': {
            if (state.id === '') return state; // ignore
            const list = action.userList;
            const members = list.map(x => x.id);
            const ready = list.map(
                x => ({ [x.id]: x.ready })
            ).reduce(
                (ready, x) => ({ ...ready, ...x }), {}
            );
            return { ...state, members: members, ready: ready };
        }
        default:
            return state;
    }
}
