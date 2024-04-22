import './mainScreen.css';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';
import Header from '../header/header';
import Users from '../users/users';
import Chat from '../chat/chat';
import Footer from '../footer/footer';

export default class MainScreen extends Component {
    header!: Header;

    users!: Users;

    chat!: Chat;

    wrapper!: Component;

    footer!: Component;

    isCreated: boolean = false;

    constructor() {
        super({ tag: 'div', className: 'main-screen' });
        this.setupSubscribtions();
    }

    showMainScreen(payload?: { isLoggedin: boolean }) {
        if (payload) {
            if (payload.isLoggedin) {
                this.addClass('main-screen--shown');
            }
        } else {
            this.addClass('main-screen--shown');
        }
    }

    hideMainScreen() {
        this.removeClass('main-screen--shown');
    }

    destroyMainScreen() {
        this.isCreated = false;
        this.destroyChildren();
        this.hideMainScreen();
    }

    createMainScreen() {
        if (this.isCreated) {
            this.showMainScreen();
        } else {
            this.header = new Header();
            this.users = new Users();
            this.chat = new Chat();
            this.wrapper = new Component({
                tag: 'div',
                className: 'wrapper',
            });
            this.footer = new Footer();
            this.isCreated = true;

            this.build();
            this.showMainScreen();
        }
    }

    setupSubscribtions() {
        PS.subscribe(PublishSubscribeEvent.Loggedin, this.createMainScreen.bind(this));
        PS.subscribe(PublishSubscribeEvent.Logout, this.destroyMainScreen.bind(this));
        PS.subscribe(PublishSubscribeEvent.AboutShown, this.hideMainScreen.bind(this));
        PS.subscribe(PublishSubscribeEvent.AboutHidden, this.showMainScreen.bind(this));
    }

    build() {
        this.wrapper.appendChildren([this.users, this.chat]);
        this.appendChildren([this.header, this.wrapper, this.footer]);
    }
}
