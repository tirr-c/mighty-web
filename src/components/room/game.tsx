import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { GamePhase } from '../../reducers/game';
import { Card } from '../../utils';

type Props = {
    phase: GamePhase,
    myTurn: boolean,
    cards: Card[]
};

class Game extends React.Component<Props> {
    get phaseText() {
        switch (this.props.phase) {
            case GamePhase.Ready: return '준비 중';
            case GamePhase.PendingDealMiss: return '딜 미스를 결정해 주십시오';
            case GamePhase.DoneDealMiss: return '다른 플레이어를 기다리는 중';
            case GamePhase.PendingCommitment: {
                if (this.props.myTurn) return '공약을 거십시오';
                return '다른 플레이어를 기다리는 중';
            }
            case GamePhase.WaitingPresident: return '주공을 기다리는 중';
            case GamePhase.CheckCards: return '카드를 교환해 주십시오';
            case GamePhase.Play: {
                if (this.props.myTurn) return '카드를 내십시오';
                return '다른 플레이어를 기다리는 중';
            }
            case GamePhase.Result: return '플레이 종료';
        }
        return '불가능';
    }

    render() {
        if (this.props.phase === GamePhase.Ready) {
            return null;
        }
        const phase = <div>{this.phaseText}</div>;
        const cards = this.props.cards.map(card => card.toString()).map(card => (
            <li key={`card-${card}`}>{card}</li>
        ));
        const cardList = <ul>{cards}</ul>;
        return (
            <div>
                {phase}
                {cardList}
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    const { phase, currentTurn, cards } = state.game.gameState;
    return {
        phase: phase,
        myTurn: currentTurn === state.socket.id,
        cards: cards
    };
}

export default connect(mapStateToProps, null)(Game);
