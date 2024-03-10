import './startScreen.css';
import Component from '../../common/component';

export default class StartScreen extends Component {
    header: Component;

    description: Component;

    button: Component;

    constructor() {
        super({ tag: 'div', className: 'start-screen' });

        this.header = new Component({
            tag: 'h1',
            className: 'start_header',
            text: 'RSS Puzzle',
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

        // this.setupSubscribtion();
        // this.setupListeners();
        // this.setupState();
        this.build();
    }

    build() {
        this.appendChildren([this.header, this.description, this.button]);
    }
}
