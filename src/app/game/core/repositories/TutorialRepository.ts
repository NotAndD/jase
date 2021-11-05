export const TUTORIAL_BEGIN = 'tutorial_begin';
export const TUTORIAL_FIRST_CHOISE = 'tutorial_first_choise';
export const TUTORIAL_CONDITION = 'tutorial_condition';
export const TUTORIAL_RESULT = 'tutorial_result';
export const TUTORIAL_GAME_OVER = 'tutorial_game_over';
export const TUTORIAL_IMPOSSIBLE_CONDITION = 'tutorial_impossible_qte';
export const TUTORIAL_MULTIPLE_PATHS = 'tutorial_multiple_paths';
export const TUTORIAL_OBSCURE = 'tutorial_obscure';
export const TUTORIAL_REWIND = 'tutorial_rewind';
export const TUTORIAL_TRUE_GAME_OVER = 'tutorial_true_game_over';
export const TUTORIAL_PAR_AVAILABLE = 'tutorial_par_available';
export const TUTORIAL_COMPLETELY_EXPLORED = 'tutorial_completely_explored';

export class TutorialRepository {
    static tutorialMessages: Record<string, Array<string>> = {
        [TUTORIAL_BEGIN]: [
            'Hello, this is the Tutorial speaking!',
            'I\'ll try to guide you into understanding the various game-mechanics',
            'Messages like this will appear every time you find something new into the Game',
            'But remember: you can always disable this tutorial',
            'Just change the "Options" (which can be opened when "Pausing" the game)',
            'Or you can make me less invasive (with the appropriate Option)',
            'Instead of immediately prompt you for stuff, I\'ll poke you when there\'s something new',
            'Now, pick the single available path (the first choice under the text)'
        ],
        [TUTORIAL_FIRST_CHOISE]: [
            'When you choose a path, the story will continue with a new paragraph.. and then provides more paths to pick from',
            'But you also have other options available! Just choose "Wait, it didn\'t go this way!" to list them',
            'You can rewind back-in-time, consult a map of the story and more',
            'Consider the rewind power as a way to move back into the story, whenever wanted (or needed)'
        ],
        [TUTORIAL_MULTIPLE_PATHS]: [
            'Notice how you now have multiple paths to choose between',
            'This is because the story can branch and take different routes, depending on your decisions',
            'When this happens, paths may be "Tagged" to explain how the story is going to evolve, if you choose that direction',
            'But don\'t worry, you can always rewind back and explore the other paths later, if you want to',
            'And the "Map" will help you understand in which branch of the story you are moving on',
            'Take into consideration that the Game requires you to rewind back and forth, to reach true-endings'
        ],
        [TUTORIAL_CONDITION]: [
            'Notice the "Condition" badge on one of the available paths',
            'It means that the path may became unavailable if its requirements are not met',
            'Or it may require some player interactions, when you choose it',
            'Some paths may have hidden conditions and be completely hidden from you, until you meet all their requirements',
            'Since you have rewind powers, you can always rewind conditions as well, if you fail the player interaction'
        ],
        [TUTORIAL_RESULT]: [
            'Notice the "Result" badge on one of the available paths',
            'It means that the path will make a change in the story, provoking a path-game-over or other things',
            'Some paths may have hidden results, they could have no badge but secretly have an effect when choosed..',
            'Those effects may not disappear with a rewind of the Simulation and may unlock new paths, somewhere in the story',
            'But be aware of the fact that some effects may also reduce your ability to navigate the story. Such paths are "usually" tagged with the "no-going-back" Tag'
        ],
        [TUTORIAL_GAME_OVER]: [
            'A dead-end! There\'s nothing more to explore on this side',
            'But you can always rewind back and explore other paths of the story',
            '(You are supposed to go back and explore, this is NOT a true-game-over..)'
        ],
        [TUTORIAL_IMPOSSIBLE_CONDITION]: [
            'Notice the "Condition" badge on one of the available paths',
            'Even if it has nothing different from other paths, it is an impossible condition',
            'Such paths are there just for blocking your way while you explore',
            'And give you that "feeling" of helpness in the specific situation',
            'Try it out.. but expect to fail',
            'Or.. disable it from the "Options" if you are not interested'
        ],
        [TUTORIAL_OBSCURE]: [
            'You may find out that characters in the simulation could use a language you just can\'t understand..',
            'Don\'t worry tho, it is perfectly normal! You just need a dictionary.. or a way to translate things up',
            'Surely there is something that can help, somewhere in the simulation..',
            '.. but exploring some paths, trying to understand on your own what is going on.. may be also fun!',
            '(Notice, in the current version of the game, obscure text CANNOT be translated)',
            '(Next version will have more paths playing around this mechanic and it will become translatable)'
        ],
        [TUTORIAL_REWIND]: [
            'Hey! Did you just.. pulled back time?',
            'Of course you did, good job!',
            'Jokes aside, you just rewinded the story to a previous path.. which makes you able to change things up',
            'You can take a different path in the story and explore it up.. and sometimes you may find out that new paths are now unlocked and ready to be taken',
            '(your rewind powers are your strongest weapon)'
        ],
        [TUTORIAL_TRUE_GAME_OVER]: [
            'And this.. this is the end',
            'Well, at least, one of the possible ends of the story',
            'There are many more but, to explore them up, you\'ll need to start from scratch',
            '(but you can keep the characters if you use this same Game Slot)'
        ],
        [TUTORIAL_PAR_AVAILABLE]: [
            'Notice how you now have an available path with the "+" symbol',
            'It means that you unlocked a special path which will ALWAYS be available',
            'And it does not matter where you are in the story, it will stay there..',
            '.. until it get used, of course'
        ],
        [TUTORIAL_COMPLETELY_EXPLORED]: [
            'Notice how one of the available paths starts with a gray dot',
            'It means that you explored that path completely, you\'ve already read everything under that choice',
            'It\'s just a way to help you sort which paths need to explored and which, instead, do not',
            'But remember that new paths could unlock when you fulfill their requirements, so things may change!',
            '(and the gray dot will be removed if, later on in the game, you unlock something hidden in an already explored path)'
        ]
    };

    static get(key: string): string[] {
        return TutorialRepository.tutorialMessages[key];
    }
}
