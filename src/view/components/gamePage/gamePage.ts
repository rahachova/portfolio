import './gamePage.css';
import Component from '../../common/component';
import Card from '../card/card';
import gameController, { GameController } from '../../../controllers/gameController';
import loginController from '../../../controllers/loginController';
import { Level } from '../../../types/level';
import ResultBlock from '../resultBlock/resultBlock';
import TranslationHintIcon from '../../../assets/images/translation-hint.svg';
import AudioMuteControlIcon from '../../../assets/images/speaker-mute-hint.svg';
import AudioControlIcon from '../../../assets/images/speaker-hint.svg';
import AudioActiveHintIcon from '../../../assets/images/speaker-active.svg';
import AudioHintIcon from '../../../assets/images/speaker.svg';

export default class GamePage extends Component {
    activeResultBlock: ResultBlock;

    resultField: Component;

    sourceBlock: Component;

    controls: Component;

    settings: Component;

    checkButton: Component;

    continueButton: Component;

    autoCompleteButton: Component;

    translationHint: Component;

    toggleTranslationHint: Component;

    translationHintIcon: Component;

    toggleAudioHintButton: Component;

    toggleAudioHintIcon: Component;

    playAudioHintButton: Component;

    playAudioHintIcon: Component;

    cardQuantity: number = 0;

    maxSentenceIndex: number = 9;

    currentLevel: Level = 1;

    currentRound: number = 0;

    currentSentenceIndex: number = 0;

    isPlayAudioActive: boolean = false;

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
        this.toggleTranslationHint = new Component({
            tag: 'button',
            className: 'settings-button',
        });
        this.translationHintIcon = new Component({
            tag: 'img',
        });
        this.translationHint = new Component({
            tag: 'p',
            className: 'translation-hint',
        });
        this.toggleAudioHintButton = new Component({
            tag: 'button',
            className: 'settings-button',
        });
        this.toggleAudioHintIcon = new Component({
            tag: 'img',
        });
        this.playAudioHintButton = new Component({
            tag: 'button',
            className: 'play-button play-button--hidden',
        });
        this.playAudioHintIcon = new Component({
            tag: 'img',
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
        this.settings = new Component({
            tag: 'div',
            className: 'settings',
        });
        this.setupSubscribtion();
        this.setupListeners();
        this.setupAttribute();
        this.build();
    }

    initGamePage() {
        this.showGamePage();
        this.fillSourceBlock();
        this.addTranslationHint();
    }

    addTranslationHint() {
        this.translationHint.setTextContent(
            GameController.getWordCollection(this.currentLevel).rounds[this.currentRound].words[this.currentSentenceIndex]
                .textExampleTranslate
        );
    }

    toggleAudioHint() {
        this.isPlayAudioActive = !this.isPlayAudioActive;
        if (this.isPlayAudioActive) {
            this.playAudioHintButton.removeClass('play-button--hidden');
            this.toggleAudioHintIcon.setAttribute('src', AudioControlIcon);
            this.toggleAudioHintButton.addClass('settings-button--checked');
        } else {
            this.toggleAudioHintIcon.setAttribute('src', AudioMuteControlIcon);
            this.playAudioHintButton.addClass('play-button--hidden');
            this.toggleAudioHintButton.removeClass('settings-button--checked');
        }
    }

    async playAudio() {
        const audioFile = await import(
            `../../../assets/${GameController.getWordCollection(this.currentLevel).rounds[this.currentRound].words[this.currentSentenceIndex].audioExample}`
        );
        const audio = new Audio(audioFile.default);
        audio.addEventListener('playing', () => this.playAudioHintIcon.setAttribute('src', AudioActiveHintIcon));
        audio.addEventListener('ended', () => this.playAudioHintIcon.setAttribute('src', AudioHintIcon));
        audio.play();
    }

    showTranslationHint() {
        if (this.toggleTranslationHint.checkClass('settings-button--checked')) {
            this.translationHint.removeClass('translation-hint--shown');
            this.toggleTranslationHint.removeClass('settings-button--checked');
        } else {
            this.translationHint.addClass('translation-hint--shown');
            this.toggleTranslationHint.addClass('settings-button--checked');
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
            this.showPlayButtonOnCorrectCheck();
        }
    }

    showPlayButtonOnCorrectCheck() {
        if (!this.isPlayAudioActive) {
            this.playAudioHintButton.removeClass('play-button--hidden');
        }
    }

    hidePlayButtonOnContinue() {
        if (!this.isPlayAudioActive) {
            this.playAudioHintButton.addClass('play-button--hidden');
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
        this.addTranslationHint();
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
        this.hidePlayButtonOnContinue();
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

    setupAttribute() {
        this.translationHintIcon.setAttribute('src', TranslationHintIcon);
        this.playAudioHintIcon.setAttribute('src', AudioHintIcon);
        this.toggleAudioHintIcon.setAttribute('src', AudioMuteControlIcon);
    }

    setupListeners() {
        this.checkButton.addListener('click', this.checkResult.bind(this));
        this.continueButton.addListener('click', this.handleContinueButton.bind(this));
        this.autoCompleteButton.addListener('click', this.handleAutoComplete.bind(this));
        this.resultField.addListener('dragover', (event) => GamePage.handleDragover(event as DragEvent));
        this.resultField.addListener('drop', (event) => this.handleResultDrop(event as DragEvent));
        this.sourceBlock.addListener('dragover', (event) => GamePage.handleDragover(event as DragEvent));
        this.sourceBlock.addListener('drop', (event) => this.handleSourceDrop(event as DragEvent));
        this.toggleTranslationHint.addListener('click', () => this.showTranslationHint());
        this.toggleAudioHintButton.addListener('click', () => this.toggleAudioHint());
        this.playAudioHintButton.addListener('click', () => this.playAudio());
    }

    build() {
        this.settings.appendChildren([this.toggleTranslationHint, this.toggleAudioHintButton]);
        this.resultField.append(this.activeResultBlock);
        this.toggleTranslationHint.append(this.translationHintIcon);
        this.toggleAudioHintButton.append(this.toggleAudioHintIcon);
        this.playAudioHintButton.append(this.playAudioHintIcon);
        this.controls.appendChildren([this.autoCompleteButton, this.checkButton, this.continueButton]);
        this.appendChildren([
            this.settings,
            this.playAudioHintButton,
            this.translationHint,
            this.resultField,
            this.sourceBlock,
            this.controls,
        ]);
    }
}
