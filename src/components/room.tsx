import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';
import { Game } from '../actions';

type Props = {
    userId: string,
    roomId: string,
    roomMembers: string[],
    roomReadyState: { [memberId: string]: boolean },
    leaveRoom: () => Promise<void>,
    setReadyState: (ready: boolean) => Promise<void>
};

class Room extends React.Component<Props> {
    toggleReady: () => Promise<void>;

    constructor(props: Props) {
        super(props);
        this.toggleReady = () => {
            const ready = this.readyState;
            const shouldReady = !ready;
            return this.props.setReadyState(shouldReady);
        };
    }

    get readyState() {
        if (this.props.roomId === '') return false;
        return this.props.roomReadyState[this.props.userId];
    }

    render() {
        const members = this.props.roomMembers.map(member =>
            <li key={`user-${member}`}>
                <span>{member}</span>&nbsp;
                {this.props.roomReadyState[member] ?
                    <span>준비됨</span> :
                    null}
            </li>
        );
        const toggleText = this.readyState ? '준비 해제': '준비';
        return (
            <div>
                <div>방 #<span>{this.props.roomId}</span></div>
                <ul>{members}</ul>
                <button onClick={this.toggleReady}>{toggleText}</button>
                <button onClick={this.props.leaveRoom}>나가기</button>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        userId: state.socket.id,
        roomId: state.game.id,
        roomMembers: state.game.members,
        roomReadyState: state.game.ready
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        leaveRoom: () => dispatch(Game.leaveRoom()),
        setReadyState: (ready: boolean) => dispatch(Game.setReady(ready))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
