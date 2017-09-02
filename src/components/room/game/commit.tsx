import * as React from 'react';
import { Card, Giruda } from '~utils';

type Props = {
    previousCommitment: {
        giruda: Giruda,
        score: number
    } | null,
    onCommit: (giruda: Giruda, score: number) => Promise<void>,
    onGiveup: () => Promise<void>
};

type State = {
    commitText: string
};

const commitRegex = /^(spade|diamond|club|heart|none)\s*([12][0-9])$/;

export default class CommitControl extends React.Component<Props, State> {
    handleCommitChange: (event: { target: EventTarget & HTMLInputElement }) => void;
    commit: () => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            commitText: ''
        };
        this.handleCommitChange = (event) => {
            this.setState({ commitText: event.target.value });
        };
        this.commit = () => {
            const commitment = this.currentCommitment;
            if (commitment === null) return;
            if (!this.commitValid) return;
            const { giruda, score } = commitment;
            this.props.onCommit(giruda, score);
        };
    }

    componentWillReceiveProps(newProps: Props) {
        if (this.props.previousCommitment === newProps.previousCommitment) return;
        this.setState({ commitText: '' });
    }

    get currentCommitment() {
        const commit = commitRegex.exec(this.state.commitText);
        if (commit === null) return null;
        const isNone = commit[1] === 'none';
        const scoreLowerBound = isNone ? 12 : 13;
        const score = parseInt(commit[2], 10);
        if (score > 20 && score < scoreLowerBound) return null;
        let giruda = Giruda.None;
        switch (commit[1]) {
            case 'spade': giruda = Giruda.Spade; break;
            case 'diamond': giruda = Giruda.Diamond; break;
            case 'club': giruda = Giruda.Club; break;
            case 'heart': giruda = Giruda.Heart; break;
        }
        return {
            giruda: giruda,
            score: score
        };
    }

    get commitValid() {
        const currentCommitment = this.currentCommitment;
        if (currentCommitment === null) return false;
        const previousCommitment = this.props.previousCommitment;
        if (previousCommitment === null) return true;
        const { score, giruda } = currentCommitment;
        const effectiveScore = score + Number(giruda === Giruda.None);
        const { score: opponentScore, giruda: opponentGiruda } = previousCommitment;
        const opponentEffectiveScore = opponentScore + Number(opponentGiruda === Giruda.None);
        return effectiveScore > opponentEffectiveScore;
    }

    render() {
        const commitValid = this.commitValid;
        return (
            <div>
                <input value={this.state.commitText} onChange={this.handleCommitChange} />
                <button onClick={this.commit} disabled={!commitValid}>공약하기</button>
                <button onClick={this.props.onGiveup}>출마 포기</button>
            </div>
        );
    }
}
