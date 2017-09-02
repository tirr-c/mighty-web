import * as React from 'react';
import { connect } from 'react-redux';
import { Game as GameActions } from '~actions';
import { State } from '~reducers';
import { GamePhase } from '~reducers/game';
import Game from './game';
import ReadyControl from './ready';

type Props = {
    userId: string,
    roomId: string,
    roomMembers: string[],
    roomReadyState: { [memberId: string]: boolean },
    gameStarted: boolean,
    leaveRoom: () => Promise<void>,
    setReadyState: (ready: boolean) => Promise<void>
};

class Room extends React.Component<Props> {
    render() {
        const members = this.props.roomMembers.map(member =>
            <li key={`user-${member}`}>
                <span>{member}</span>&nbsp;
                {
                    !this.props.gameStarted && this.props.roomReadyState[member] ?
                    <span>준비됨</span> :
                    null
                }
            </li>
        );
        const isReady = this.props.roomReadyState[this.props.userId];
        return (
            <div>
                <div>방 #<span>{this.props.roomId}</span></div>
                <ul>{members}</ul>
                <ReadyControl
                    disabled={this.props.gameStarted}
                    ready={isReady}
                    onLeaveRoom={this.props.leaveRoom}
                    onReadyStateChange={this.props.setReadyState} />
                <Game />
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        userId: state.socket.id,
        roomId: state.game.id,
        roomMembers: state.game.members,
        roomReadyState: state.game.ready,
        gameStarted: state.game.gameState.phase !== GamePhase.Ready
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        leaveRoom: () => dispatch(GameActions.leaveRoom()),
        setReadyState: (ready: boolean) => dispatch(GameActions.setReady(ready))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
