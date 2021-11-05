
export class TipService {
    static tips = [
        'The edit-paragraph area buttons works on selected pieces of text. All buttons will insert text where the cursor is located, selected text will be substituted. The textarea will be auto focused after a button click, you can keep writing immediately after using a button.',
        'The whole game is a web-app written with Angular. For this reason, a browser local storage clean-up will immediately delete every progress.',
        'The game auto-saves in your local storage in the selected game slot. If you exit a game, you can play it from where you left whenever you enter the game page again as long as you didn\'t clean the browser cache. Notice that if you create a new paragraph the game will stop saving itself (as new content makes things difficult)',
        'When creating a character, choose descriptions which works in as many way as possible. Check if they feel good after: this, the, a, that and so on.',
        'If you insert a new paragraph with a condition, the NEXT time you will reach that point in the story, you will be able to choose that new paragraph only if you satisfy the condition with the current characters.',
        'If a paragraph choise has a condition warning near it, be CAREFUL (and fast in choosing what to do) since it means things could change even without you choosing!',
        'The whole game is client-based. Once the web-app is loaded, no additional requests are done to obtain paragraphs or similar data. In theory, once the game is loaded, you could disconnect from internet and keep playing.. as long as you don\'t refresh the page. If you are playing with audio and musics, things change and new requests are done, just to load the audio.',
        'Game-Options can be reviewed and changed while in game at any time, simply by pausing.',
        'There are conditions which cannot be met, no matter how much times you try.. just to add flavour to the story. There are also hidden chapters, requiring secret conditions in order to be seen.',
        'If you are stuck or not sure on what can be explored, take a look at the Map.. while in a game, it will show you the area of the story you explored, giving you ideas on where to go next',
        'The Game Map can help you decide what needs to be explored in the story. It supports pan, zoom and also clicks on each node in order to read each path title.'
    ];
    static previousTips: string[] = [];

    static getNextTip() {
        if (TipService.tips.length === 0) {
            TipService.tips = TipService.previousTips;
            TipService.previousTips = [];
            return 'You already know everything! Stop pressing that button..';
        }

        const tip = TipService.tips.pop() as string;
        TipService.previousTips.push(tip);
        return tip;
    }
}
