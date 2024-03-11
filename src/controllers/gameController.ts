import wordCollectionLevel1 from '../data/wordCollectionLevel1';
import wordCollectionLevel2 from '../data/wordCollectionLevel2';
import wordCollectionLevel3 from '../data/wordCollectionLevel3';
import wordCollectionLevel4 from '../data/wordCollectionLevel4';
import wordCollectionLevel5 from '../data/wordCollectionLevel5';
import wordCollectionLevel6 from '../data/wordCollectionLevel6';
import { Level } from '../types/level';
import { WorldCollection } from '../types/worldCollection';

export class GameController {
    gameStartSubscribtions: Array<() => void> = [];

    onGameStart(subscribtion: () => void) {
        this.gameStartSubscribtions.push(subscribtion);
    }

    handleGameStart() {
        this.gameStartSubscribtions.forEach((subscribtion) => subscribtion());
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
