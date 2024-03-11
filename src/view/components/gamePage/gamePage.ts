import './gamePage.css';
import Component from '../../common/component';
// import loginController from '../../../controllers/loginController';
// import StartScreen from '../startScreen/startScreen';
import gameController, { GameController } from '../../../controllers/gameController';
import loginController from '../../../controllers/loginController';

export default class GamePage extends Component {
    resultBlock: Component;

    sourceBlock: Component;

    TEST_DATA: string = 'The students agree';

    constructor() {
        super({ tag: 'div', className: 'game-page' });

        this.resultBlock = new Component({
            tag: 'div',
            className: 'result-block',
        });
        this.sourceBlock = new Component({
            tag: 'div',
            className: 'source-block',
        });
        this.setupSubscribtion();
        // this.setupListeners();
        // this.setupState();
        this.build();
    }

    initGamePage() {
        this.showGamePage();
        this.fillSourceBlock();
    }

    showGamePage() {
        this.addClass('game-page--shown');
    }

    hideGamePage() {
        this.removeClass('game-page--shown');
    }

    createCards() {
        const arrayOfWords = GameController.getWordCollection(1).rounds[0].words[0].textExample.split(' ');
        const cardWidths = GamePage.calculateCardWidths(arrayOfWords);
        return arrayOfWords.map((word, index) => {
            const card = new Component({ tag: 'div', className: 'card', text: word });
            card.setAttribute('style', `width: ${cardWidths[index]}%;`);
            card.addListener('click', () => this.moveCardToResultBlock(card));
            return card;
        });
    }

    static calculateCardWidths(array: string[]): number[] {
        const totalSymbolsAmount = array.reduce((accum, currentValue) => accum + currentValue.length, 0);
        const percentsPerSymbol = 100 / totalSymbolsAmount;
        return array.map((word) => word.length * percentsPerSymbol);
    }

    moveCardToResultBlock(card: Component) {
        this.resultBlock.append(card);
    }

    static shuffleCards(arrayOfCards: Component[]) {
        return arrayOfCards.sort(() => Math.random() - 0.5);
    }

    fillSourceBlock() {
        this.sourceBlock.destroyChildren();
        this.sourceBlock.appendChildren(GamePage.shuffleCards(this.createCards()));
    }

    setupSubscribtion() {
        gameController.onGameStart(this.initGamePage.bind(this));
        loginController.onLogout(this.hideGamePage.bind(this));
    }

    // setupListeners() {
    //     this.sourceBlock.addListener('click', this.moveCardToResultBlock.bind(this));
    // }

    build() {
        this.appendChildren([this.resultBlock, this.sourceBlock]);
    }
}
