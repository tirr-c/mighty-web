import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';
import { GameState, GamePhase } from '../reducers/game';
import { Game } from '../actions';

type Props = {
    userId: string,
    roomId: string,
    roomMembers: string[],
    game: GameState,
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

    get isStarted() {
        return this.props.game.phase !== GamePhase.Ready;
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
        const started = this.isStarted;
        const toggleText = this.readyState ? '준비 해제': '준비';
        const cards = this.props.game.cards.map(card => card.toString()).map(card => (
            <li key={`card-${card}`}>{card}</li>
        ));
        return (
            <div>
                <div>방 #<span>{this.props.roomId}</span></div>
                <ul>{members}</ul>
                {
                    started ?
                    <ul>{cards}</ul> :
                    <div>
                        <button onClick={this.toggleReady}>{toggleText}</button>
                        <button onClick={this.props.leaveRoom}>나가기</button>
                    </div>
                }
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
        game: state.game.gameState
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        leaveRoom: () => dispatch(Game.leaveRoom()),
        setReadyState: (ready: boolean) => dispatch(Game.setReady(ready))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
