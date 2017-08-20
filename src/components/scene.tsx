import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { State } from '../reducers';
import { Scene } from '../reducers/scene';
import LoginForm from './login';

type Props = {
    scene: Scene
};

class SceneManager extends React.Component<Props> {
    render() {
        switch (this.props.scene) {
            case Scene.Login: return <LoginForm />;
            default: return <div />;
        }
    }
}

function mapStateToProps(state: State) {
    return {
        scene: state.scene.scene
    };
}

export default connect(mapStateToProps)(SceneManager);