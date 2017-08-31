import { State } from '../reducers';

export type ActionType = 'join-room' | 'leave-room';

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
export type Action = JoinRoomAction | LeaveRoomAction;

function listenJoin(roomId: string, socket: SocketIOClient.Socket, dispatch: (action: Action) => Action) {
    socket.on('join-room', (userId: string, userList: string[]) => {
        dispatch({
            type: 'join-room',
            roomId,
            userId,
            userList
        });
    });
    socket.on('leave-room', (userId: string, userList: string[]) => {
        dispatch({
            type: 'leave-room',
            roomId,
            userId,
            userList
        });
    });
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
                    reject(`Creating room failed`);
                    return;
                }
                listenJoin(roomId, socket, dispatch);
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
            socket.emit('join-room', roomId, (users: string[] | null) => {
                if (users === null) {
                    reject(`Joining room #${roomId} failed`);
                    return;
                }
                listenJoin(roomId, socket, dispatch);
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
                    socket.off('join-room');
                    socket.off('leave-room');
                    dispatch({
                        type: 'leave-room',
                        roomId: getState().game.id
                    });
                    resolve();
                } else {
                    reject(`Leaving room failed`);
                }
            });
        });
    };
}
