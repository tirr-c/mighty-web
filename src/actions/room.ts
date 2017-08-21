import { State } from '../reducers';

export type ActionType = 'update-room-list' | 'join-room' | 'leave-room';

export interface NetworkRoomInfo {
    id: string,
    name: string
}

interface UpdateRoomListAction {
    type: 'update-room-list',
    rooms: NetworkRoomInfo[]
}
interface JoinRoomAction {
    type: 'join-room',
    roomId: string,
    userId?: string,
    userList: string[]
}
interface LeaveRoomAction {
    type: 'leave-room',
    roomId: string,
    userId?: string,
    userList?: string[]
}
export type Action = UpdateRoomListAction | JoinRoomAction | LeaveRoomAction;

export function updateRoomList() {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject();
                return;
            }
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

export function createRoom() {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject();
                return;
            }
            socket.emit('create-room', (roomId: string | null) => {
                if (roomId === null) {
                    reject();
                    return;
                }
                dispatch({
                    type: 'join-room',
                    roomId: roomId,
                    userList: [socket.id]
                });
                resolve();
            });
        });
    };
}

export function joinRoom(roomId: string) {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject();
                return;
            }
            socket.emit('join-room', (users: string[] | null) => {
                if (users === null) {
                    reject();
                    return;
                }
                dispatch({
                    type: 'join-room',
                    roomId: roomId,
                    userList: users
                });
            });
        });
    };
}

export function leaveRoom() {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject();
                return;
            }
            socket.emit('leave-room', (succeed: boolean) => {
                if (succeed) {
                    dispatch({
                        type: 'leave-room',
                        roomId: getState().user.roomId
                    });
                    resolve();
                } else {
                    reject();
                }
            });
        });
    };
}
