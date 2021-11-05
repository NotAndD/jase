export class Statistics {
    templateId!: string;
    version!: string;

    paragraphs: number[];
    trueEndings: number[];
    rewinds: number;
    gameOvers: number;

    mostCommonEntries: Record<string, number>;

    constructor(obj?: any) {
        if (obj) {
            this.paragraphs = obj.paragraphs;
            this.trueEndings = obj.trueEndings;
            this.rewinds = obj.rewinds;
            this.gameOvers = obj.gameOvers;
            this.version = obj.version;
            this.templateId = obj.templateId;
            this.mostCommonEntries = obj.mostCommonEntries;
        } else {
            this.paragraphs = [];
            this.trueEndings = [];
            this.rewinds = 0;
            this.gameOvers = 0;
            this.mostCommonEntries = {};
        }
        this.validate();
    }

    getCommonEntryNumber(num: number): string[] | undefined {
        let entries = [];
        for (const key in this.mostCommonEntries) {
            entries.push({
                k: key,
                v: this.mostCommonEntries[key]
            });
        }
        if (entries.length <= num) {
            return undefined;
        }

        // we sort and we have it
        entries.sort((a, b) => {
            if (a.v === b.v) {
                return 0;
            }
            return a.v > b.v ? 1 : -1;
        });
        return [entries[entries.length -1 - num].k, entries[entries.length -1 - num].v.toString()];
    }

    private validate() {
        if (!this.paragraphs) {
            this.paragraphs = [];
        }
        if (!this.trueEndings) {
            this.trueEndings = [];
        }
        if (!this.mostCommonEntries) {
            this.mostCommonEntries = {};
        }
        if (!this.gameOvers) {
            this.gameOvers = 0;
        }
        if (!this.rewinds) {
            this.rewinds = 0;
        }
    }
}
