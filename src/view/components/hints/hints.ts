import './hints.css';
import Component from '../../common/component';
import gameController from '../../../controllers/gameController';
import AudioActiveHintIcon from '../../../assets/images/speaker-active.svg';
import AudioHintIcon from '../../../assets/images/speaker.svg';

export default class Hints extends Component {
    translationHint: Component;

    playAudioHintIcon: Component;

    playAudioHintButton: Component;

    constructor() {
        super({
            tag: 'div',
            className: 'hints',
        });

        this.translationHint = new Component({
            tag: 'p',
            className: 'translation-hint',
        });

        this.playAudioHintButton = new Component({
            tag: 'button',
            className: 'play-button',
        });

        this.playAudioHintIcon = new Component({
            tag: 'img',
        });

        this.setupSubscribtion();
        this.setupListeners();
        this.setupAttribute();
        this.build();
    }

    addTranslationHint() {
        this.translationHint.setTextContent(gameController.currentTextExampleTranslate);
    }

    async playAudio() {
        const audioFile = await import(`../../../assets/${gameController.currentAudioExample}`);
        const audio = new Audio(audioFile.default);
        audio.addEventListener('playing', () => this.playAudioHintIcon.setAttribute('src', AudioActiveHintIcon));
        audio.addEventListener('ended', () => this.playAudioHintIcon.setAttribute('src', AudioHintIcon));
        audio.play();
    }

    setupSubscribtion() {
        gameController.onGameStart(this.addTranslationHint.bind(this));
        gameController.onInitNextSentence(this.addTranslationHint.bind(this));
        gameController.onAudioHintVisibility(this.showAudioHint.bind(this));
        gameController.onTranslationHintVisibility(this.showTranslationHint.bind(this));
    }

    showAudioHint(isVisible: boolean) {
        if (isVisible) {
            this.playAudioHintButton.removeClass('play-button--hidden');
        } else {
            this.playAudioHintButton.addClass('play-button--hidden');
        }
    }

    showTranslationHint(isVisible: boolean) {
        if (isVisible) {
            this.translationHint.removeClass('translation-hint--hidden');
        } else {
            this.translationHint.addClass('translation-hint--hidden');
        }
    }

    setupAttribute() {
        this.playAudioHintIcon.setAttribute('src', AudioHintIcon);
    }

    setupListeners() {
        this.playAudioHintButton.addListener('click', () => this.playAudio());
    }

    build() {
        this.playAudioHintButton.append(this.playAudioHintIcon);
        this.appendChildren([this.playAudioHintButton, this.translationHint]);
    }
}
