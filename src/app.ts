import io = require('socket.io-client');
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reduce } from './reducers';
import { User, Connection, Room } from './actions';
import { Scene } from './reducers/scene';

const store = createStore(
    reduce,
    applyMiddleware(thunk)
);

const url = 'http://localhost:12345';
const socket = io(url, { autoConnect: false });

store.subscribe(() => {
    console.log(store.getState());
});

store.dispatch(Connection.connect(socket)).then(() => {
    return store.dispatch(User.requestNicknameChange(socket, 'Tirr')).catch(() => {
        console.error('Failed to change nickname');
    });
}).then(() => {
    return store.dispatch(Room.updateRoomList(socket)).catch(() => {
        console.error('Failed to update room list');
    });
}).catch(() => {
    console.error('Failed to connect');
});
