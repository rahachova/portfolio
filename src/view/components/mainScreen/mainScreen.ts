import './mainScreen.css';
import Component from '../../common/component';
import loginController from '../../../controllers/loginController';

export default class MainScreen extends Component {
    header: Component;

    button: Component;

    constructor() {
        super({ tag: 'div', className: 'main-screen' });

        this.header = new Component({
            tag: 'div',
            className: 'main_header',
        });
        this.button = new Component({
            tag: 'button',
            className: 'button',
            text: 'Logout',
        });

        this.setupSubscribtion();
        this.setupListeners();
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
        loginController.onLogin(this.showMainScreen.bind(this));
    }

    setupListeners() {
        this.button.addListener('click', this.handleLogoutClick.bind(this));
    }

    setupState() {
        if (loginController.isLoggedin) {
            this.showMainScreen();
        }
    }

    handleLogoutClick() {
        this.hideMainScreen();
        loginController.handleLogout();
    }

    build() {
        this.header.append(this.button);

        this.append(this.header);
    }
}
