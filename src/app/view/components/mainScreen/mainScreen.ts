import './mainScreen.css';
import Component from '../../../common/component';
import loginController from '../../../controllers/loginController';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';
import Header from '../header/header';
import Users from '../users/users';
import Chat from '../chat/chat';

export default class MainScreen extends Component {
    header!: Header;

    users!: Users;

    chat!: Chat;

    wrapper!: Component;

    constructor() {
        super({ tag: 'div', className: 'main-screen' });
        this.setupSubscribtions();
    }

    showMainScreen() {
        this.addClass('main-screen--shown');
    }

    hideMainScreen() {
        this.removeClass('main-screen--shown');
        this.destroyChildren();
    }

    createMainScreen() {
        this.header = new Header();
        this.users = new Users();
        this.chat = new Chat();
        this.wrapper = new Component({
            tag: 'div',
            className: 'wrapper',
        });

        this.build();
        this.showMainScreen();
    }

    setupSubscribtions() {
        PS.subscribe(PublishSubscribeEvent.Loggedin, this.createMainScreen.bind(this));
        PS.subscribe(PublishSubscribeEvent.Logout, this.hideMainScreen.bind(this));
    }

    build() {
        this.wrapper.appendChildren([this.users, this.chat]);
        this.appendChildren([this.header, this.wrapper]);
    }
}
