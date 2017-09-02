import { State } from '~reducers';

export type ActionType = 'update-room-list-request' | 'update-room-list';

export interface NetworkRoomInfo {
    id: string,
    name: string
}

interface UpdateRoomListRequestAction {
    type: 'update-room-list-request'
}
interface UpdateRoomListAction {
    type: 'update-room-list',
    rooms: NetworkRoomInfo[]
}
export type Action = UpdateRoomListRequestAction | UpdateRoomListAction;

export function updateRoomList() {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject();
                return;
            }
            dispatch({
                type: 'update-room-list-request'
            });
            socket.emit('room-list', (list: string[]) => {
                dispatch({
                    type: 'update-room-list',
                    rooms: list.map(x => ({ id: x, name: x }))
                });
                resolve();
            });
        });
    };
}
