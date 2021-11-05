import { Howl } from 'howler';
import { getRandomInt } from '../models/Character';
import { OptionRepository, OPTION_MUSIC, OPTION_SOUND_EFFECTS } from '../repositories/OptionRepository';

export class AudioService {

    musics: string[] = [];

    musicVolume = 0.1;
    effectVolume = 1;

    musicStopped = false;
    currentMusic?: string;
    currentMusicId?: number;

    loadedSounds = new Map<string, Howl>();

    loadMusics(musicNames: string[]) {
        this.musics = musicNames;
    }

    startMusic() {
        if (this.checkOptionMusic() && this.musics && this.musics.length > 0) {
            this.musicStopped = false;
            this.playRandomMusic();
        }
    }

    playAudioEffect(id: string) {
        if (this.checkOptionSoundEffects()) {
            const self = this;

            setTimeout(() => {
                self.playSound(id, self.effectVolume, false, undefined);
            }, 1000);
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            this.pauseSound(this.currentMusic, this.currentMusicId);
        }
    }

    resumeMusic() {
        if (this.checkOptionMusic() && this.currentMusic) {
            this.resumeSound(this.currentMusic, this.musicVolume, this.currentMusicId);
        } else if (this.checkOptionMusic()) {
            this.startMusic();
        }
    }

    stopMusic() {
        this.musicStopped = true;
        if (this.currentMusic) {
            this.stopSound(this.currentMusic, this.currentMusicId);
            this.currentMusic = undefined;
            this.currentMusicId = undefined;
        }
    }

    checkOptions() {
        if (!this.checkOptionMusic() && !this.musicStopped) {
            this.stopMusic();
        } else if (this.checkOptionMusic() && this.musicStopped) {
            this.startMusic();
        }
    }

    private checkOptionMusic() {
        return OptionRepository.getOption(OPTION_MUSIC);
    }

    private checkOptionSoundEffects() {
        return OptionRepository.getOption(OPTION_SOUND_EFFECTS);
    }

    private playRandomMusic() {
        const self = this;

        const callback = (previousId?: number) => {
            setTimeout(() => {
                if (!self.musicStopped) {
                    const randomId = getRandomInt(0, self.musics.length - 1);
                    const randomMusic = self.musics[randomId];
                    this.currentMusic = randomMusic;

                    this.currentMusicId = self.playSound(randomMusic,
                        this.musicVolume, true, callback);
                }
            }, 300);
        };

        callback();
    }

    private loadSound(name: string, volume: number, isMusic: boolean): Howl {
        const soundLocation = 'assets/audios/' + (isMusic ? 'music/' : 'effects/') + name + '.mp3';
        if (this.loadedSounds.has(name)) {
            return this.loadedSounds.get(name) as Howl;
        }
        const result = new Howl({
            src: [soundLocation],
            volume,
            html5: true
        });
        this.loadedSounds.set(name, result);
        return result;
    }

    private playSound(name: string, volume: number, isMusic: boolean,
        callback?: (soundId: number) => void) {
        const sound = this.loadSound(name, volume, isMusic);
        if (callback) {
            sound.once('end', callback);
        }
        if (!sound.playing()) {
            return sound.play();
        }
        return undefined;
    }

    private pauseSound(name: string, id?: number) {
        if (this.loadedSounds.has(name)) {
            const sound = this.loadedSounds.get(name) as Howl;
            sound.fade(sound.volume(), 0, 500, id);
            sound.once('fade', soundId => {
                sound.pause(soundId);
            });
        }
    }

    private resumeSound(name: string, volume: number, id?: number) {
        if (this.loadedSounds.has(name)) {
            const sound = this.loadedSounds.get(name) as Howl;
            sound.play(id);
            sound.fade(0, volume, 500, id);
        }
    }

    private stopSound(name: string, id?: number) {
        if (this.loadedSounds.has(name)) {
            const sound = this.loadedSounds.get(name) as Howl;
            sound.fade(sound.volume(), 0, 500, id);
            sound.once('fade', soundId => {
                sound.stop(soundId);
            });
        }
    }
}

// there's a single, static, AudioHandler.. to simplify a global handling of the sounds in game
export class AudioHandler {
    static audioService = new AudioService();
}
