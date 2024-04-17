import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent } from '../../../types/types';
import './users.css';

export default class Users extends Component {
    inputField: Component;

    usersList: Component;

    user: Component;

    userStatus: Component;

    userName: Component;

    constructor() {
        super({ tag: 'div', className: 'users' });

        this.inputField = new Component({
            tag: 'input',
            className: 'input-search',
        });
        this.usersList = new Component({
            tag: 'div',
            className: 'users_list',
        });
        this.user = new Component({
            tag: 'div',
            className: 'user',
        });
        this.userStatus = new Component({
            tag: 'div',
            className: 'user_status',
        });
        this.userName = new Component({
            tag: 'div',
            className: 'user_name',
            text: 'Alia',
        });

        // this.setupSubscribtion();
        // this.setupListeners();
        // this.setupState();
        this.setupAttribute();
        this.build();
    }

    setupAttribute() {
        this.inputField.setAttribute('placeholder', 'Search...');
    }

    build() {
        this.user.appendChildren([this.userStatus, this.userName]);
        this.usersList.appendChildren([this.user]);
        this.appendChildren([this.inputField, this.usersList]);
    }
}
