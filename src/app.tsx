import io = require('socket.io-client');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { reduce } from './reducers';
import { Connection } from './actions';
import { SceneView } from './components';

const store = createStore(
    reduce,
    applyMiddleware(thunk)
);

ReactDOM.render(
    (
        <Provider store={store}>
            <SceneView />
        </Provider>
    ),
    document.getElementById('content')
);

const url = 'http://localhost:8181';
const socket = io(url, { autoConnect: false });

store.subscribe(() => {
    console.log(store.getState());
});

store.dispatch(Connection.connect(socket));
