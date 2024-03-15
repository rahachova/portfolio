import './gamePage.css';
import Component from '../../common/component';
import Card from '../card/card';
import gameController, { GameController } from '../../../controllers/gameController';
import loginController from '../../../controllers/loginController';
import { Level } from '../../../types/level';
import ResultBlock from '../resultBlock/resultBlock';

export default class GamePage extends Component {
    activeResultBlock: ResultBlock;

    resultField: Component;

    sourceBlock: Component;

    controls: Component;

    checkButton: Component;

    continueButton: Component;

    autoCompleteButton: Component;

    cardQuantity: number = 0;

    maxSentenceIndex: number = 9;

    currentLevel: Level = 1;

    currentRound: number = 0;

    currentSentenceIndex: number = 0;

    constructor() {
        super({ tag: 'div', className: 'game-page' });
        this.resultField = new Component({
            tag: 'div',
            className: 'result-field',
        });

        this.activeResultBlock = new ResultBlock();
        this.sourceBlock = new Component({
            tag: 'div',
            className: 'source-block',
        });
        this.checkButton = new Component({
            tag: 'button',
            className: 'button button--hidden',
            text: 'Check',
        });
        this.controls = new Component({
            tag: 'div',
            className: 'controls',
        });
        this.continueButton = new Component({
            tag: 'button',
            className: 'button button--hidden',
            text: 'Continue',
        });
        this.autoCompleteButton = new Component({
            tag: 'button',
            className: 'button',
            text: 'Auto Complete',
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

    showContinueButton() {
        this.continueButton.removeClass('button--hidden');
    }

    hideContinueButton() {
        this.continueButton.addClass('button--hidden');
    }

    createCards() {
        const arrayOfWords = GameController.getWordCollection(this.currentLevel).rounds[this.currentRound].words[
            this.currentSentenceIndex
        ].textExample.split(' ');
        this.cardQuantity = arrayOfWords.length;
        const cardWidths = GamePage.calculateCardWidths(arrayOfWords);
        return arrayOfWords.map((word, index) => {
            const card = new Card(word, index);
            card.setAttribute('style', `width: ${cardWidths[index]}%;`);
            card.setAttribute('draggable', 'true');
            card.setAttribute('id', `${index}`);
            card.addListener('click', (event: Event) => this.moveCardToResultBlock(card, event));
            card.addListener('click', (event: Event) => this.moveCardToSourceBlock(card, event));
            card.addListener('dragstart', (event) => GamePage.handleDragStart(event as DragEvent, card as Card));
            return card;
        });
    }

    static calculateCardWidths(array: string[]): number[] {
        const totalSymbolsAmount = array.reduce((accum, currentValue) => accum + currentValue.length, 0);
        const percentsPerSymbol = 100 / totalSymbolsAmount;
        return array.map((word) => word.length * percentsPerSymbol);
    }

    moveCardToResultBlock(card: Card, event?: Event) {
        if (card.isUsed || card.isInactive) {
            return;
        }
        this.activeResultBlock.append(card);
        this.sourceBlock.removeChild(card);
        card.setIsUsed(true);
        event?.stopImmediatePropagation();
        if (this.cardQuantity === this.activeResultBlock.getChildren().length) {
            this.showCheckButton();
        }
    }

    moveCardToSourceBlock(card: Card, event: Event) {
        if (!card.isUsed || card.isInactive) {
            return;
        }
        this.sourceBlock.append(card);
        this.activeResultBlock.removeChild(card);
        card.setIsUsed(false);
        card.removeClass('card--correct');
        card.removeClass('card--incorrect');
        event.stopImmediatePropagation();
        if (this.cardQuantity === this.activeResultBlock.getChildren().length) {
            this.hideCheckButton();
        }
    }

    static shuffleCards(arrayOfCards: Card[]) {
        return arrayOfCards.sort(() => Math.random() - 0.5);
    }

    checkResult() {
        const isCorrect = this.activeResultBlock.checkIsCorrect();
        if (isCorrect) {
            this.checkButton.addClass('button--hidden');
            this.continueButton.removeClass('button--hidden');
        }
    }

    handleAutoComplete() {
        [...this.sourceBlock.getChildren()].forEach((card) => {
            this.moveCardToResultBlock(card as Card);
        });
        this.activeResultBlock.setCorrectOrder();
    }

    initNextSentence() {
        this.activeResultBlock = new ResultBlock();
        this.resultField.append(this.activeResultBlock);
    }

    switchToNextSentence() {
        if (this.currentSentenceIndex === this.maxSentenceIndex) {
            this.resultField.destroyChildren();
            this.currentRound += 1;
            this.currentSentenceIndex = 0;
        } else {
            this.currentSentenceIndex += 1;
        }
    }

    handleContinueButton() {
        this.activeResultBlock.disableInactiveCards();
        this.switchToNextSentence();
        this.initNextSentence();
        this.fillSourceBlock();
        this.hideContinueButton();
    }

    fillSourceBlock() {
        this.sourceBlock.destroyChildren();
        this.sourceBlock.appendChildren(GamePage.shuffleCards(this.createCards()));
    }

    static handleDragStart(event: DragEvent, card: Card) {
        // event.preventDefault();
        event.dataTransfer?.setData('text', String(card.cardIndex));
        event.dataTransfer!.dropEffect = 'move';
    }

    static handleDragover(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
    }

    handleResultDrop(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
        const id = Number(event.dataTransfer?.getData('text'));
        const cardToMove = (this.sourceBlock.getChildren() as Card[]).find((card: Card) => card.cardIndex === id) as Card;
        if (!cardToMove) {
            GamePage.rearangeInResultBlock(event, id, this.activeResultBlock);
            return;
        }
        this.activeResultBlock.append(cardToMove);
        this.sourceBlock.removeChild(cardToMove);
        cardToMove.setIsUsed(true);
        if (this.cardQuantity === this.activeResultBlock.getChildren().length) {
            this.showCheckButton();
        }
    }

    static rearangeInResultBlock(event: DragEvent, cardIndex: number, block: Component) {
        if (!(event.target as HTMLElement).classList.contains('card')) {
            return;
        }
        const targetWidth = (event.target as HTMLElement).offsetWidth;
        const clickOffset = event.offsetX;
        const isMoveBeforeTarget = clickOffset < targetWidth / 2;
        const targedCardId = Number((event.target as HTMLElement).id);
        const resultCards = block.getChildren() as Card[];
        const cardToMoveIndex = resultCards.findIndex((card: Card) => card.cardIndex === cardIndex);
        const [cardToMove] = resultCards.splice(cardToMoveIndex, 1);
        const targedCardIndex = resultCards.findIndex((card: Card) => card.cardIndex === targedCardId);
        const indexToMoveOn = isMoveBeforeTarget ? targedCardIndex : targedCardIndex + 1;
        const newCards = [...resultCards.slice(0, indexToMoveOn), cardToMove, ...resultCards.slice(indexToMoveOn)];
        block.destroyChildren();
        block.appendChildren(newCards);
    }

    handleSourceDrop(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
        const id = Number(event.dataTransfer?.getData('text'));
        const cardToMove = (this.activeResultBlock.getChildren() as Card[]).find((card: Card) => card.cardIndex === id) as Card;
        if (!cardToMove) {
            GamePage.rearangeInResultBlock(event, id, this.sourceBlock);
            return;
        }
        this.sourceBlock.append(cardToMove);
        this.activeResultBlock.removeChild(cardToMove);
        cardToMove.setIsUsed(false);
        if (this.cardQuantity > this.activeResultBlock.getChildren().length) {
            this.hideCheckButton();
        }
    }

    setupSubscribtion() {
        gameController.onGameStart(this.initGamePage.bind(this));
        loginController.onLogout(this.hideGamePage.bind(this));
    }

    setupListeners() {
        this.checkButton.addListener('click', this.checkResult.bind(this));
        this.continueButton.addListener('click', this.handleContinueButton.bind(this));
        this.autoCompleteButton.addListener('click', this.handleAutoComplete.bind(this));
        this.resultField.addListener('dragover', (event) => GamePage.handleDragover(event as DragEvent));
        this.resultField.addListener('drop', (event) => this.handleResultDrop(event as DragEvent));
        this.sourceBlock.addListener('dragover', (event) => GamePage.handleDragover(event as DragEvent));
        this.sourceBlock.addListener('drop', (event) => this.handleSourceDrop(event as DragEvent));
    }

    build() {
        this.resultField.append(this.activeResultBlock);
        this.controls.appendChildren([this.autoCompleteButton, this.checkButton, this.continueButton]);
        this.appendChildren([this.resultField, this.sourceBlock, this.controls]);
    }
}
