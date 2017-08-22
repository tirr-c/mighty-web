import { Action } from '../actions';

type RoomNameCache = { [roomId: string]: string };

export type State = {
    roomIds: string[],
    roomNameCache: RoomNameCache,
    roomUpdating: boolean
}

const initialState: State = {
    roomIds: [],
    roomNameCache: {},
    roomUpdating: false
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'update-room-list-request':
            return { ...state, roomUpdating: true };
        case 'update-room-list': {
            const ids = action.rooms.map(x => x.id);
            const cache = action.rooms.reduce<RoomNameCache>(
                (c, x) => { c[x.id] = x.name; return c; },
                {}
            );
            return {
                roomIds: ids,
                roomNameCache: { ...state.roomNameCache, ...cache },
                roomUpdating: false
            };
        }
        default:
            return state;
    }
}
