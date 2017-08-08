export type ActionType = 'nickname-change-request' | 'nickname-change-succeed';

interface NicknameChangeRequestAction {
    type: 'nickname-change-request';
    nickname: string;
}
interface NicknameChangeSucceedAction {
    type: 'nickname-change-succeed';
    nickname: string;
}
export type Action = NicknameChangeRequestAction | NicknameChangeSucceedAction;

export function requestNicknameChange(socket: SocketIOClient.Socket, nickname: string) {
    return (dispatch: (action: Action) => Action): Promise<void> => {
        dispatch({ type: 'nickname-change-request', nickname: nickname });
        return new Promise((resolve, reject) => {
            socket.emit('set-nickname', nickname, (result: boolean) => {
                if (result) {
                    dispatch({ type: 'nickname-change-succeed', nickname: nickname });
                    resolve();
                } else {
                    reject();
                }
            })
        })
    };
}
