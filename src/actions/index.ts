import * as User from './user';
import * as Connection from './connection';
import * as Types from './types';

export { User, Connection };
export { Types };
export type Action = User.Action | Connection.Action;
export type ActionType = Types.User | Types.Connection;