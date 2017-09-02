import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { GamePhase } from '../../reducers/game';
import { Card } from '../../utils';

type Props = {
    phase: GamePhase,
    cards: Card[]
};

class Game extends React.Component<Props> {
    render() {
        if (this.props.phase === GamePhase.Ready) {
            return null;
        }
        const cards = this.props.cards.map(card => card.toString()).map(card => (
            <li key={`card-${card}`}>{card}</li>
        ));
        const cardList = <ul>{cards}</ul>;
        return cardList;
    }
}

function mapStateToProps(state: State) {
    const { phase, cards } = state.game.gameState;
    return {
        phase: phase,
        cards: cards
    };
}

export default connect(mapStateToProps, null)(Game);
