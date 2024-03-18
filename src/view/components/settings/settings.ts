import './settings.css';
import Component from '../../common/component';
import AudioMuteControlIcon from '../../../assets/images/speaker-mute-hint.svg';
import AudioControlIcon from '../../../assets/images/speaker-hint.svg';
import TranslationHintIcon from '../../../assets/images/translation-hint.svg';
import ImageHintIcon from '../../../assets/images/image-hint.svg';
import gameController from '../../../controllers/gameController';
import { Level } from '../../../types/level';

export default class Settings extends Component {
    toggleTranslationHint: Component;

    toggleImageHintButton: Component;

    toggleAudioHintButton: Component;

    translationHintIcon: Component;

    toggleAudioHintIcon: Component;

    imageHintIcon: Component;

    levelSelectContainer: Component;

    levelSelect: Component;

    pageSelectContainer: Component;

    pageSelect: Component;

    isPlayAudioActive: boolean = true;

    isImageHintActive: boolean = true;

    isTranslationHintActive: boolean = true;

    constructor() {
        super({
            tag: 'div',
            className: 'settings',
        });

        this.toggleTranslationHint = new Component({
            tag: 'button',
            className: 'settings-button settings-button--checked',
        });

        this.toggleImageHintButton = new Component({
            tag: 'button',
            className: 'settings-button settings-button--checked',
        });

        this.toggleAudioHintButton = new Component({
            tag: 'button',
            className: 'settings-button settings-button--checked',
        });

        this.translationHintIcon = new Component({
            tag: 'img',
        });

        this.toggleAudioHintIcon = new Component({
            tag: 'img',
        });

        this.imageHintIcon = new Component({
            tag: 'img',
        });

        this.levelSelectContainer = new Component({ tag: 'div', className: 'level-select' });

        this.pageSelectContainer = new Component({ tag: 'div', className: 'page-select' });

        this.levelSelect = new Component({ tag: 'select' });

        this.pageSelect = new Component({ tag: 'select' });

        this.buildLevelSelect();
        this.buildPageSelect();
        this.setupListeners();
        this.setupAttribute();
        this.build();
    }

    buildLevelSelect() {
        const levelLabel = new Component({ tag: 'label', text: 'Level' });
        levelLabel.setAttribute('for', 'level');
        this.levelSelect.setAttribute('id', 'level');
        const levels = ['1', '2', '3', '4', '5', '6'].map((level, index) => {
            const option = new Component({ tag: 'option', text: level });
            option.setAttribute('value', String(index));
            return option;
        });
        this.levelSelect.appendChildren(levels);
        this.levelSelect.addListener('change', this.handleLevelSelect.bind(this));
        this.levelSelectContainer.appendChildren([levelLabel, this.levelSelect]);
    }

    buildPageSelect() {
        const pagelLabel = new Component({ tag: 'label', text: 'Page' });
        pagelLabel.setAttribute('for', 'page');
        this.pageSelect.setAttribute('id', 'page');

        this.pageSelect.addListener('change', Settings.handlePageSelect.bind(this));
        this.pageSelectContainer.appendChildren([pagelLabel, this.pageSelect]);
        this.buildPageSelectOptions();
    }

    buildPageSelectOptions() {
        const pages = gameController.currentRounds.map((level, index) => {
            const option = new Component({ tag: 'option', text: `${index + 1}` });
            option.setAttribute('value', String(index));
            return option;
        });
        this.pageSelect.destroyChildren();
        this.pageSelect.appendChildren(pages);
    }

    handleLevelSelect(event: Event) {
        const newLevel = Number((event.target as HTMLInputElement).value) as Level;
        gameController.currentLevel = newLevel;
        gameController.currentRound = 0;
        gameController.currentSentenceIndex = 0;
        this.buildPageSelectOptions();
        gameController.handleGameStart(true);
    }

    static handlePageSelect(event: Event) {
        const newPage = Number((event.target as HTMLInputElement).value);
        gameController.currentRound = newPage;
        gameController.currentSentenceIndex = 0;
        gameController.handleGameStart(true);
    }

    initSettings() {
        const storedIsTranslationHintActive = localStorage.getItem('isTranslationHintActive');
        this.isTranslationHintActive = storedIsTranslationHintActive ? JSON.parse(storedIsTranslationHintActive) : true;
        if (this.isTranslationHintActive) {
            gameController.handleTranslationHintVisibility(true);
            this.toggleTranslationHint.addClass('settings-button--checked');
        } else {
            gameController.handleTranslationHintVisibility(false);
            this.toggleTranslationHint.removeClass('settings-button--checked');
        }
        const storedIsImageHintActive = localStorage.getItem('isImageHintActive');
        this.isImageHintActive = storedIsImageHintActive ? JSON.parse(storedIsImageHintActive) : true;
        if (this.isImageHintActive) {
            this.removeClass('game-page--background-hidden');
            this.toggleImageHintButton.addClass('settings-button--checked');
        } else {
            this.addClass('game-page--background-hidden');
            this.toggleImageHintButton.removeClass('settings-button--checked');
        }
        const storedIsAudioHintActive = localStorage.getItem('isPlayAudioActive');
        this.isPlayAudioActive = storedIsAudioHintActive ? JSON.parse(storedIsAudioHintActive) : true;
        if (this.isPlayAudioActive) {
            gameController.handleAudioHintVisibility(true);
            this.toggleAudioHintIcon.setAttribute('src', AudioControlIcon);
            this.toggleAudioHintButton.addClass('settings-button--checked');
        } else {
            this.toggleAudioHintIcon.setAttribute('src', AudioMuteControlIcon);
            gameController.handleAudioHintVisibility(false);
            this.toggleAudioHintButton.removeClass('settings-button--checked');
        }
    }

    showTranslationHint() {
        this.isTranslationHintActive = !this.isTranslationHintActive;
        localStorage.setItem('isTranslationHintActive', JSON.stringify(this.isTranslationHintActive));
        if (this.isTranslationHintActive) {
            gameController.handleTranslationHintVisibility(true);
            this.toggleTranslationHint.addClass('settings-button--checked');
        } else {
            gameController.handleTranslationHintVisibility(false);
            this.toggleTranslationHint.removeClass('settings-button--checked');
        }
    }

    toggleAudioHint() {
        this.isPlayAudioActive = !this.isPlayAudioActive;
        localStorage.setItem('isPlayAudioActive', JSON.stringify(this.isPlayAudioActive));
        if (this.isPlayAudioActive) {
            gameController.handleAudioHintVisibility(true);
            this.toggleAudioHintIcon.setAttribute('src', AudioControlIcon);
            this.toggleAudioHintButton.addClass('settings-button--checked');
        } else {
            gameController.handleAudioHintVisibility(false);
            this.toggleAudioHintIcon.setAttribute('src', AudioMuteControlIcon);
            this.toggleAudioHintButton.removeClass('settings-button--checked');
        }
    }

    toggleImageHint() {
        this.isImageHintActive = !this.isImageHintActive;
        localStorage.setItem('isImageHintActive', JSON.stringify(this.isImageHintActive));
        if (this.isImageHintActive) {
            gameController.handleImageHintVisibility(true);
            this.toggleImageHintButton.addClass('settings-button--checked');
        } else {
            gameController.handleImageHintVisibility(false);
            this.toggleImageHintButton.removeClass('settings-button--checked');
        }
    }

    setupAttribute() {
        this.translationHintIcon.setAttribute('src', TranslationHintIcon);
        this.toggleAudioHintIcon.setAttribute('src', AudioControlIcon);
        this.imageHintIcon.setAttribute('src', ImageHintIcon);
    }

    setupListeners() {
        this.toggleTranslationHint.addListener('click', () => this.showTranslationHint());
        this.toggleAudioHintButton.addListener('click', () => this.toggleAudioHint());
        this.toggleImageHintButton.addListener('click', () => this.toggleImageHint());
    }

    build() {
        this.toggleImageHintButton.append(this.imageHintIcon);
        this.toggleTranslationHint.append(this.translationHintIcon);
        this.toggleAudioHintButton.append(this.toggleAudioHintIcon);
        this.appendChildren([
            this.toggleTranslationHint,
            this.toggleAudioHintButton,
            this.toggleImageHintButton,
            this.levelSelectContainer,
            this.pageSelectContainer,
        ]);
    }
}
