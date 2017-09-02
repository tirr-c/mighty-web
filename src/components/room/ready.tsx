import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { GamePhase } from '../../reducers/game';

type Props = {
    disabled: boolean,
    ready: boolean,
    onLeaveRoom: () => Promise<void>,
    onReadyStateChange: (ready: boolean) => Promise<void>
};

export default class ReadyControl extends React.Component<Props> {
    toggleReady: () => Promise<void>;

    constructor(props: Props) {
        super(props);
        this.toggleReady = () => {
            const shouldReady = !this.props.ready;
            return this.props.onReadyStateChange(shouldReady);
        };
    }

    render() {
        if (this.props.disabled) {
            return null;
        }
        const toggleText = this.props.ready ? '준비 해제': '준비';
        return (
            <div>
                <button onClick={this.toggleReady}>{toggleText}</button>
                <button onClick={this.props.onLeaveRoom}>나가기</button>
            </div>
        );
    }
}
