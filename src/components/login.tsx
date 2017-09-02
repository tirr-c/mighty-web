import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State as ReduxState } from '~reducers';
import { User } from '~actions';

type Props = {
    nickname: string,
    updating: boolean,
    requestNicknameChange: (nickname: string) => Promise<void>
};

type State = {
    nickname: string,
    edited: boolean
};

class LoginForm extends React.Component<Props, State> {
    onNicknameChange: (event: { target: EventTarget & HTMLInputElement }) => void;
    updateNickname: () => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            nickname: props.nickname,
            edited: false
        };
        this.onNicknameChange = event => {
            this.setState({
                nickname: event.target.value,
                edited: true
            });
        };
        this.updateNickname = () => {
            this.setState({
                edited: false
            });
            this.props.requestNicknameChange(this.state.nickname).catch(console.error);
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.state.edited) return;
        this.setState({ nickname: nextProps.nickname });
    }

    render() {
        return (
            <div>
                <div>새 닉네임을 입력하세요</div>
                <input type="text" disabled={this.props.updating} onChange={this.onNicknameChange} />
                <button onClick={this.updateNickname}>변경</button>
            </div>
        );
    }
}

function mapStateToProps(state: ReduxState) {
    return {
        nickname: state.user.nickname,
        updating: state.user.nicknameUpdating
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        requestNicknameChange: (nickname: string) => dispatch(User.requestNicknameChange(nickname))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
