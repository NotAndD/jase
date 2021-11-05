import { Paragraph } from '../models/Paragraph';
import { fromParagraph, SimpleParagraph } from '../models/SimpleParagraph';

export class ParagraphRepository {
    static pars: Paragraph[] = [];
    static lastIdUsed = -1;

    static loadParagraphs(paragraphs: Array<Paragraph>) {
        ParagraphRepository.pars = [];
        ParagraphRepository.lastIdUsed = -1;
        paragraphs.forEach(p => {
            p.visited = {
                inGame: false,
                globally: false,
                completelyInGame: false
            };
            ParagraphRepository.pars.push(p);
            ParagraphRepository.lastIdUsed += 1;
        });
    }

    static add(par: Paragraph, parent: Paragraph) {
        ParagraphRepository.lastIdUsed += 1;
        par.id = ParagraphRepository.lastIdUsed;
        par.parents = [ parent.id ];
        par.isNew = true;
        par.visited = {
            inGame: false,
            globally: false,
            completelyInGame: false
        };

        if (par.isInner) {
            if (!parent.innerSons) {
                parent.innerSons = new Array();
            }
            parent.innerSons.push(par.id);
        } else {
            if (!parent.sons) {
                parent.sons = new Array();
            }
            parent.sons.push(par.id);
        }

        ParagraphRepository.pars.push(par);
    }

    static get(id: number): Paragraph {
        return ParagraphRepository.pars[id];
    }

    static setVisited(id: number, assignVisibility: (par: Paragraph) => boolean): void {
        const par = ParagraphRepository.get(id);
        ParagraphRepository.visit(par, assignVisibility);
    }

    static setVisitedGlobally(id: number): void {
        const par = ParagraphRepository.get(id);
        par.visited.globally = true;
    }

    static visit(par: Paragraph, assignVisibility: (par: Paragraph) => boolean): void {
        par.visited.inGame = true;
        par.visited.globally = true;
        this.trySetPathCompletelyVisit(par, assignVisibility);
    }

    static tryUnsetAllCompletelyVisit(assignVisibility: (par: Paragraph) => boolean): void {
        ParagraphRepository.pars.forEach(par => {
            if (par.visited.completelyInGame) {
                // we need to check if it still true
                ParagraphRepository.tryUnsetPathCompletelyVisit(par, assignVisibility);
            }
        });
    }

    private static tryUnsetPathCompletelyVisit(par: Paragraph,
        assignVisibility: (par: Paragraph) => boolean): void {
        const allSonsIds = par.getAllSons();
        if (allSonsIds.length === 0) {
            // no sons, still true
            return;
        }

        const allSons = ParagraphRepository.multiGet(allSonsIds);
        if (allSons.filter(son => !son.visited.completelyInGame
            && assignVisibility(son)).length === 0) {
            // all sons are either completely visited or non-visible, still true
            return;
        }

        // now we need to unset the par and ALL parents for sure
        const toUnset: Paragraph[] = [par];
        while (toUnset.length > 0) {
            const unPar = toUnset.pop() as Paragraph;
            if (unPar.visited.completelyInGame) {
                unPar.visited.completelyInGame = false;
                if (unPar.parents && unPar.parents.length > 0) {
                    unPar.parents.forEach(p => toUnset.push(ParagraphRepository.get(p)));
                }
            }
        }
    }

    private static trySetPathCompletelyVisit(par: Paragraph,
        assignVisibility: (par: Paragraph) => boolean): void {
        let toCheck = [par];
        let parents: Paragraph[] = [];

        while (toCheck.length > 0) {
            const check = toCheck.pop() as Paragraph;
            if (ParagraphRepository.trySetCompletelyVisit(check, assignVisibility)) {
                // now we need to check parents
                if (check.parents && check.parents.length > 0) {
                    check.parents.forEach(p => parents.push(ParagraphRepository.get(p)))
                }
            }
            if (toCheck.length === 0) {
                // let's go up one level
                toCheck = parents;
                parents = [];
            }
        }
    }

    private static trySetCompletelyVisit(par: Paragraph,
        assignVisibility: (par: Paragraph) => boolean): boolean {
        if (!par.visited.inGame || par.visited.completelyInGame) {
            // either not visited OR already completely visited, nothing to do here
            return false;
        }

        const allSonsIds = par.getAllSons();
        if (allSonsIds.length === 0) {
            // par has no son, it is completely visited
            par.visited.completelyInGame = true;
            return true;
        } else {
            const allSons = ParagraphRepository.multiGet(allSonsIds);
            if (allSons.filter(son => !son.visited.completelyInGame
                && assignVisibility(son)).length === 0) {
                // all sons are either completely visited or non-visible
                par.visited.completelyInGame = true;
                return true;
            }
        }

        return false;
    }

    static newVisitInGame(par: Paragraph): boolean {
        return !par.visited.inGame;
    }

    static newVisitGlobally(par: Paragraph): boolean {
        return !par.visited.globally;
    }

    static countVisitedParsInGame(): number {
        return ParagraphRepository.pars.filter(p => p.visited.inGame).length;
    }

    static countVisitedParsGlobally(): number {
        return ParagraphRepository.pars.filter(p => p.visited.globally).length;
    }

    static countAllPars(canBeCount?: (par: Paragraph) => boolean): number {
        let result = 0;
        if (!canBeCount) {
            return ParagraphRepository.pars.length;
        }

        ParagraphRepository.pars.forEach(p => {
            if (canBeCount(p)) {
                result += 1;
            }
        });

        return result;
    }

    static getAllSimple(assignVisibility?: (par: Paragraph) => boolean): SimpleParagraph[] {
        const result: SimpleParagraph[] = [];
        ParagraphRepository.pars.forEach(p => {
            const simplePar = fromParagraph(p);
            if (assignVisibility) {
                simplePar.wasVisible = assignVisibility(p);
            }
            result.push(simplePar);
        });

        return result;
    }

    static getAllNew(): Paragraph[] {
        const result: Paragraph[] = [];
        ParagraphRepository.pars.forEach(p => {
            if (p.isNew) {
                result.push(p);
            }
        });
        return result;
    }

    static multiGet(ids: number[]): Paragraph[] {
        const result: Paragraph[] = [];
        ids.forEach(e => {
            const r = ParagraphRepository.get(e);
            if (r) {
                result.push(r);
            }
        });
        return result;
    }
}
