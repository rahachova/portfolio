import wordCollectionLevel1 from '../data/wordCollectionLevel1';
import wordCollectionLevel2 from '../data/wordCollectionLevel2';
import wordCollectionLevel3 from '../data/wordCollectionLevel3';
import wordCollectionLevel4 from '../data/wordCollectionLevel4';
import wordCollectionLevel5 from '../data/wordCollectionLevel5';
import wordCollectionLevel6 from '../data/wordCollectionLevel6';
import { Level } from '../types/level';
import { WorldCollection } from '../types/worldCollection';

export class GameController {
    currentLevel: Level = 1;

    currentRound: number = 0;

    currentSentenceIndex: number = 0;

    maxSentenceIndex: number = 9;

    gameStartSubscribtions: Array<() => void> = [];

    initNextSentenceSubscribtions: Array<() => void> = [];

    translationHintVisibilitySubscribtions: Array<(isVisible: boolean) => void> = [];

    imageHintVisibilitySubscribtions: Array<(isVisible: boolean) => void> = [];

    audioHintVisibilitySubscribtions: Array<(isVisible: boolean) => void> = [];

    onGameStart(subscribtion: () => void) {
        this.gameStartSubscribtions.push(subscribtion);
    }

    handleGameStart() {
        this.gameStartSubscribtions.forEach((subscribtion) => subscribtion());
    }

    onInitNextSentence(subscribtion: () => void) {
        this.initNextSentenceSubscribtions.push(subscribtion);
    }

    handleInitNextSentence() {
        this.initNextSentenceSubscribtions.forEach((subscribtion) => subscribtion());
    }

    onTranslationHintVisibility(subscribtion: (isVisible: boolean) => void) {
        this.translationHintVisibilitySubscribtions.push(subscribtion);
    }

    handleTranslationHintVisibility(isVisible: boolean) {
        this.translationHintVisibilitySubscribtions.forEach((subscribtion) => subscribtion(isVisible));
    }

    onImageHintVisibility(subscribtion: (isVisible: boolean) => void) {
        this.imageHintVisibilitySubscribtions.push(subscribtion);
    }

    handleImageHintVisibility(isVisible: boolean) {
        this.imageHintVisibilitySubscribtions.forEach((subscribtion) => subscribtion(isVisible));
    }

    onAudioHintVisibility(subscribtion: (isVisible: boolean) => void) {
        this.audioHintVisibilitySubscribtions.push(subscribtion);
    }

    handleAudioHintVisibility(isVisible: boolean) {
        this.audioHintVisibilitySubscribtions.forEach((subscribtion) => subscribtion(isVisible));
    }

    switchToNextSentence() {
        let isNeedSwitchToNextRound = false;

        if (this.currentSentenceIndex === this.maxSentenceIndex) {
            this.currentRound += 1;
            this.currentSentenceIndex = 0;
            isNeedSwitchToNextRound = true;
        } else {
            this.currentSentenceIndex += 1;
        }

        return isNeedSwitchToNextRound;
    }

    get currentWords() {
        return GameController.getWordCollection(this.currentLevel).rounds[this.currentRound].words[this.currentSentenceIndex];
    }

    get currentTextExampleTranslate() {
        return this.currentWords.textExampleTranslate;
    }

    get currentAudioExample() {
        return this.currentWords.audioExample;
    }

    get currentTextExample() {
        return this.currentWords.textExample;
    }

    get currentImage() {
        return GameController.getWordCollection(this.currentLevel).rounds[this.currentRound].levelData.cutSrc;
    }

    get currentRounds() {
        return GameController.getWordCollection(this.currentLevel).rounds;
    }

    static getWordCollection(level: Level): WorldCollection {
        switch (level) {
            case 1:
                return wordCollectionLevel1;
                break;
            case 2:
                return wordCollectionLevel2;
                break;
            case 3:
                return wordCollectionLevel3;
                break;
            case 4:
                return wordCollectionLevel4;
                break;
            case 5:
                return wordCollectionLevel5;
                break;
            case 6:
                return wordCollectionLevel6;
                break;
            default:
                return wordCollectionLevel1;
                break;
        }
    }
}

export default new GameController();
