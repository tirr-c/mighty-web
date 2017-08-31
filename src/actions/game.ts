import { State } from '../reducers';

export type ActionType = 'member-state-changed' | 'join-room' | 'leave-room' | 'ready';

type MemberState = {
    id: string,
    ready: boolean
};

interface MemberStateChangedAction {
    type: 'member-state-changed';
    userList: MemberState[];
}
interface JoinRoomAction {
    type: 'join-room';
    roomId: string;
    userId?: string;
}
interface LeaveRoomAction {
    type: 'leave-room';
    roomId: string;
    userId?: string;
}
interface ReadyAction {
    type: 'ready';
    ready: boolean;
    roomId: string;
    userId: string;
}
export type Action = MemberStateChangedAction | JoinRoomAction | LeaveRoomAction | ReadyAction;

function listen(roomId: string, socket: SocketIOClient.Socket, dispatch: (action: Action) => Action) {
    socket.on('join-room', (userId: string, userList: MemberState[]) => {
        console.log('join-room', userId, userList);
        dispatch({
            type: 'join-room',
            roomId,
            userId
        });
        dispatch({
            type: 'member-state-changed',
            userList: userList
        });
    });
    socket.on('leave-room', (userId: string, userList: MemberState[]) => {
        dispatch({
            type: 'leave-room',
            roomId,
            userId
        });
        dispatch({
            type: 'member-state-changed',
            userList: userList
        });
    });
    socket.on('ready', (user: MemberState, userList: MemberState[]) => {
        dispatch({
            type: 'ready',
            ready: user.ready,
            roomId: roomId,
            userId: user.id
        });
        dispatch({
            type: 'member-state-changed',
            userList: userList
        });
    });
}
function unlisten(socket: SocketIOClient.Socket) {
    socket.off('join-room');
    socket.off('leave-room');
    socket.off('ready');
}

export function createRoom() {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject('Not connected to server');
                return;
            }
            socket.emit('create-room', (roomId: string | null) => {
                if (roomId === null) {
                    reject(`Creating room failed`);
                    return;
                }
                listen(roomId, socket, dispatch);
                dispatch({
                    type: 'join-room',
                    roomId: roomId
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
                reject('Not connected to server');
                return;
            }
            socket.emit('join-room', roomId, (succeed: boolean) => {
                if (!succeed) {
                    reject(`Joining room #${roomId} failed`);
                    return;
                }
                listen(roomId, socket, dispatch);
                dispatch({
                    type: 'join-room',
                    roomId: roomId
                });
                resolve();
            });
        });
    };
}

export function leaveRoom() {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject('Not connected to server');
                return;
            }
            socket.emit('leave-room', (succeed: boolean) => {
                if (succeed) {
                    unlisten(socket);
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

export function setReady(ready: boolean) {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = getState().socket;
            if (socket === null) {
                reject('Not connected to server');
                return;
            }
            socket.emit('ready', ready, (succeed: boolean) => {
                if (!succeed) {
                    reject('Changing ready state failed');
                    return;
                }
                resolve();
            });
        });
    };
}
