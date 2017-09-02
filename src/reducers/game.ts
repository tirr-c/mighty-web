import { Action, Types } from '~actions';
import { Card } from '~utils';

export const enum GamePhase {
    Ready,
    PendingDealMiss,
    DoneDealMiss,
    PendingCommitment,
    WaitingPresident,
    CheckCards,
    Play,
    Result
};

export type GameState = {
    phase: GamePhase,
    cards: Card[],
    currentTurn: string
};
export type State = {
    id: string,
    members: string[],
    ready: { [memberId: string]: boolean },
    gameState: GameState
};

const initialGameState: GameState = {
    phase: GamePhase.Ready,
    cards: [],
    currentTurn: ''
};
const initialState: State = {
    id: '',
    members: [],
    ready: {},
    gameState: initialGameState
};

export function reduce(state = initialState, action: Action): State {
    switch (action.type) {
        case 'join-room': {
            if ('userId' in action) {
                return state;
            } else {
                return { ...state, id: action.roomId };
            }
        }
        case 'leave-room': {
            if ('userId' in action) {
                return state;
            } else {
                return initialState; // reset
            }
        }
        case 'member-state-changed': {
            if (state.id === '') return state; // ignore
            const list = action.userList;
            const members = list.map(x => x.id);
            const ready = list.map(
                x => ({ [x.id]: x.ready })
            ).reduce(
                (ready, x) => ({ ...ready, ...x }), {}
            );
            return { ...state, members: members, ready: ready };
        }
        case 'reset': {
            const ready = state.members.reduce(
                (ready, x) => ({ ...ready, [x]: false }), {}
            );
            return { ...state, ready: ready, gameState: initialGameState };
        }
        case 'deal': {
            const dealPoint = action.cards.map(x => x.dealPoint).reduce((point, x) => point + x, 0);
            const nextPhase = dealPoint > 0 ? GamePhase.DoneDealMiss : GamePhase.PendingDealMiss;
            const gameState = {
                phase: nextPhase,
                cards: action.cards,
                currentTurn: ''
            };
            return { ...state, gameState: gameState };
        }
        case 'pending-commit': {
            const gameState = {
                ...state.gameState,
                phase: GamePhase.PendingCommitment,
                currentTurn: action.userId
            };
            return { ...state, gameState: gameState };
        }
        case 'waiting-president': {
            const gameState = {
                ...state.gameState,
                phase: GamePhase.WaitingPresident,
                currentTurn: ''
            };
            return { ...state, gameState: gameState };
        }
        case 'floor-cards': {
            const gameState = {
                phase: GamePhase.CheckCards,
                cards: state.gameState.cards.concat(action.cards),
                currentTurn: ''
            };
            return { ...state, gameState: gameState };
        }
        default:
            return state;
    }
}
