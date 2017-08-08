import { Action } from '../actions';

type RoomNameCache = { [roomId: string]: string };

export type State = {
    roomIds: string[],
    roomNameCache: RoomNameCache
}

const initialState: State = {
    roomIds: [],
    roomNameCache: {}
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'update-room-list': {
            const ids = action.rooms.map(x => x.id);
            const cache = action.rooms.reduce<RoomNameCache>(
                (c, x) => { c[x.id] = name; return c; },
                {}
            );
            return {
                roomIds: ids,
                roomNameCache: { ...state.roomNameCache, ...cache }
            };
        }
        default:
        return state;
    }
}
