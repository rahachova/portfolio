import { v4 as uuidv4 } from 'uuid';
import Component from '../../../common/component';
import PS from '../../../common/publishSubscribe';
import { Message, PublishSubscribeEvent, WSMessage, WSMessageType, WSPayload } from '../../../types/types';
import './user.css';

export default class UserComponent extends Component {
    userStatus: Component;

    userName: Component;

    unreadCount: Component;

    login: string;

    isActive: boolean;

    messagesHistoryRequestId: string | undefined;

    unreadMessages: Message[] = [];

    constructor(login: string, isActive: boolean) {
        super({ tag: 'div', className: 'user' });

        this.login = login;
        this.isActive = isActive;

        this.userStatus = new Component({
            tag: 'div',
            className: isActive ? 'user_status--active' : 'user_status--inactive',
        });
        this.userName = new Component({
            tag: 'div',
            className: 'user_name',
            text: login,
        });
        this.unreadCount = new Component({
            tag: 'div',
            className: 'user_unread-count',
        });
        this.setupSubscribtions();
        this.setupAttribute();
        // this.setupListener();
        this.build();
    }

    getMessagesHistory() {
        this.messagesHistoryRequestId = uuidv4();
        PS.sendEvent(PublishSubscribeEvent.WSMessage, {
            id: this.messagesHistoryRequestId,
            type: WSMessageType.MSG_FROM_USER,
            payload: {
                user: {
                    login: this.login,
                },
            },
        });
    }

    renderUnreadMessagesCount(payload: WSPayload) {
        const { messages } = payload;
        if (messages) {
            this.unreadMessages = messages.filter((message) => message.from === this.login && !message.status.isReaded);
            if (this.unreadMessages.length) {
                this.unreadCount.setTextContent(String(this.unreadMessages.length));
            } else {
                this.unreadCount.addClass('user_unread-count--hidden');
            }
        }
    }

    handleUserLogin() {
        this.isActive = true;
        this.userStatus.removeClass('user_status--inactive');
        this.userStatus.addClass('user_status--active');
    }

    handleUserLogout() {
        this.isActive = false;
        this.userStatus.removeClass('user_status--active');
        this.userStatus.addClass('user_status--inactive');
    }

    handleNewMessage(message: Message) {
        this.unreadMessages.push(message);

        this.unreadCount.removeClass('user_unread-count--hidden');
        this.unreadCount.setTextContent(String(this.unreadMessages.length));
    }

    handleMessageRead(readedMessage: Message) {
        const messageIndex = this.unreadMessages.findIndex((message) => message.id === readedMessage.id);
        if (messageIndex >= 0) {
            this.unreadMessages.splice(messageIndex, 1);
            if (this.unreadMessages.length) {
                this.unreadCount.setTextContent(String(this.unreadMessages.length));
            } else {
                this.unreadCount.addClass('user_unread-count--hidden');
            }
        }
    }

    listenSocket(data: WSMessage) {
        switch (data.type) {
            case WSMessageType.MSG_FROM_USER:
                if (data.id === this.messagesHistoryRequestId) {
                    this.renderUnreadMessagesCount(data.payload);
                }
                break;
            case WSMessageType.USER_EXTERNAL_LOGIN:
                if (data.payload.user?.login === this.login) {
                    this.handleUserLogin();
                }
                break;
            case WSMessageType.USER_EXTERNAL_LOGOUT:
                if (data.payload.user?.login === this.login) {
                    this.handleUserLogout();
                }
                break;
            case WSMessageType.MSG_SEND:
                if (data.payload.message?.from === this.login) {
                    this.handleNewMessage(data.payload.message);
                }
                break;
            case WSMessageType.MSG_READ:
                if (data.payload.message) {
                    this.handleMessageRead(data.payload.message);
                }
                break;
            default:
                break;
        }
    }

    setupSubscribtions() {
        PS.subscribe(PublishSubscribeEvent.WSMessageReceived, this.listenSocket.bind(this));
    }

    // setupListener() {
    //     this.inputField.addListener('input', (event) => {
    //         this.userNameFilter = (event.target as HTMLInputElement).value;
    //         this.renderActiveUsersList();
    //         this.renderInactiveUsersList();
    //     });
    //     this.activeUsersList.addListener('click', (event) => {
    //         if ((event.target as HTMLElement).classList.contains('user_name')) {
    //             PS.sendEvent(PublishSubscribeEvent.SelectInterlocutor, { login: (event.target as HTMLElement).id, active: true });
    //         }
    //     });
    //     this.inactiveUsersList.addListener('click', (event) => {
    //         if ((event.target as HTMLElement).classList.contains('user_name')) {
    //             PS.sendEvent(PublishSubscribeEvent.SelectInterlocutor, { login: (event.target as HTMLElement).id, active: false });
    //         }
    //     });
    // }

    setupAttribute() {
        this.userName.setAttribute('id', this.login);
    }

    build() {
        this.appendChildren([this.userStatus, this.userName, this.unreadCount]);
        this.getMessagesHistory();
    }
}
