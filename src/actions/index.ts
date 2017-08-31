import * as User from './user';
import * as Connection from './connection';
import * as Lobby from './lobby';
import * as Game from './game';
import * as Types from './types';

export { User, Connection, Lobby, Game };
export { Types };
export type Action = User.Action | Connection.Action | Lobby.Action | Game.Action;
export type ActionType = Types.User | Types.Connection | Types.Lobby | Types.Game;
