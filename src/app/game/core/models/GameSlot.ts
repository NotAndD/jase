export class GameSlot {
    templateId: string;
    slot: number;
    version!: string;
    
    description: string;
    exploration!: number;
    trueEndings!: number;
    isEmpty: boolean;

    constructor(templateId: string, slot: number, obj?: any) {
        this.templateId = templateId;
        this.slot = slot;
        if (obj) {
            this.version = obj.version;

            this.description = obj.description;
            this.exploration = obj.exploration;
            this.trueEndings = obj.trueEndings;
            this.isEmpty = false;
        } else {
            this.description = 'Empty Slot';
            this.isEmpty = true;
        }

        this.validate();
    }

    private validate() {
        if (!this.isEmpty && !this.trueEndings) {
            this.trueEndings = 0;
        }
    }

    resetToBeginning() {
        this.exploration = 0;
        this.trueEndings = 0;
    }
}
