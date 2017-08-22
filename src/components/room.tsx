import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';

type Props = {
    roomId: string,
    roomMembers: string[]
};

class Room extends React.Component<Props> {
    render() {
        const members = this.props.roomMembers.map(member =>
            <li key={`user-${member}`}>{member}</li>
        );
        return (
            <div>
                <div>방 #<span>{this.props.roomId}</span></div>
                <ul>{members}</ul>
            </div>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        roomId: state.room.id,
        roomMembers: state.room.members
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
