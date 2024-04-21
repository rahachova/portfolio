import { v4 as uuidv4 } from 'uuid';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { PublishSubscribeEvent, User, WSMessage, WSMessageType, WSPayload } from '../../../types/types';
import './users.css';
import UserComponent from '../user/user';

export default class Users extends Component {
    inputField: Component;

    activeUsersList: Component;

    inactiveUsersList: Component;

    activeUsersData: User[] | undefined = [];

    inactiveUsersData: User[] | undefined = [];

    authenticatedUser: string | null = localStorage.getItem('name');

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

    static getUsers() {
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

    handleUserLogout(payload: WSPayload) {
        const userElement = this.activeUsersList.getChildren().find((user) => (user as UserComponent).login === payload.user?.login);
        if (userElement) {
            this.activeUsersList.removeChild(userElement);
            this.inactiveUsersList.append(userElement);
        }
    }

    handleUserLogin(payload: WSPayload) {
        const userElement = this.inactiveUsersList.getChildren().find((user) => (user as UserComponent).login === payload.user?.login);
        if (userElement) {
            this.inactiveUsersList.removeChild(userElement);
            this.activeUsersList.append(userElement);
        } else if (payload.user) {
            const { login, isLogined } = payload.user;
            const newUser = new UserComponent(login, isLogined);
            this.activeUsersList.append(newUser);
        }
    }

    listenSocket(data: WSMessage) {
        switch (data.type) {
            case WSMessageType.USER_ACTIVE:
                this.activeUsersData = data.payload.users?.filter((user) => user.login !== this.authenticatedUser);
                this.renderUsersList(this.activeUsersData, true);
                break;
            case WSMessageType.USER_INACTIVE:
                this.inactiveUsersData = data.payload.users?.filter((user) => user.login !== this.authenticatedUser);
                this.renderUsersList(this.inactiveUsersData, false);
                break;
            case WSMessageType.USER_EXTERNAL_LOGIN:
                this.handleUserLogin(data.payload);
                break;
            case WSMessageType.USER_EXTERNAL_LOGOUT:
                this.handleUserLogout(data.payload);
                break;
            default:
                break;
        }
    }

    renderUsersList(usersData: User[] | undefined, isActive: boolean) {
        const userElements = usersData?.map(({ login }) => new UserComponent(login, isActive));
        if (userElements) {
            switch (isActive) {
                case true:
                    this.activeUsersList.appendChildren(userElements);
                    break;
                case false:
                    this.inactiveUsersList.appendChildren(userElements);
                    break;
                default:
                    break;
            }
        }
    }

    setupSubscribtion() {
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    setupListener() {
        this.inputField.addListener('input', (event) => {
            const userNameFilter = (event.target as HTMLInputElement).value;
            this.activeUsersList.getChildren().forEach((user) => {
                if ((user as UserComponent).login.toLowerCase().includes(userNameFilter.toLowerCase())) {
                    user.removeClass('user--hidden');
                } else {
                    user.addClass('user--hidden');
                }
            });
            this.inactiveUsersList.getChildren().forEach((user) => {
                if ((user as UserComponent).login.toLowerCase().includes(userNameFilter.toLowerCase())) {
                    user.removeClass('user--hidden');
                } else {
                    user.addClass('user--hidden');
                }
            });
        });
        this.activeUsersList.addListener('click', (event) => {
            if ((event.target as HTMLElement).classList.contains('user_name')) {
                PS.sendEvent(PublishSubscribeEvent.SelectInterlocutor, { login: (event.target as HTMLElement).id, active: true });
            }
        });
        this.inactiveUsersList.addListener('click', (event) => {
            if ((event.target as HTMLElement).classList.contains('user_name')) {
                PS.sendEvent(PublishSubscribeEvent.SelectInterlocutor, { login: (event.target as HTMLElement).id, active: false });
            }
        });
    }

    setupAttribute() {
        this.inputField.setAttribute('placeholder', 'Search...');
    }

    build() {
        this.appendChildren([this.inputField, this.activeUsersList, this.inactiveUsersList]);
        Users.getUsers();
    }
}
