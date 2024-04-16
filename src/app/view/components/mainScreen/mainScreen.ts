import './mainScreen.css';
import Component from '../../../common/component';
import loginController from '../../../controllers/loginController';
import PS from '../../../common/publishSubscribe';
import PublishSubscribeEvents from '../../../types/publishSubscribeEvents';
import Header from '../header/header';

export default class MainScreen extends Component {
    header: Header;

    constructor() {
        super({ tag: 'div', className: 'main-screen' });

        this.header = new Header();

        this.setupSubscribtion();
        // this.setupListeners();
        this.setupState();
        this.build();
    }

    showMainScreen() {
        this.addClass('main-screen--shown');
    }

    hideMainScreen() {
        this.removeClass('main-screen--shown');
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvents.Login, this.showMainScreen.bind(this));
        PS.subscribe(PublishSubscribeEvents.Logout, this.hideMainScreen.bind(this));
    }

    setupState() {
        if (loginController.isLoggedin) {
            this.showMainScreen();
        }
    }

    build() {
        this.appendChildren([this.header]);
    }
}
