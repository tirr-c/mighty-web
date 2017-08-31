import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';
import { Lobby, Game } from '../actions';

type Props = {
    roomList: [{ id: string, name: string }],
    roomListUpdating: boolean,
    updateRoomList: () => Promise<void>,
    createRoom: () => Promise<void>,
    joinRoom: (roomId: string) => Promise<void>
};

class LobbyView extends React.Component<Props> {
    componentDidMount() {
        this.props.updateRoomList();
    }

    render() {
        const roomList = this.props.roomList.map(room =>
            <div key={`room-${room.id}`}>
                <a onClick={() => this.props.joinRoom(room.id)}>{room.name}</a>
            </div>
        );
        const roomEmpty = <div>방이 없습니다</div>;
        const roomUpdating = <div>로딩 중...</div>;
        const roomListDisplay =
            this.props.roomListUpdating ?
            roomUpdating :
            roomList.length > 0 ? roomList : roomEmpty;
        return (
            <div id="room-list">
                {roomListDisplay}
                <button disabled={this.props.roomListUpdating} onClick={this.props.updateRoomList}>새로고침</button>
                <button onClick={this.props.createRoom}>새 방 만들기</button>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    const roomList = state.lobby.roomIds.map(id => (
        {
            id: id,
            name: state.lobby.roomNameCache[id]
        }
    ));
    return {
        roomList: roomList,
        roomListUpdating: state.lobby.roomUpdating
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        updateRoomList: () => dispatch(Lobby.updateRoomList()).catch(console.error),
        createRoom: () => dispatch(Game.createRoom()).catch(console.error),
        joinRoom: (roomId: string) => dispatch(Game.joinRoom(roomId)).catch(console.error)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyView);
