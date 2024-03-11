import './gamePage.css';
import Component from '../../common/component';
import Card from '../card/card';
import gameController, { GameController } from '../../../controllers/gameController';
import loginController from '../../../controllers/loginController';

export default class GamePage extends Component {
    resultBlock: Component;

    sourceBlock: Component;

    checkButton: Component;

    cardQuantity: number = 0;

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
        this.checkButton = new Component({
            tag: 'button',
            className: 'button button--hidden',
            text: 'Check',
        });
        this.setupSubscribtion();
        this.setupListeners();
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

    showCheckButton() {
        this.checkButton.removeClass('button--hidden');
    }

    hideCheckButton() {
        this.checkButton.addClass('button--hidden');
    }

    createCards() {
        const arrayOfWords = GameController.getWordCollection(1).rounds[0].words[0].textExample.split(' ');
        this.cardQuantity = arrayOfWords.length;
        const cardWidths = GamePage.calculateCardWidths(arrayOfWords);
        return arrayOfWords.map((word, index) => {
            const card = new Card(word, index);
            card.setAttribute('style', `width: ${cardWidths[index]}%;`);
            card.addListener('click', (event: Event) => this.moveCardToResultBlock(card, event));
            card.addListener('click', (event: Event) => this.moveCardToSourceBlock(card, event));
            return card;
        });
    }

    static calculateCardWidths(array: string[]): number[] {
        const totalSymbolsAmount = array.reduce((accum, currentValue) => accum + currentValue.length, 0);
        const percentsPerSymbol = 100 / totalSymbolsAmount;
        return array.map((word) => word.length * percentsPerSymbol);
    }

    moveCardToResultBlock(card: Card, event: Event) {
        if (!card.isUsed) {
            this.resultBlock.append(card);
            this.sourceBlock.removeChild(card);
            card.setIsUsed(true);
            event.stopImmediatePropagation();
            if (this.cardQuantity === this.resultBlock.getChildren().length) {
                this.showCheckButton();
            }
        }
    }

    moveCardToSourceBlock(card: Card, event: Event) {
        if (card.isUsed) {
            if (this.cardQuantity === this.resultBlock.getChildren().length) {
                this.hideCheckButton();
            }
            this.sourceBlock.append(card);
            this.resultBlock.removeChild(card);
            card.setIsUsed(false);
            card.removeClass('card--correct');
            card.removeClass('card--incorrect');
            event.stopImmediatePropagation();
        }
    }

    static shuffleCards(arrayOfCards: Card[]) {
        return arrayOfCards.sort(() => Math.random() - 0.5);
    }

    checkResult() {
        const cardToCheck = this.resultBlock.getChildren();
        const isCorrect = cardToCheck.every((card, index) => (card as Card).cardIndex === index);
        console.log(isCorrect);
        cardToCheck.forEach((card, index) => {
            if ((card as Card).cardIndex === index) {
                card.addClass('card--correct');
            } else {
                card.addClass('card--incorrect');
            }
        });
    }

    fillSourceBlock() {
        this.sourceBlock.destroyChildren();
        this.sourceBlock.appendChildren(GamePage.shuffleCards(this.createCards()));
    }

    setupSubscribtion() {
        gameController.onGameStart(this.initGamePage.bind(this));
        loginController.onLogout(this.hideGamePage.bind(this));
    }

    setupListeners() {
        this.checkButton.addListener('click', this.checkResult.bind(this));
    }

    build() {
        this.appendChildren([this.resultBlock, this.sourceBlock, this.checkButton]);
    }
}
