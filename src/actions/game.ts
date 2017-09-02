import { State } from '../reducers';
import { GamePhase } from '../reducers/game';
import { Card, Giruda } from '../utils';

export type ActionType = 'member-state-changed' | 'join-room' | 'leave-room' | 'ready' |
    'reset' | 'deal' | 'pending-commit' | 'waiting-president' | 'floor-cards';

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
interface ResetAction {
    type: 'reset';
}
interface DealAction {
    type: 'deal';
    cards: Card[];
    dealMissAvailable: boolean;
}
interface PendingCommitAction {
    type: 'pending-commit';
    userId: string;
}
interface WaitingPresidentAction {
    type: 'waiting-president';
}
interface FloorCardsAction {
    type: 'floor-cards';
    cards: Card[]
}
export type Action = MemberStateChangedAction | JoinRoomAction | LeaveRoomAction | ReadyAction |
    ResetAction | DealAction | PendingCommitAction | WaitingPresidentAction | FloorCardsAction;

function listen(roomId: string, socket: SocketIOClient.Socket, dispatch: any) {
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
    socket.on('reset', () => {
        dispatch({
            type: 'reset'
        });
    });
    socket.on('deal', (cards: string[]) => {
        const cardObjects = cards.map(Card.fromCardCode).filter(x => x !== null);
        if (cardObjects.length !== 10) {
            console.error('!!! Received invalid card code');
        }
        const dealPoint = cardObjects.map(x => x.dealPoint).reduce((point, x) => point + x, 0);
        dispatch({
            type: 'deal',
            cards: cardObjects,
            dealMissAvailable: dealPoint <= 0
        });
        if (dealPoint > 0) {
            dispatch(decideDealMiss(false));
        }
    });
    socket.on('commitment-request', (userId: string) => {
        dispatch({
            type: 'pending-commit',
            userId: userId
        });
    });
    socket.on('waiting-president', () => {
        dispatch({
            type: 'waiting-president'
        });
    });
    socket.on('floor-cards', (cards: string[]) => {
        dispatch({
            type: 'floor-cards',
            cards: cards.map(Card.fromCardCode)
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

export function decideDealMiss(dealMiss: boolean) {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const socket = state.socket;
            if (socket === null) {
                reject('Not connected to server');
                return;
            }
            if (dealMiss && state.game.gameState.phase !== GamePhase.PendingDealMiss) {
                reject('Not allowed to claim deal miss');
                return;
            }
            socket.emit('deal-miss', dealMiss, (succeed: boolean) => {
                if (!succeed) {
                    reject('Not allowed to claim deal miss');
                    return;
                }
                resolve();
            })
        })
    };
}

function commitInternal(obj: any) {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const socket = state.socket;
            if (socket === null) {
                reject('Not connected to server');
                return;
            }
            if (
                state.game.gameState.phase !== GamePhase.PendingCommitment ||
                state.game.gameState.currentTurn !== state.socket.id
            ) {
                reject('It\'s not your turn');
                return;
            }
            socket.emit('commitment', obj, (succeed: boolean) => {
                if (!succeed) {
                    reject('Invalid commitment');
                    return;
                }
                resolve();
            });
        });
    };
}

export function commit(giruda: Giruda, score: number) {
    return commitInternal({ giruda: giruda, score: score });
}
export function commitGiveup() {
    return commitInternal(null);
}
