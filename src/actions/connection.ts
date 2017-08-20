import { State } from '../reducers';

export type ActionType = 'connected' | 'disconnected';

interface ConnectedAction {
    type: 'connected',
    reconnected: boolean,
    socket: SocketIOClient.Socket
}
interface DisconnectedAction {
    type: 'disconnected',
    reason: any
}
export type Action = ConnectedAction | DisconnectedAction;

export function connect(socket: SocketIOClient.Socket) {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            socket.once('connect', () => {
                dispatch({ type: 'connected', reconnected: false, socket: socket });
                resolve();
            });
            socket.on('reconnect', (attempt: number) => {
                dispatch({ type: 'connected', reconnected: true, socket: socket });
            });
            socket.on('disconnect', (reason: string) => {
                dispatch({ type: 'disconnected', reason: reason });
            });
            socket.open();
        });
    };
}
