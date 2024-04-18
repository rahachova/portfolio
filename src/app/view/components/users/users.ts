import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent, User, WSMessage, WSMessageType } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';
import './users.css';

export default class Users extends Component {
    inputField: Component;

    activeUsersList: Component;

    inactiveUsersList: Component;

    constructor() {
        super({ tag: 'div', className: 'users' });

        this.inputField = new Component({
            tag: 'input',
            className: 'input-search',
        });
        this.activeUsersList = new Component({
            tag: 'div',
            className: 'users_list',
        });
        this.inactiveUsersList = new Component({
            tag: 'div',
            className: 'users_list',
        });

        this.setupSubscribtion();
        this.setupAttribute();
        this.build();
    }

    getUsers() {
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: uuidv4(),
            type: WSMessageType.USER_ACTIVE,
            payload: null,
        });
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: uuidv4(),
            type: WSMessageType.USER_INACTIVE,
            payload: null,
        });
    }

    listenSocket(data: WSMessage) {
        if (data.type === WSMessageType.USER_ACTIVE) {
            this.createActiveUsersList(data.payload.users);
        }
        if (data.type === WSMessageType.USER_INACTIVE) {
            this.createInactiveUsersList(data.payload.users);
        }
    }

    createActiveUsersList(users?: User[]) {
        const userElements = users?.map(({ login }) => {
            const user = new Component({
                tag: 'div',
                className: 'user',
            });
            const userStatus = new Component({
                tag: 'div',
                className: 'user_status--active',
            });
            const userName = new Component({
                tag: 'div',
                className: 'user_name',
                text: login,
            });
            user.re([userStatus, userName]);
            return user;
        });
        if (userElements) {
            this.activeUsersList.appendChildren(userElements);
        }
    }

    createInactiveUsersList(users?: User[]) {
        const userElements = users?.map(({ login }) => {
            const user = new Component({
                tag: 'div',
                className: 'user',
            });
            const userStatus = new Component({
                tag: 'div',
                className: 'user_status--inactive',
            });
            const userName = new Component({
                tag: 'div',
                className: 'user_name',
                text: login,
            });
            user.appendChildren([userStatus, userName]);
            return user;
        });
        if (userElements) {
            this.inactiveUsersList.appendChildren(userElements);
        }
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    setupAttribute() {
        this.inputField.setAttribute('placeholder', 'Search...');
    }

    build() {
        this.appendChildren([this.inputField, this.activeUsersList, this.inactiveUsersList]);
        this.getUsers();
    }
}
