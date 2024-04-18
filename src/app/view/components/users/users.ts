import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent, User, WSMessage, WSMessageType } from '../../../types/types';
import { v4 as uuidv4 } from 'uuid';
import './users.css';

export default class Users extends Component {
    inputField: Component;

    activeUsersList: Component;

    inactiveUsersList: Component;

    activeUsersData: User[] | undefined = [];

    inactiveUsersData: User[] | undefined = [];

    userNameFilter: string = '';

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
        this.setupListener();
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
            this.activeUsersData = data.payload.users;
            this.renderActiveUsersList();
        }
        if (data.type === WSMessageType.USER_INACTIVE) {
            this.inactiveUsersData = data.payload.users;
            this.renderInactiveUsersList();
        }
    }

    renderActiveUsersList() {
        const userElements = this.activeUsersData
            ?.filter((user: User) => user.login.toLowerCase().includes(this.userNameFilter.toLowerCase()))
            .map(({ login }) => {
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
                user.appendChildren([userStatus, userName]);
                return user;
            });
        if (userElements) {
            this.activeUsersList.destroyChildren();
            this.activeUsersList.appendChildren(userElements);
        }
    }

    renderInactiveUsersList() {
        const userElements = this.inactiveUsersData
            ?.filter((user: User) => user.login.toLowerCase().includes(this.userNameFilter.toLowerCase()))
            .map(({ login }) => {
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
            this.inactiveUsersList.destroyChildren();
            this.inactiveUsersList.appendChildren(userElements);
        }
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    setupListener() {
        this.inputField.addListener('input', (event) => {
            this.userNameFilter = (event.target as HTMLInputElement).value;
            this.renderActiveUsersList();
            this.renderInactiveUsersList();
        });
    }

    setupAttribute() {
        this.inputField.setAttribute('placeholder', 'Search...');
    }

    build() {
        this.appendChildren([this.inputField, this.activeUsersList, this.inactiveUsersList]);
        this.getUsers();
    }
}
