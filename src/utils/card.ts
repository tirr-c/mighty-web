export const enum CardSuit {
    Spade = 's',
    Club = 'c',
    Diamond = 'd',
    Heart = 'h',
    Joker = 'jk'
}

export const enum CardRank {
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '0',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
    Ace = 'A'
}

export const enum Giruda {
    Spade = 's',
    Club = 'c',
    Diamond = 'd',
    Heart = 'h',
    None = ''
}

export class Card {
    private static readonly suitTable = "scdh";
    private static readonly idxTable = "234567890JQKA";
    static fromNumber(n: number): Card | null {
        if (n >= 53) return null;

        const suit = n / 13 | 0;
        const idx = n % 13;
        if (suit === 4) return Card.fromCardCode('jk');
        return Card.fromCardCode(Card.suitTable[suit] + Card.idxTable[idx]);
    }
    private static parseSuit(suit: string): CardSuit | null {
        switch (suit) {
            case 's': return CardSuit.Spade;
            case 'c': return CardSuit.Club;
            case 'd': return CardSuit.Diamond;
            case 'h': return CardSuit.Heart;
            default: return null;
        }
    }
    private static parseRank(rank: string): CardRank | null {
        switch (rank) {
            case '2': return CardRank.Two;
            case '3': return CardRank.Three;
            case '4': return CardRank.Four;
            case '5': return CardRank.Five;
            case '6': return CardRank.Six;
            case '7': return CardRank.Seven;
            case '8': return CardRank.Eight;
            case '9': return CardRank.Nine;
            case '0': return CardRank.Ten;
            case 'J': return CardRank.Jack;
            case 'Q': return CardRank.Queen;
            case 'K': return CardRank.King;
            case 'A': return CardRank.Ace;
            default: return null;
        }
    }
    static fromCardCode(card: string): Card | null {
        if (card.length !== 2) {
            return null;
        }
        if (card === "jk") {
            return new Card(CardSuit.Joker, null);
        }
        const suit = Card.parseSuit(card[0]);
        const rank = Card.parseRank(card[1]);
        if (suit === null || rank === null) {
            return null;
        }
        return new Card(suit, rank);
    }
    get dealPoint(): number {
        if (this.rank === CardRank.Ace && this.suit === CardSuit.Spade) return 0;
        if (this.suit === CardSuit.Joker) return -1;
        switch (this.rank) {
            case CardRank.Ten:
            case CardRank.Jack:
            case CardRank.Queen:
            case CardRank.King:
            case CardRank.Ace:
                return 1;
            default:
                return 0;
        }
    }

    get point(): number {
        switch (this.rank) {
            case CardRank.Ten:
            case CardRank.Jack:
            case CardRank.Queen:
            case CardRank.King:
            case CardRank.Ace:
                return 1;
            default:
                return 0;
        }
    }

    readonly suit: CardSuit;
    readonly rank: CardRank | null;
    constructor(suit: CardSuit, rank: CardRank | null) {
        this.suit = suit;
        this.rank = rank;
    }
    toString(): string {
        if (this.suit == CardSuit.Joker) {
            return 'jk';
        }
        return this.suit + this.rank;
    }
}
