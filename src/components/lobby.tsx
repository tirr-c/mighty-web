import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';
import { Room } from '../actions';

type Props = {
    roomList: [{ id: string, name: string }],
    updateRoomList: () => Promise<void>,
    createRoom: () => Promise<void>,
    joinRoom: (roomId: string) => Promise<void>
};

class Lobby extends React.Component<Props> {
    componentDidMount() {
        this.refresh();
    }

    render() {
        const roomList = this.props.roomList.map(room =>
            <div key={`room-${room.id}`}>
                <a onClick={() => this.props.joinRoom(room.id)}>{room.name}</a>
            </div>
        );
        const roomEmpty = <div>방이 없습니다</div>
        const roomListDisplay = roomList.length > 0 ? roomList : roomEmpty;
        return (
            <div id="room-list">
                {roomListDisplay}
                <button onClick={this.refresh}>새로고침</button>
                <button onClick={this.props.createRoom}>새 방 만들기</button>
            </div>
        );
    }

    refresh() {
        return this.props.updateRoomList();
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
        roomList: roomList
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        updateRoomList: () => dispatch(Room.updateRoomList()),
        createRoom: () => dispatch(Room.createRoom()),
        joinRoom: (roomId: string) => dispatch(Room.joinRoom(roomId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
