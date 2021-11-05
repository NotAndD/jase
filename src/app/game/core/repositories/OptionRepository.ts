const STORAGE_OPTIONS = 'game_options';

export const OPTION_SOUND_EFFECTS = 'play_sound_effects';
export const OPTION_MUSIC = 'play_music';
export const OPTION_SMARTPHONE = 'is_smartphone';
export const OPTION_CONDITION = 'enable_interactive_condition';
export const OPTION_EDIT_MODE = "edit_mode";
export const OPTION_TUTORIAL = 'enable_tutorial';
export const OPTION_NONINVASIVE_TUTORIAL = 'noninvasive_tutorial';
export const OPTION_ENABLE_IMPOSSIBLE_CODITION = 'enable_impossible_condition';
export const OPTION_NO_KEYBOARD = 'no_keyboard_please';

export class OptionRepository {
    static options = getDefaultOptions();

    static getOption(name: string) {
        return OptionRepository.options[name];
    }

    static setOption(name: string, val: boolean) {
        OptionRepository.options[name] = val;

        saveOptions(OptionRepository.options);
    }
}

function saveOptions(options: Map<string, boolean>) {
    if (window.localStorage) {
        localStorage.setItem(STORAGE_OPTIONS, JSON.stringify(options));
    }
}

function loadOptions() {
    if (window.localStorage && localStorage.getItem(STORAGE_OPTIONS)) {
        return JSON.parse(localStorage.getItem(STORAGE_OPTIONS) as string);
    }
    return undefined;
}

function getDefaultOptions() {
    let options = loadOptions();
    if (!options) {
        options = {};
    }

    addDefultToObj(options, OPTION_SOUND_EFFECTS, false);
    addDefultToObj(options, OPTION_MUSIC, false);
    addDefultToObj(options, OPTION_SMARTPHONE, false);
    addDefultToObj(options, OPTION_CONDITION, true);
    addDefultToObj(options, OPTION_TUTORIAL, true);
    addDefultToObj(options, OPTION_ENABLE_IMPOSSIBLE_CODITION, true);
    addDefultToObj(options, OPTION_EDIT_MODE, false);
    addDefultToObj(options, OPTION_NONINVASIVE_TUTORIAL, false);
    addDefultToObj(options, OPTION_NO_KEYBOARD, false);

    return options;
}

function addDefultToObj(obj: any, key: string, val: boolean) {
    if (obj[key] === undefined) {
        obj[key] = val;
    }
}
