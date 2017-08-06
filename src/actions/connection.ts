import { State } from '../reducers';

export type ActionType = 'connection-connected' | 'connection-disconnected';

interface ConnectedAction {
    type: 'connection-connected',
    reconnected: boolean
}
interface DisconnectedAction {
    type: 'connection-disconnected',
    reason: any
}
export type Action = ConnectedAction | DisconnectedAction;

export function connect(socket: SocketIOClient.Socket) {
    return (dispatch: (action: Action) => Action, getState: () => State): Promise<void> => {
        return new Promise((resolve, reject) => {
            socket.once('connect', () => {
                dispatch({ type: 'connection-connected', reconnected: false });
                resolve();
            });
            socket.open();
        });
    };
}