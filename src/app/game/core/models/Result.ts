export class Result {
    id!: number;

    type!: ResultType;

    tagsToAdd!: Array<string>;
    tagsToRemove!: Array<string>;

    soundIds!: Array<string>;

    isHidden!: boolean;

    paragraphId!: number;

    logEntry!: string;

    constructor(obj ?: any) {
        if (obj) {
            this.id = obj.id;
            this.type = obj.type;
            this.tagsToAdd = obj.tagsToAdd;
            this.tagsToRemove = obj.tagsToRemove;
            this.soundIds = obj.soundIds;
            this.isHidden = obj.isHidden;
            this.paragraphId = obj.paragraphId;
            this.logEntry = obj.logEntry;
        }
    }
}

export enum ResultType {
    GAME_END,
    PLAYER_TAG,
    SOUND_EFFECT,
    GAME_TRUE_END,
    REWIND_DISABLED,
    SHAKE,
    PAR_AVAILABLE,
    ADD_TO_LOG
}
