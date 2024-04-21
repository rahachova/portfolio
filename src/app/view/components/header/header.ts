import Button from '../../../common/button/button';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';
import './header.css';

export default class Header extends Component {
    userName: Component;

    gameName: Component;

    buttonAbout: Button;

    buttonLeave: Button;

    constructor() {
        super({ tag: 'div', className: 'header' });

        this.userName = new Component({
            tag: 'p',
            className: 'header_item',
            text: `User: ${localStorage.getItem('name')}`,
        });
        this.gameName = new Component({
            tag: 'p',
            className: 'header_item',
            text: 'Fun chat',
        });
        this.buttonAbout = new Button({
            text: 'About',
            onClick: Header.handleLogoutClick.bind(this),
        });
        this.buttonLeave = new Button({
            text: 'Leave',
            onClick: Header.handleLogoutClick.bind(this),
        });
        this.build();
    }

    static handleLogoutClick() {
        PS.sendEvent(PublishSubscribeEvent.Logout);
    }

    build() {
        this.appendChildren([this.userName, this.gameName, this.buttonAbout, this.buttonLeave]);
    }
}
