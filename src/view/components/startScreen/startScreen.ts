import './startScreen.css';
import Component from '../../common/component';
import loginController from '../../../controllers/loginController';
import gameController from '../../../controllers/gameController';

export default class StartScreen extends Component {
    header: Component;

    greeting: Component;

    description: Component;

    button: Component;

    constructor() {
        super({ tag: 'div', className: 'start-screen' });

        this.header = new Component({
            tag: 'h1',
            className: 'start_header',
            text: 'RSS Puzzle',
        });
        this.greeting = new Component({
            tag: 'h2',
            className: 'start_greeting',
            text: `Hello, ${loginController.getFullName()}!`,
        });
        this.description = new Component({
            tag: 'p',
            className: 'start_description',
            text: 'Embark on a thrilling journey through the realm of language mastery! \r\nIn "RSS Puzzle" players immerse themselves in a world of jumbled words, where every level presents a new challenge to conquer. Are you ready to unravel the mysteries of language and become a master wordsmith? \r\nStart the adventure in "RSS Puzzle" now!',
        });
        this.button = new Component({
            tag: 'button',
            className: 'button',
            text: 'Start',
        });

        this.setupSubscribtion();
        this.setupListeners();
        // this.setupState();
        this.build();
    }

    updateGreeting() {
        this.greeting.setTextContent(`Hello, ${loginController.getFullName()}!`);
    }

    setupSubscribtion() {
        loginController.onLogin(this.updateGreeting.bind(this));
        loginController.onLogout(this.showStartScreen.bind(this));
    }

    setupListeners() {
        this.button.addListener('click', this.handleStart.bind(this));
    }

    handleStart() {
        this.hideStartScreen();
        setTimeout(() => gameController.handleGameStart(), 500);
    }

    hideStartScreen() {
        this.addClass('start-screen--hidden');
    }

    showStartScreen() {
        this.removeClass('start-screen--hidden');
    }

    build() {
        this.appendChildren([this.header, this.greeting, this.description, this.button]);
    }
}
