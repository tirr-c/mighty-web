import * as React from 'react';

type Props = {
    onDecide: (dealMiss: boolean) => Promise<void>
};

export default class DealMissControl extends React.Component<Props> {
    decideMiss: () => Promise<void>;
    giveupMiss: () => Promise<void>;

    constructor(props: Props) {
        super(props);
        this.decideMiss = this.props.onDecide.bind(this, true);
        this.giveupMiss = this.props.onDecide.bind(this, false);
    }

    render() {
        return (
            <div>
                <button onClick={this.decideMiss}>딜 미스</button>
                <button onClick={this.giveupMiss}>계속하기</button>
            </div>
        );
    }
}
