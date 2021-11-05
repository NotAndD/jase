import { Paragraph, ParVisit } from './Paragraph';

export class SimpleParagraph {
    id!: number;
    title!: string;

    parents?: Array<number>;
    sons?: Array<number>;
    innerSons?: Array<number>;

    wasVisited!: ParVisit;
    wasVisible!: boolean;
}

export function fromParagraph(par: Paragraph) {
    const result = new SimpleParagraph();
    result.id = par.id;
    result.title = par.title;
    result.parents = par.parents;
    result.sons = par.sons;
    result.innerSons = par.innerSons;
    result.wasVisited = par.visited;

    return result;
}
