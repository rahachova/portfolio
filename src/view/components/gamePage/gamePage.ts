import './gamePage.css';
import Component from '../../common/component';
import Card from '../card/card';
import gameController from '../../../controllers/gameController';
import loginController from '../../../controllers/loginController';
import ResultBlock from '../resultBlock/resultBlock';
import Settings from '../settings/settings';
import Hints from '../hints/hints';

export default class GamePage extends Component {
    activeResultBlock: ResultBlock;

    settings: Settings;

    hints: Hints;

    resultField: Component;

    sourceBlock: Component;

    controls: Component;

    checkButton: Component;

    continueButton: Component;

    autoCompleteButton: Component;

    cardQuantity: number = 0;

    constructor() {
        super({ tag: 'div', className: 'game-page' });
        this.resultField = new Component({
            tag: 'div',
            className: 'result-field',
        });

        this.activeResultBlock = new ResultBlock();
        this.settings = new Settings();
        this.hints = new Hints();
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

    initGamePage(isReset: boolean = false) {
        this.settings.initSettings();
        this.showGamePage();
        this.fillSourceBlock();
        this.hideCheckButton();
        this.hideContinueButton();
        if (isReset) {
            this.activeResultBlock = new ResultBlock();
            this.resultField.destroyChildren();
            this.resultField.append(this.activeResultBlock);
        }
    }

    showImageHint(isVisible: boolean) {
        if (isVisible) {
            this.removeClass('game-page--background-hidden');
        } else {
            this.addClass('game-page--background-hidden');
        }
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

    async createCards() {
        const arrayOfWords = gameController.currentTextExample.split(' ');
        this.cardQuantity = arrayOfWords.length;
        const cardWidths = GamePage.calculateCardWidths(arrayOfWords);
        const imageSrc = await import(`../../../assets/images/${gameController.currentImage}`);
        return arrayOfWords.map((word, index) => {
            const card = new Card(word, index);
            const backgroundOffSet = cardWidths.slice(0, index).reduce((offSet, width) => offSet + width, 0);
            const calculatedBackgroundXOffSet = index > 0 ? `-${backgroundOffSet}px` : 'unset';
            const calculatedBackgroundYOffSet = `-${50 * gameController.currentSentenceIndex}px`;

            card.setAttribute(
                'style',
                `width: ${cardWidths[index]}px; background-image: url(${imageSrc.default}); background-position-x: ${calculatedBackgroundXOffSet}; background-position-y: ${calculatedBackgroundYOffSet};`
            );
            card.setAttribute('draggable', 'true');
            card.setAttribute('id', `${index}`);
            if (index === 0) {
                card.addClass('card--first');
            } else if (index === arrayOfWords.length - 1) {
                card.addClass('card--last');
            }
            card.addListener('click', (event: Event) => this.moveCardToResultBlock(card, event));
            card.addListener('click', (event: Event) => this.moveCardToSourceBlock(card, event));
            card.addListener('dragstart', (event) => GamePage.handleDragStart(event as DragEvent, card as Card));
            return card;
        });
    }

    static calculateCardWidths(array: string[]): number[] {
        const imageWidth = 768;
        const totalSymbolsAmount = array.reduce((accum, currentValue) => accum + currentValue.length, 0);
        const pixelsPerSymbol = imageWidth / totalSymbolsAmount;
        return array.map((word) => word.length * pixelsPerSymbol);
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
            this.showPlayButtonOnCorrectCheck();
            this.activeResultBlock.disableInactiveCards();
        }
    }

    showPlayButtonOnCorrectCheck() {
        if (!this.settings.isPlayAudioActive) {
            gameController.handleAudioHintVisibility(true);
        }
    }

    hidePlayButtonOnContinue() {
        if (!this.settings.isPlayAudioActive) {
            gameController.handleAudioHintVisibility(false);
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
        gameController.handleInitNextSentence();
        this.resultField.append(this.activeResultBlock);
    }

    handleContinueButton() {
        const isNeedSwitchToNextRound = gameController.switchToNextSentence();
        if (isNeedSwitchToNextRound) {
            this.resultField.destroyChildren();
        }
        this.initNextSentence();
        this.fillSourceBlock();
        this.hideContinueButton();
        this.hidePlayButtonOnContinue();
    }

    async fillSourceBlock() {
        this.sourceBlock.destroyChildren();
        const sourceCards = await this.createCards();
        this.sourceBlock.appendChildren(GamePage.shuffleCards(sourceCards));
    }

    static handleDragStart(event: DragEvent, card: Card) {
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
            GamePage.rearangeInBlock(event, id, this.activeResultBlock);
            return;
        }
        this.activeResultBlock.append(cardToMove);
        this.sourceBlock.removeChild(cardToMove);
        cardToMove.setIsUsed(true);
        if (this.cardQuantity === this.activeResultBlock.getChildren().length) {
            this.showCheckButton();
        }
        if ((event.target as HTMLElement).classList.contains('card')) {
            GamePage.rearangeInBlock(event, id, this.activeResultBlock);
        }
    }

    static rearangeInBlock(event: DragEvent, cardIndex: number, block: Component) {
        const cards = block.getChildren() as Card[];
        const cardToMoveIndex = cards.findIndex((card: Card) => card.cardIndex === cardIndex);
        const [cardToMove] = cards.splice(cardToMoveIndex, 1);
        let newCards;
        if ((event.target as HTMLElement).classList.contains('card')) {
            const targetWidth = (event.target as HTMLElement).offsetWidth;
            const clickOffset = event.offsetX;
            const isMoveBeforeTarget = clickOffset < targetWidth / 2;
            const targedCardId = Number((event.target as HTMLElement).id);
            const targedCardIndex = cards.findIndex((card: Card) => card.cardIndex === targedCardId);
            const indexToMoveOn = isMoveBeforeTarget ? targedCardIndex : targedCardIndex + 1;
            newCards = [...cards.slice(0, indexToMoveOn), cardToMove, ...cards.slice(indexToMoveOn)];
        } else {
            newCards = [...cards, cardToMove];
        }
        block.destroyChildren();
        block.appendChildren(newCards);
    }

    handleSourceDrop(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
        const id = Number(event.dataTransfer?.getData('text'));
        const cardToMove = (this.activeResultBlock.getChildren() as Card[]).find((card: Card) => card.cardIndex === id) as Card;
        if (!cardToMove) {
            GamePage.rearangeInBlock(event, id, this.sourceBlock);
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
        gameController.onImageHintVisibility(this.showImageHint.bind(this));
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
        this.appendChildren([this.settings, this.hints, this.resultField, this.sourceBlock, this.controls]);
    }
}
