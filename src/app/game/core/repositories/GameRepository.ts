import { Game } from '../models/Game';

export class GameRepository {

    static games: Array<Game> = [];

    static add(game: Game): void {
        GameRepository.games.push(game);
    }
}
