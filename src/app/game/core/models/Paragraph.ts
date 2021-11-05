export interface ParVisit {
    inGame: boolean;
    globally: boolean;
    completelyInGame: boolean;
}

export class Paragraph {
    id!: number;
    title!: string;
    text!: string;

    parents?: Array<number>;
    sons?: Array<number>;
    innerSons?: Array<number>;

    condition?: number;
    results?: Array<number>;

    author?: string;
    arguments?: Array<string>;

    // used only during the game or the game design
    isInner!: boolean;
    isNew!: boolean;
    visited!: ParVisit;

    getAllSons(): Array<number> {
        const result: Array<number> = [];
        if (this.sons && this.sons.length > 0) {
            this.sons.forEach(s => result.push(s));
        }
        if (this.innerSons && this.innerSons.length > 0) {
            this.innerSons.forEach(is => result.push(is));
        }
        return result;
    }
}

export function toParagrapth(obj: any) {
    const result = new Paragraph();

    result.id = obj.id;
    result.title = obj.title;
    result.text = obj.text;
    result.parents = obj.parents;
    result.sons = obj.sons;
    result.innerSons = obj.innerSons;

    result.condition = obj.condition;
    result.results = obj.results;

    result.author = obj.author;
    result.arguments = obj.arguments;

    result.isNew = false;
    result.visited = {
        inGame: false,
        globally: false,
        completelyInGame: false
    };

    return result;
}

export function fieldsInJson(): Array<string> {
    return ['id', 'title', 'text', 'parents', 'sons', 'results', 'condition', 'innerSons', 'arguments'];
}

export const NO_GOING_BACK_TAG = 'no-going-back';
export const ADULT_TAG = 'adult';
