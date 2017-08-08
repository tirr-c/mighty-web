import { State } from '../reducers';

export type ActionType = 'connected' | 'disconnected';

interface ConnectedAction {
    type: 'connected',
    reconnected: boolean
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
                dispatch({ type: 'connected', reconnected: false });
                resolve();
            });
            socket.on('reconnect', (attempt: number) => {
                dispatch({ type: 'connected', reconnected: true });
            });
            socket.on('disconnect', (reason: string) => {
                dispatch({ type: 'disconnected', reason: reason });
            });
            socket.open();
        });
    };
}
