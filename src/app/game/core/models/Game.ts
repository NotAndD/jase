import { Paragraph, toParagrapth } from './Paragraph';
import { Player } from './Player';
import { Character } from './Character';
import { GameSlot } from './GameSlot';
import { MessageParagraph } from './MessageParagraph';

export class Game {
    id!: number;
    turn!: number;
    slot!: GameSlot;

    // characters and current location
    currentPar!: Paragraph;
    player!: Player;
    other!: Character;

    isStarted!: boolean;
    isGameOver!: boolean;
    isTrueGameOver!: boolean;
    isRewindAvailable!: boolean;
    isShaking!: boolean;

    additionalPars!: Array<number>;

    // conditions
    conditionsSettling!: Map<string, boolean>;

    // previous story
    pMap!: Array<MessageParagraph>;
    visitedPars!: Array<number>;

    playerMessages!: Array<string>;
    log!: Array<string>;

    constructor(obj?: any, fromStart?: boolean) {
        if (obj) {
            this.load(obj, fromStart);
        } else {
            this.empty();
        }
        this.validate();
    }

    private load(obj?: any, fromStart?: boolean) {
        this.id = obj.id;
        this.turn = fromStart ? 0 : obj.turn;
        this.slot = obj.slot;

        this.player = new Player(obj.player);
        this.isStarted = fromStart ? false : obj.isStarted;
        this.isGameOver = fromStart ? false : obj.isGameOver;
        this.isTrueGameOver = fromStart ? false : obj.isTrueGameOver;
        this.isRewindAvailable = fromStart ? true : obj.isRewindAvailable;
        this.isShaking = fromStart ? false : obj.isShaking;
        this.other = new Character(obj.other);
        this.conditionsSettling = new Map();
        if (!fromStart) {
            this.currentPar = toParagrapth(obj.currentPar);
            for (const key in obj.conditionsSettling) {
                this.conditionsSettling.set(key, obj.conditionsSettling[key]);
            }
        }

        this.pMap = fromStart ? new Array() : obj.pMap;
        this.visitedPars = fromStart ? new Array() : obj.visitedPars;
        this.additionalPars = fromStart ? new Array() : obj.additionalPars;
        this.log = fromStart ? new Array() : obj.log;
    }

    private empty() {
        this.player = new Player();
        this.player.id = 1;
        this.player.character = new Character();
        this.other = new Character();
        this.isGameOver = false;
        this.isTrueGameOver = false;
        this.isRewindAvailable = true;
        this.isShaking = false;
        this.isStarted = false;

        this.pMap = new Array();
        this.visitedPars = new Array();
        this.conditionsSettling = new Map();
        this.additionalPars = new Array();
        this.turn = 0;

        this.playerMessages = new Array();
        this.log = new Array();
    }

    private validate() {
        this.playerMessages = new Array();
        if (!this.visitedPars) {
            this.visitedPars = new Array();
        }
        if (!this.additionalPars) {
            this.additionalPars = new Array();
        }
        if (!this.pMap) {
            this.pMap = new Array();
        }
        if (!this.log) {
            this.log = new Array();
        }
    }
}
