import { Statistics } from "../models/Statistics";
import { ParagraphRepository } from "../repositories/ParagraphRepository";
import { StorageHandler } from "./StorageService";


export class StatisticsService {
    private statistics!: Statistics;

    load(templateId: string): void {
        this.statistics = StorageHandler.storageService.loadStatistics(templateId);
    }

    setup() {
        this.statistics.paragraphs.forEach(id => ParagraphRepository.setVisitedGlobally(id));
    }

    onRewind() {
        this.statistics.rewinds += 1;
        StorageHandler.storageService.saveStatistics(this.statistics);
    }

    onNewEntry(entry: string) {
        if (!this.statistics.mostCommonEntries[entry]) {
            this.statistics.mostCommonEntries[entry] = 0;
        }
        this.statistics.mostCommonEntries[entry] += 1;
        StorageHandler.storageService.saveStatistics(this.statistics);
    }

    onGameOver() {
        this.statistics.gameOvers +=1;
        StorageHandler.storageService.saveStatistics(this.statistics);
    }

    onTrueGameOver(id: number): boolean {
        if (this.statistics.trueEndings.indexOf(id) < 0) {
            this.statistics.trueEndings.push(id);
            StorageHandler.storageService.saveStatistics(this.statistics);
            return true;
        }
        return false;
    }

    onVisitPar(id: number) {
        this.statistics.paragraphs.push(id);
        StorageHandler.storageService.saveStatistics(this.statistics);
    }

    getStatistics() {
        return this.statistics;
    }
}

// there's a single, static, StatisticsHandler.. to simplify a global handling of the statistics
export class StatisticsHandler {
    static statisticsService = new StatisticsService();
}
