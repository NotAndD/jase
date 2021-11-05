import { Character } from './Character';

export class Player {
    id!: number;

    character!: Character;
    tags!: Array<string>;

    constructor(obj?: any, fromStart?: boolean) {
        if (obj) {
            this.id = obj.id;
            this.character = new Character(obj.character);

            if (!fromStart) {
                this.tags = obj.tags;
            }
        }

        if (!this.tags) {
            this.tags = new Array();
        }
    }

    hasTag(tag: string) {
        return this.tags.filter(t => t === tag).length > 0;
    }

    hasTags(requiredTags: Array<string>) {
        for (const i in requiredTags) {
            if (!this.hasTag(requiredTags[i])) {
                return false;
            }
        }
        return true;
    }

    pushTag(tag: string) {
        if (!this.hasTag(tag)) {
            this.tags.push(tag);
            return true;
        }
        return false;
    }

    removeTag(tag: string) {
        if (this.hasTag(tag)) {
            this.tags = this.tags.filter(t => t !== tag);
            return true;
        }
        return false;
    }
}
