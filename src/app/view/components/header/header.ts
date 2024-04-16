import Button from '../../../common/button/button';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import PublishSubscribeEvents from '../../../types/publishSubscribeEvents';
import './header.css';

export default class Header extends Component {
    userName: Component;

    gameName: Component;

    buttonLeave: Button;

    constructor() {
        super({ tag: 'div', className: 'header' });

        this.userName = new Component({
            tag: 'p',
            className: 'header_item',
            text: 'User: ',
        });
        this.gameName = new Component({
            tag: 'p',
            className: 'header_item',
            text: 'Fun chat',
        });
        this.buttonLeave = new Button({
            text: 'Leave',
            onClick: Header.handleLogoutClick.bind(this),
        });

        // this.setupSubscribtion();
        // this.setupListeners();
        // this.setupState();
        this.build();
    }

    static handleLogoutClick() {
        PS.sendEvent(PublishSubscribeEvents.Logout);
    }

    build() {
        this.appendChildren([this.userName, this.gameName, this.buttonLeave]);
    }
}
